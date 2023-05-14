const mongoose = require('mongoose')
mongoose.set('strictQuery', true)

const connectDB = async (DB_URL) => {
    try {
        const dbObj = {
            dbName: 'companyAds'
        }
       const res = await mongoose.connect(DB_URL, dbObj)
      
    } catch(e) {
        console.log(e)
    }
}

module.exports = connectDB