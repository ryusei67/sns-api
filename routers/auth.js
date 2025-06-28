const router = require("express").Router()
const bcrypt = require('bcrypt')
const  jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');
const generateIdetion = require("../utils/generateideticon");
// 新規ユーザー登録API
router.post('/register', async(req,res)=>{
  const {username,email,password} =req.body

  const defaultIconImage = generateIdetion(email)
  const hashedPassword = await bcrypt.hash(password,10)
  const user = await prisma.user.create({
    data: {
      username,
      email,
      password:hashedPassword,
      profile : {
        create: {
          bio : "初めまして",
          profileImageUrl: defaultIconImage
        }
      }
    }
  })
  return res.json({user})
})

// ユーザログインAPI
// →tokenをclientに渡す
router.post('/login',async(req,res)=>{
  const {email,password} =req.body
  const user = await prisma.user.findUnique({where:{email}})
  if(!user) {
    console.log('a');
    return res.status(401).json({error:'そのユーザは存在しません'})
  }
  const isPasswordVaild = await bcrypt.compare(password,user.password)
  console.log(isPasswordVaild)
  if(!isPasswordVaild) {
    return res.status(401).json({error:'そのパスワードが間違っています'})
  }
  const token = jwt.sign({id:user.id},process.env.SECRET_KEY,{
    expiresIn:"1d"
  })
  return res.json({token})
})
module.exports = router;
