const nodeMailer = require('nodemailer');
const express = require('express');
var CronJob = require('cron').CronJob;
const axios = require('axios');
var bodyParser = require('body-parser')
const mongoose = require('mongoose')

const dotenv = require('dotenv')
dotenv.config({ path: __dirname + '/.env' });

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }))


var status = 'Probably unprefarable'


app.get('/', function (req, res) {
    res.render('home', { foo: status });
});

app.get('/About', (req, res) => {
    res.sendFile(__dirname + '/About.html')
});


////SETTING UP THE DATABASE


mongoose.set('strictQuery', true);

// mongoose.connect('mongodb://localhost:27017/surfappDB')

const connectDB = async () => {

    try {
        const conn = await mongoose.connect(process.env.mongooseUri, {
            //must add in order to not get any error messeges:
            useUnifiedTopology: true,
            useNewUrlParser: true,

        })
        console.log(`mongo database is connected!!! ${conn.connection.host} `)
    } catch (error) {
        console.error(`Error: ${error} `)
        process.exit(1) //passing 1 - will exit the proccess with error
    }

}



const surfappSchema = new mongoose.Schema({
    address: String,

});

const Address = mongoose.model('Address', surfappSchema);


////CREATING ADDRESS FROM FORM



app.post('/', async (req, res) => {

    const addressName = req.body.newAddress;

    const address = new Address({
        address: addressName
    })
    Address.exists({ address: { $in: addressName } }, function (err, result) {
        if (result == null) {
            address.save();
            res.sendFile(__dirname + '/success.html')
        } else {
            res.sendFile(__dirname + '/userExists.html')
        }
    })
})



///DELETING ADDRESS FROM FORM

app.post('/delete', async (req, res) => {

    const toDelete = req.body.deleteAddress;
    await Address.deleteOne({ address: { $in: toDelete } });
    res.sendFile(__dirname + '/unsubscribeSuccess.html')

});



////RUNNING THE APP



const cronJob = new CronJob('0 8,11,14,17 * * *', run);
cronJob.start();

async function run() {
    try {
        const allData = await getWeather()
        console.log('all data', allData);
        if (allData.wind > 10 && allData.degrees < 135 && allData.degrees > 20) {
            if (allData.windSecondCriteria < 4 && allData.degreesSecondCriteria < 360 && allData.degreesSecondCriteria > 165) {
                await sendEmail();
                status = 'Could be favorable'
            }
        }
    }
    catch (e) {
        console.log(e)
    }
}


////AXIOS API SMHI

const url = 'https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/2/geotype/point/lon/14/lat/55/data.json'


function getWeather() {
    return axios.get(url).then(result => {
        return {
            wind: result.data.timeSeries[24].parameters[4].values[0],
            degrees: result.data.timeSeries[24].parameters[3].values[0],
            windSecondCriteria: result.data.timeSeries[26].parameters[4].values[0],
            degreesSecondCriteria: result.data.timeSeries[26].parameters[3].values[0]
        };
    });
}


// MAIL NOTIFICATION


const html = `
<h1 style="color:#6E9CAC;">There could be surf at Knäbäckshusen in 24 hours<h1>
<p style="color:#9A9A9A;">Use a surf app to check the conditions</p>
`;


async function sendEmail() {

    const transporter = nodeMailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.nodemailerSender,
            pass: process.env.password
        }
    });

    return Address.find()
        .then(items => {
            items.forEach(items => {
                transporter.sendMail({
                    from: process.env.nodemailerFrom,
                    to: items.address,
                    subject: 'Surf Notification',
                    html: html,
                })
            })
        })
}


connectDB()


const port = process.env.PORT || 5000;

app.listen(port, function () {
    console.log('server started')
})

