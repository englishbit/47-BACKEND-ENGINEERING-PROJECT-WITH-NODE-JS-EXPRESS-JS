const express=require('express')
const upload=require('./textfileUpload')
const app=express()

app.use(express.json())

app.use('/api/upload',upload)

module.exports=app