import { Router } from "express";
/* import { userModel } from "../models/users.models.js";
import { validatePassword } from "../utils/bcrypt.js"; */
import passport from "passport";

const sessionRouter = Router();

sessionRouter.get('/', (req,res) => {
    res.render('home')
})

sessionRouter.post('/', passport.authenticate('login'), async (req,res) => {
    try {
        if(!req.user) {
            return res.status(401).send({mensaje: "Invalidate user"})
        }

        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            age: req.user.age,
            email: req.user.email
        }

        res.redirect('/products') 
    } catch (error) {
        res.status(500).send({mensaje: `Error al iniciar sesion ${error}`})
    }
})

//HASH SIN PASSPORT(COMENTADA)

/* sessionRouter.post('/', async (req,res) => {
    const {email,password} = req.body
    req.session.email = email
    try {
        if(req.session.login){
            res.redirect('/products')
        }
        const user = await userModel.findOne({email:email})
        if(user) {
            if(validatePassword(password, user.password)) {
                req.session.login = true
                res.redirect('/products')
            } else {
                res.status(401).send({resultado: 'Unauthorized', message: user})
            }
        }else {
            res.status(404).send({resultado: 'Not Found', message: user})
        }
    } catch(error) {
        res.status(400).send({error: `No se pudo loguear: ${error}`})
    }
}) */

sessionRouter.get('/github', passport.authenticate('github', {scope: ['user:email']}), async (req,res) => {
    res.redirect('products')
})

sessionRouter.get('/githubSession', passport.authenticate('github'), async(req,res) => {
    req.session.user = req.user
    res.status(200).send({mensaje: 'session creada'})
})

sessionRouter.post('/', passport.authenticate('login'), async (req,res) => {
    try {
        if(!req.user) {
            return res.status(401).send({mensaje: "Invalidate user"})
        }

        req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            age: req.user.age,
            email: req.user.email
        }

        res.status(200).send({payload: 'dsada'})
    } catch (error) {
        
    }
})

export default sessionRouter