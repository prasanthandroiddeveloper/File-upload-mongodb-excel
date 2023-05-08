const express = require('express')
const multer = require('multer')
const cors = require('cors')
const app = express()
const csv = require('csvtojson')
const employeeDetails = require('./model/emp.model')
const mongoose = require('mongoose')

app.use(express.json())
app.use(cors())


mongoose.connect('mongodb://localhost:27017/hcl_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function () {
    console.log('Connected to MongoDB');
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads")
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
});


const upload = multer({
    storage
})

app.post('/upload', upload.single("csvFile"), async (req, res) => {
    // res.json("ok")
    console.log(req.file.path, "filepath")
   // const arr=[]
    const jsonArray = await csv().fromFile(req.file.path).then(jsonobj => {
        console.log(jsonobj, "jsonArray")
        insertData(jsonobj)
    })
    console.log(jsonArray, "jsonArray")
    // employeeDetails.insertMany(jsonArray, (err, result) => {
    //     if (err) {
    //         return res.status(500).json(err)
    //     }
    //     return res.json("Added Successfully")
    // })

    function insertData(dataInsert){
        employeeDetails.insertMany(dataInsert).then(function (res) {
            console.log("Successfully saved defult items to DB", res);
        }).catch(function (err) {
            console.log(err);
        });
    }

   
})

app.listen(3000, () => {
    console.log("Server is running...")
})