const mongoose = require('mongoose')
require("dotenv").config();

const connectDataBase = () => {
    mongoose.connect(process.env.DBURL)
        .then(() => {
            console.log('Database Connected');
        })
        .catch((error) => {
            console.log(error)
        })
}

module.exports = connectDataBase