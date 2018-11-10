const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product');

//Get all products
router.get('/',(req,res,next)=>{
    Product.find().select('name price _id').exec()
    .then(result=>{
        const response = {
            count:result.length,
            products: result.map(res =>{
                return{
                    name: res.name,
                    price: res.price,
                    _id: res._id,
                    request:{
                        type: 'GET',
                        url: 'http://localhost:3000/products/'+res._id
                    },
                }
            })
        };

        res.status(200).json(response);
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
            message:'Product was created',
            createdProduct:{
                name:result.name,
                price:result.price,
                _id:result.id,
                request:{
                    type: "GET",
                    url:"http://localhost:3000/procduct/+"+result._id
                }
            }
        });
    }).catch(err=>{
        console.log(err);
        res.status(500).json({error:err});
    });
});

//Get a specific product
router.get('/:productId',(req,res,next)=>{
    const id = req.params.productId;
    Product.findById(id).select('name price _id').exec()
    .then(result=>{
        console.log(result);
        if(result){
         res.status(200).json({
            product: result.name,
            price: result.price,
            id: result._id
         });
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
        res.status(200).json({
           message:'Product updated',
           request:{
            type: 'GET',
            url: 'http://localhost:3000/products/'+id
           }
        });
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