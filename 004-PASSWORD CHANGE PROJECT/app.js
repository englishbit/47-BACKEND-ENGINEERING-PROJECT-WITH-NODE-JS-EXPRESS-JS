const express=require('express')
const app=express()

app.use(express.json())


app.use('/signup',require('./signup'))
app.use('/signin',require('./signin'))
app.use('/password-change',require('./passwordChange'))

module.exports=app