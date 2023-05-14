const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()
const connectDB = require('./db/dbConn.js')
const Ads = require('./models/adsModel.js')
const saveRecords = require('./xl.js')
const Company = require('./models/companyModel.js')
connectDB(process.env.DB_URL)

const app = express()
const port = process.env.PORT || 5000
app.use(cors())
//Using middleware to save all new records and delete previous records
app.use(saveRecords)
app.listen(port, () => {
    console.log(`Server is running on PORT ${port}`)
})

// @route - for fetching all the ads
app.get('/api/ads', async (req, res) => {
    try{
        const result = await Ads.find({}).populate('companyId')
        res.status(200).send(result)
    } catch(e) {
        res.status(400).send(e.message)
    }
})

// @ route - for fetching ads matching respective keywords
app.get('/api/search', async (req, res) => {
    try{
        const keyword = req.query.keyword ? req.query.keyword.toString() : ""
        const options = { readConcern: { level: 'majority' , readPreference: 'primary'} };
         let result = await Ads.find({
            $or: [
                { primaryText: { $regex: keyword, $options: 'i'} },
                { CTA: { $regex: keyword, $options: 'i'} },
                { description: { $regex: keyword, $options: 'i'} },
                { headline: { $regex: keyword, $options: 'i'} }
            ]
         }).populate('companyId')
        const isEmpty = result.length === 0 ? true : false;
        if(isEmpty) {
           const companyResult = await Company.find({
                $or: [
                    {name: {$regex: keyword, $options: 'i'}}
                ]
            })
            const companyId = companyResult[0]._id
            const result = await Ads.find({companyId: companyId}).populate('companyId')
            res.status(200).send(result)
        } else {
            res.status(200).send(result)
        }
    } catch(e) {
        res.status(400).send('Error!! Please try again')
    }

})


