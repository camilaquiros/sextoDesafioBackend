import { Router } from "express";
import { productModel } from "../models/products.models.js";
const productRouter = Router();

//GET
productRouter.get('/', async(req, res) => {
    try {
        const prods = await productModel.find()
        const array = {
            products: prods.map(product => ({
                title: product.title,
                description: product.description,
                category: product.category,
                price: product.price,
                stock: product.stock,
                _id: product._id
            }))
        };   
        res.render('products', {products: array.products, first_name: req.user.first_name, last_name: req.user.last_name, rol: req.user.rol})      
    } catch (error) {
        res.status(400).send({error: `No se pudo obtener productos con Mongoose: ${error}`})
    }
})

export default productRouter;