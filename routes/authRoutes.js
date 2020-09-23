const express = require('express')
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const {jwtkey} = require('../keys')
const router = express.Router();
const User = mongoose.model('User');


router.post('/users/signup',async (req,res)=>{
   
    const {email,password} = req.body;

    try{
      const user = new User({email,password});
      await  user.save();
      const token = jwt.sign({userId:user._id},jwtkey)
      res.send({token})

    }catch(err){
      return res.status(422).send(err.message)
    }
    
    
})

router.post('/users/signin',async (req,res)=>{
    const {email,password} = req.body
    if(!email || !password){
        return res.status(422).send({error :"must provide email or password"})
    }
    const user = await User.findOne({email})
    if(!user){
        return res.status(422).send({error :"must provide email or password"})
    }
    try{
      await user.comparePassword(password);    
      const token = jwt.sign({userId:user._id},jwtkey)
      res.send({token})
    }catch(err){
        return res.status(422).send({error :"must provide email or password"})
    }
})


router.post('/admin/add',async (req,res)=>{
    const {email,password} = req.body;

    try{
      const user = new User({email,password});
      await  user.save();
      const token = jwt.sign({userId:user._id},jwtkey)
      res.send({token})

    }catch(err){
      return res.status(422).send(err.message)
    }
})


router.post('/admin/delete',async (req,res)=>{
    const {email} = req.body.email
    if(!email){
        return res.status(422).send({error :"must provide email 1"})
    }
    const user = await User.findOne({email})
    if(!user){
        return res.status(422).send({error :"must provide registered email"})
    }
    try{
      await User.findOneAndDelete(email)
      .then(()=>{
        res.send({'message' : 'user deleted successfully'})
      })
      
    }catch(err){
        return res.status(422).send({error :"must provide email 2"})
    }
})


module.exports = router