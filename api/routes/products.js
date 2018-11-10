const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product');

//Get all products
router.get('/',(req,res,next)=>{
    Product.find().exec()
    .then(result=>{
        console.log(result);
        if(result){
            res.status(200).json(result);
        }else{
            res.status(204).json({error:"No data found."});
        }
    }).catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err,
        });
    })
});

//Create a product
router.post('/',(req,res,next)=>{
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price,
    });
    product.save().then(result =>{
        console.log(result);
            res.status(200).json({
            message:'Handling post request to /products',
            createdProduct:product
        });
    }).catch(err=>{
        console.log(err);
        res.status(500).json({error:err});
    });
});

//Get a specific product
router.get('/:productId',(req,res,next)=>{
    const id = req.params.productId;
    Product.findById(id).exec()
    .then(result=>{
        console.log(result);
        if(result){
         res.status(200).json(result);
        }else{
         res.status(404).json({error: 'Product with id: '+id+' not found.'});
        }
    }).catch(err=>{
        console.log(err);
        res.status(500).json({error: err});
    })
});

//update a product
router.patch('/:productId', (req,res,next)=>{
    const id = req.params.productId;
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName]=ops.value;
    }
    Product.update({_id:id}, { $set: updateOps}).exec()
    .then(result=>{
        console.log(result);
        res.status(200).json(result);
    }).catch(error=>{
        console.log(error);
        res.status(500).json({
            error:error
        });
    });
});

//Delete a product
router.delete('/:productId', (req,res,next)=>{
    const id = req.params.productId;
    Product.remove({_id: id }).exec()
    .then(result=>{
        console.log(result);
        res.status(200).json({message:'Product with id: '+id+' has been deleted'})
    }).catch(err=>{
        console.log(err);
        res.status(500).json({error:err});
    });
});

module.exports = router;