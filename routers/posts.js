const router = require("express").Router()
const isAuthenticated = require("../middlewares/isAuthenticated")
const prisma = require('../lib/prisma')
// 呟き登録用API
router.post('/post',isAuthenticated, async(req,res)=>{
  const {content} =req.body

  if(!content) {
    return res.status(400).json({message:'投稿内容がありません'});
  }
  try {
   const newPost = await prisma.pOST.create({
      data: {
        content,
        authorId:req.userId,
      },
      include: {
        author:{
          include: {
            profile :true
          }
        }
      }
    })
    return res.status(201).json(newPost)
  }catch(e) {
    console.log(e);
    return res.status(500).json({message:'サーバーエラーです'});
  }
})

//最新投稿取得API
router.get('/get_latest_post',async(req,res)=>{
  try {
   const latestPosts = await prisma.pOST.findMany({
    take:10,
    orderBy:{createAt:"desc"},
    include: {
      author:{
        include: {
          profile:true
        }
      }
    }
  })
   return res.json(latestPosts);
  }catch (e) {
    console.log(e);
    return res.status(500).json({message:'サーバーエラーです'})
  }
})

//その閲覧しているユーザの投稿内容だけを表示
router.get('/:userId',async(req,res)=>{
  const {userId} = req.params;
  try {
    const userPost = await prisma.pOST.findMany({
      where : {
        authorId:parseInt(userId)
      },
      orderBy: {
        createAt:'desc'
      },
      include: {
        author:true
      }
    })
     return res.status(200).json(userPost);
  }catch(e) {
    console.log(e);
    return res.status(500).json({message:'サーバーエラーです'})
  }
})
module.exports = router;
