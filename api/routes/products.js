const express = require('express');
const router = express.Router();

router.get('/',(req,res,next)=>{
    res.status(200).json({
        message:'Handling get request to /products'
    });
});

router.post('/',(req,res,next)=>{
    res.status(200).json({
        message:'Handling post request to /products'
    });
});

router.get('/:productId',(req,res,next)=>{
    const id = req.params.productId;
    if(id === 'special'){
        res.status(200).json({
            message: 'You discovered the special ID',
            id:id
        });
    }else{
        res.status(200).json({
            message:"You passed an ID",
            id:id
        });
    }
});

router.patch('/:productId', (req,res,next)=>{
    const id = req.params.productId;
    res.status(200).json({
        message:'Product with id:'+id+' has been updated',
        id:id,
    });
});

router.delete('/:productId', (req,res,next)=>{
    const id = req.params.productId;
    res.status(200).json({
        message:'Product with id: '+id+' has been deleted',
    })
});

module.exports = router;