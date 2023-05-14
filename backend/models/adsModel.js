const mongoose = require('mongoose')

// Creating Ads Model
const adsSchema = new mongoose.Schema({
    primaryText: {
        type: String,
        required: true
    },
    headline: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    CTA: {
        type: String,
        required: true
    },
    imageUrl: {
        type:String,
        required: true
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company'
    }
})


const Ads = mongoose.model('Ads', adsSchema)

module.exports = Ads