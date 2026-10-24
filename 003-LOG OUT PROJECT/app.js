const express=require('express')
const cookieParser=require('cookie-parser')

app=express()

app.use(express.json())
app.use(cookieParser())


app.use(require('./signup'))
app.use(require('./signin'))
app.use(require('./logout'))

module.exports=app
