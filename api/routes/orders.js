const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../models/order');
const Product = require('../models/product');
//Handle incomming request for orders.
router.get('/', (req,res,next) => {
    Order.find().select('product quantity _id').populate('product', 'name').exec()
    .then(result=>{
        const response = {
            count:result.length,
            orders: result.map(res =>{
                return{
                    orderId: res._id,
                    quantity: res.quantity,
                    product: res.product,
                    request:{
                        type: 'GET',
                        url: 'http://localhost:3000/orders/'+res._id
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

router.post('/', (req,res,next)=>{
    Product.findById(req.body.productId).then(product=>{
    if(!product){
        return res.status(404).json({
            message:'Product not found'
        });
    }
    const order = new Order({
        _id: mongoose.Types.ObjectId(),
        quantity: req.body.quantity,
        product: req.body.productId
    });
   return order.save();
    }).then(results =>{
        res.status(201).json({
            message:"Order has been saved",
            request:{
                type:"GET",
                url:"http://localhost:3000/orders/"+results._id
            }
        });
    }).catch(error=>{
        res.status(500).json({
            error:error
        })
    });
});

router.get('/:orderId', (req,res,next)=>{
    let id = req.params.orderId;
    Order.findById(id).populate('product').exec()
    .then(result=>{
        res.status(200).json({
            order: result,
            request:{
                type:'GET',
                url:'http://localhost:3000/orders/'+result._id
            }
        })
    }).catch(err=>{
        console.log(err);
        res.status(500).json({message:'Something went wrong', error:err});
    })
});

router.delete('/:orderId', (req,res,next)=>{
    let order = Order.findById(req.params.orderId);
    Order.deleteOne(order, function(err, obj){
        if(!err){
            res.status(200).json({
                message: 'Order was deleted',
                request:{
                    type:'POST',
                    url:'http://localhost:3000/orders',
                    params:{productId: 'id of the product', quantity:'quantity of the products'}
                }
            });
        }else{
             res.status(500).json({error:error});
        }
    });
});
module.exports = router;