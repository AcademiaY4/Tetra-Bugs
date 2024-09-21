require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const cors = require('cors')
// Import CorsConfig before using it
const corsOption  = require("./config/CorsConfig");

/*
* limiting server request resources
* Below express rate limiter is used
* set a limit of 10 requests per minute for each IP address
*/
const rateLimit = require('express-rate-limit');
// Set a limit of 10 requests per minute for each IP address
const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // limit each IP to 10 requests per windowMs
    message: { success: false, error: "Too many requests, please try again later." }
});

const app = express()

/**
 * limiting server request resources
 * Below mainly 100kb is considered
**/
app.use(express.json({ limit: '100kb' }));

app.use(bodyParser.json())
app.use(cors(corsOption))

const tutorialRoutes = require('./routes/tutorialRoutes')
const challengesRoutes = require('./routes/challengesRoutes')
const userRoutes = require('./routes/userRoutes');

app.use('/adminApp',rateLimit, tutorialRoutes)
app.use('/adminApp/challengesRoutes',rateLimit, challengesRoutes)
app.use("/admin/users", rateLimit,userRoutes);
app.use('/admin/tutorials',rateLimit, tutorialRoutes)

//compiler
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const compilerRoutes = require('./routes/compilerRoutes');
const { default: CorsConfig } = require("./config/CorsConfig");
app.use('/compiler', compilerRoutes)


const PORT = 5000
const DB_URL = 'mongodb+srv://CodePedia:Y3S1@cluster0.y81ww5h.mongodb.net/?retryWrites=true&w=majority'

mongoose.connect(DB_URL).then(() => {
    console.log('Database was connected')
}).catch((err) => {
    console.log('Database was not connected, Error orccured')
    console.log(err)
})

app.listen(PORT, () => {
    console.log(`Server is Running on ${PORT}`)
})