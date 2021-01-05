const express = require('express');
const EmailID = require('../models/email');
// const sendEmail = require('../email_scheduler');
const nodemailer = require('nodemailer');
const cron = require('node-cron');

function sendEmail(obj){
    let outputHtml = `<h1></h1>
    <h4>${obj["subject"]}</h4>
    <p>${obj["text"]}</p>
    <h4>GoodBye</h4>`

    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: 'tejasjoshitj@gmail.com', // generated ethereal user
          pass: '69917070gaandiv7', // generated ethereal password
        },
        tls:{
            rejectUnauthorized:false
        }
      });
      
      let timearr = obj["timeToSend"].split(' ');
      // send mail with defined transport object
      cron.schedule(`${timearr[1]} ${timearr[0]} ${timearr[2]} ${timearr[3]} *`,async ()=>{
        var info = await transporter.sendMail({
            from: '"Tejas Joshi👻" <tejasjoshitj@gmail.com>', // sender address
            to: obj["email_id"], // list of receivers
            subject: obj["subject"], // Subject line
            text: obj["text"], // plain text body
            html: outputHtml, // html body
          });
      })
      
    
    //   console.log("Message sent: %s", info.messageId);
    //   Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    
    //   Preview only available when sending through an Ethereal account
    //   console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    //   Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    }



exports.homepage = (req,res)=>{
           EmailID.find({},(err,data)=>{
               if(err){
                   console.log(err);
               }else{
                   res.json(data);
               }
           })            
        }



exports.addSchedule = (req,res)=>{
    let new_email = new EmailID();
    new_email.subject = req.body.subject;
    new_email.text = req.body.text;
    new_email.email_id = req.body.email_id;
    new_email.timeToSend = req.body.timeToSend;

    console.log(new_email);
    new_email.save().then(()=>console.log("Success"));   
    res.redirect("/");
}