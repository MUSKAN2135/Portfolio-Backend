require('dotenv').config()
const express = require('express');
const cors = require("cors");
const userRouter = require('./Routes/userRoutes');
const connectdb = require('./database/db');



const app = express()
app.use(cors())

const port = process.env.PORT;

connectdb()
app.use(express.json())

app.use('/api/v1', userRouter)

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})