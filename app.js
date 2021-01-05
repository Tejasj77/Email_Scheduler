const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const home_routes = require('./routes/index')
const config = require('./config/database')
const emailScheduler = require('./email_scheduler')
const EmailID = require('./models/email')
const nodemailer = require('nodemailer')
const cron = require('node-cron')
//Views 
app.set('views',path.join(__dirname,'views'));

//Static
app.use(express.static(path.join(__dirname,'public')));
app.set('view engine','pug');


//Body-Parser
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());

//Database connection
mongoose.connect(config.database,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
});

let db = mongoose.connection;
db.once('open',()=>{
    console.log('Connected to MongoDB');
});
db.once('close',()=>{
    console.log("Closed connection")
});
db.on('error',(err)=>{
    console.log(err);
});


function sendEmail(obj){
    console.log(obj)
    let outputHtml = `<h1></h1>
    <h4>${obj["subject"]}</h4>
    <p>${obj["text"]}</p>
    <h4>GoodBye</h4>`

    let transporter = nodemailer.createTransport({
        host: config.host,
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: 'tejasjoshitj@gmail.com', // generated ethereal user
          pass: config.pass, // generated ethereal password
        },
        tls:{
            rejectUnauthorized:false
        }
      });
      
      let timearr = obj["timeToSend"].split(' ');
      console.log(timearr)
      var info;
      // send mail with defined transport object
      cron.schedule(`${timearr[1]} ${timearr[0]} ${timearr[2]} ${timearr[3]} *`,()=>{
        info = transporter.sendMail({
            from: '"Tejas Joshi👻" <tejasjoshitj@gmail.com>', // sender address
            to: obj["email_id"], // list of receivers
            subject: obj["subject"], // Subject line
            text: obj["text"], // plain text body
            html: outputHtml, // html body
            dsn: {
                id: 'some random message specific id',
                return: 'headers',
                notify: ['failure', 'delay'],
                recipient: 'tejasjoshitj@gmail.com'
            }
            
          });
          console.log("Sent")
          return true
      })
      
    
    //   console.log("Message sent: %s", info.messageId);
    //   Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    
    //   Preview only available when sending through an Ethereal account
    //   console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    //   Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    }


//Routes
app.get('*',(req,res,next)=>{
    console.log("Triggered");
    let data = EmailID.find({},(err,data)=>{
        if(err){
            console.log(err);
        }else{
            let date = new Date();
            let today = {
                today_date:date.getDate(),
                today_month:date.getMonth()+1,
                today_Hour:date.getHours(),
                today_Minute:date.getMinutes()
            }
            let check_string = `${today["today_Hour"]} ${today["today_Minute"]} ${today["today_date"]} ${today["today_month"]}`
            console.log(check_string)
            query = {timeToSend:check_string}
            var arr_data = {};
            EmailID.find({},async (err,data)=>{
                if(err){
                    console.log(err);
                }else{
                    for(var key in data){
                        arr_data[data[key]['timeToSend']] = data[key]   
                    }
    
                    for(var time in arr_data){ 
                        console.log(arr_data[time])
                        if(arr_data[time].timeToSend == check_string){
                            console.log("Here")
                            console.log(arr_data[time]["timeToSend"])
                            await sendEmail(arr_data[time]);
                        }   
                    }
                }
            })
    }
      });
      next();
});
app.use('/',home_routes);

app.listen(3000,()=>{
    console.log("Server is running");
})

module.exports = app;
