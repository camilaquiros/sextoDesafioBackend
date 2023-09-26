import { Router } from "express";
import { userModel } from "../models/users.models.js";
/* import { createHash } from "../utils/bcrypt.js"; */
import passport from "passport";

const userRouter = Router()

userRouter.get('/register', async(req, res) => {
    res.render('register')
})


//REGISTRO SIN PASSPORT(COMENTADO)

/* userRouter.post('/register', async(req,res) => {
    const {first_name, last_name, email, password, age} = req.body
    try{
        const hashPassword = createHash(password)
        const respuesta = await userModel.create({first_name: first_name, last_name: last_name, email: email, password: hashPassword, age: age})
        res.render('user', {first_name: respuesta.first_name, last_name: respuesta.last_name, age: respuesta.age, email: respuesta.email, isLoged: req.session.email != undefined})
    } catch(error) {
        res.status(400).send({error: `No se pudo registrar el usuario: ${error}`})
    }
}) */

userRouter.post('/register', passport.authenticate('register'), async (req,res) => {
    try {
        if(!req.user) {
            res.status(400).send({mensaje: 'usuario ya existente'})
        }
        return res.render('user', {first_name: req.user.first_name, last_name: req.user.last_name, age: req.user.age, email: req.user.email, isLoged: req.session.email != undefined})
    } catch (error) {
        res.status(500).send({mensaje: `error al crear usuario ${error}`})
    }
})

userRouter.get('/details', async(req,res) => {
    res.render('user', {first_name: req.user.first_name, last_name: req.user.last_name, age: req.user.age, email: req.user.email, isLoged: req.session.email != undefined})
})


export default userRouter