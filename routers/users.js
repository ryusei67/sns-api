const router = require("express").Router()
const isAuthenticated = require("../middlewares/isAuthenticated")
const prisma = require('../lib/prisma')
const { route } = require("./auth")


router.get('/find', isAuthenticated , async(req,res)=>{
  try {
    const user = await prisma.user.findUnique({where:{id:req.userId}})
    console.log(user);
    if(!user) {
      res.status(404).json({error:'ユーザーが見つかりませんでした'})
    }
    res.status(200).json({user:{id:user.id,email:user.email, username:user.username}});

  }catch(e) {
    res.status(500).json({error:e.message})
  }
})


router.get('/profile/:userId',async(req,res)=>{
  const {userId}  = req.params;
  try {
    const profile = await prisma.profile.findUnique({
      where: {userId:parseInt(userId)},
      include: {
        user: {
          include: {
            profile:true
          }
        }
      }
    })
    if(!profile) {
     return res.status(404).json({message:'プロフィールが見つかりませんでした'})
    }
    return res.status(200).json(profile)
  }catch(e) {
    console.log(e);
    res.status(500).json({error:e.message})
  }
})

module.exports = router;