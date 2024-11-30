
// get All Student
const path = require("path");
const { readFileSync, writeFileSync } = require("fs");
const sendMail = require("../utility/sendMail");
const sendSms = require("../utility/sendSms");

const getLoginStudents = async (req, res) => {
    res.render("user/login");
};

const storeLoginStudents = async (req, res) => {

    sendMail(req.body.email, "welcome");
    sendSms(req.body.phone, `Hi ${req.body.name} , You are welcome To Layerdrops, Your Email Is ${req.body.email}`);
    res.json(req.body)

};


module.exports = {
    getLoginStudents,
    storeLoginStudents
};