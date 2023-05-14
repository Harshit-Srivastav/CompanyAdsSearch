const mongoose = require('mongoose')
const Ads = require('./adsModel')

// Creating Company Model
const companySchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        unique: true,
        required: true
    },
    url: {
        type: String,
        required: true
    }
})

companySchema.virtual('ads', {
    ref: 'Ads',
    localField: '_id',
    foreignField: 'companyId'
}, {strictPopulate: false})

const Company = mongoose.model('Company', companySchema)

module.exports = Company