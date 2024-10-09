const mongoose = require('mongoose')

const connectdb = () => {
    mongoose.connect(process.env.MONGODB_URL).then(() => {
        console.log(`Database connected successfully`)
    }).catch(err => {
        console.log('Error in database connection', err)
    })
}
module.exports = connectdb;