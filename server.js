const express = require('express');
const app = express();
const authRoute  =require("./routers/auth");
const postsRoute =require('./routers/posts')
const usersRoute =require('./routers/users')
const cors = require('cors')
// const PORT =process.env.PORT || 10000;
const PORT =5050
require('dotenv').config()
app.use(cors());
app.use(express.json())
app.use("/api/auth/",authRoute);
app.use('/api/posts', postsRoute);
app.use('/api/users',usersRoute)



app.listen(PORT,()=>{console.log(`server is running PORT ${PORT}`)})