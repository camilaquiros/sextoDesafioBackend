import 'dotenv/config'
import express from 'express'
import { engine } from 'express-handlebars'
import { __dirname } from './path.js'
import path from 'path'
import productsRouter from './routes/products.routes.js'
import cartRouter from './routes/cart.routes.js'
import userRouter from './routes/users.routes.js'
import sessionRouter from './routes/sessions.routes.js'
import passport from 'passport'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import mongoose from 'mongoose'
import { initializePassport } from './config/passport.js'
import { validatePassword } from './utils/bcrypt.js'


const app = express();
const PORT = 8080

//middlewares
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', path.resolve(__dirname, './views'))
app.use(cookieParser(process.env.SIGNED_COOKIE)) //firmar cookie
app.use(session({
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL,
        mongoOptions: {usenewUrlParser: true, useUnifiedTopology: true},
        ttl: 120 //tiempo en segundos (120 días = 10368000)
    }),
    secret: process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false
}))

function auth(req,res,next) {
    if(req.user.rol === 'admin') {
        return next() //continua con la ejecución normal de la ruta
    }
    return res.send('No tenes acceso a este contenido')
}

initializePassport()
app.use(passport.initialize())
app.use(passport.session())


app.get('/admin', auth, (req,res) => {
    res.send('sos admin')
})

app.post('/products', (req,res) => {
    req.session.destroy()
    res.redirect('/')
})

//rutas
app.use('/', sessionRouter)
app.use('/user', userRouter)
app.use(express.static(path.join(__dirname, '/public')))
app.use('/products', productsRouter)
app.use('/carts', cartRouter)

//server
app.listen(PORT, () => {
    console.log(`Escuchando puerto ${PORT}`)
});

//BDD
mongoose.connect(process.env.MONGO_URL)
    .then(async(req, res) => { 
        console.log("DB conectada")
    })
    .catch((error) => console.log("Error en conexion con MongoDB: ", error))



