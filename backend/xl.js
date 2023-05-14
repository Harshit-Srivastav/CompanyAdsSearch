const xlsx = require('xlsx')
const Company = require('./models/companyModel')
const Ads = require('./models/adsModel')
const mongoose = require('mongoose')
const companyData = []
const adsData = []

async function saveRecords(req, res, next) {
    try{
        await Ads.deleteMany()
        await Company.deleteMany()
        const workbook = xlsx.readFile('data.xlsx');
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = xlsx.utils.sheet_to_json(worksheet);
        companyData.push(...data)
       
        const records = data.map((record) =>{ 
            const _id = new mongoose.Types.ObjectId(record._id)
            return new Company({...record, _id})
        });
        
        await Company.insertMany(records)
        
        const workbookOne = xlsx.readFile('data.xlsx');
        const worksheetOne = workbookOne.Sheets[workbookOne.SheetNames[1]];
        const dataOne = xlsx.utils.sheet_to_json(worksheetOne);
        adsData.push(...data)
        const recordsOne = await Promise.all(dataOne.map(async (record) =>{ 
            
            const _id = new mongoose.Types.ObjectId(record._id)
            const company = companyData.find(company => company._id === record.companyId)
            const name = company.name
            const result = await Company.findOne({name})
            const companyId = result._id
            return new Ads({...record ,_id, companyId})
        }))
        
       await Ads.insertMany(recordsOne)
       next()
    } catch(e) {
        return res.status(400).send('Error! Try Again')
    }
    
}



module.exports = saveRecords