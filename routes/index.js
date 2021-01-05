const express = require('express');
const router = express.Router();
const EmailID = require('../models/email')
const nodemailer = require('nodemailer');
const cron = require('node-cron');
const controller = require('../controllers/controller');

router.get('/',controller.homepage);

router.get('/add',(req,res)=>{
    res.render("add_email")
});

router.post('/add',controller.addSchedule);

// router.update('/')

module.exports = router;