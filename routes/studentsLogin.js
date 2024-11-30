const express = require('express');
const {getLoginStudents, storeLoginStudents} = require("../controllers/studentLoginController");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();


// Multer Config & Set storage engine
const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, path.join(__dirname, "../public/user/"))
    }, 
    filename: (req, file, cb) => { 
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

// Initialize upload variable
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }, // limit file size to 1MB
    fileFilter: (req, file, cb) => { checkFileType(file, cb)}
}).single('studentImage'); 
  
// Check File Type
function checkFileType(file, cb) {

    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
  
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Images Only!');
    }
}

// Define your routes

router.get('/login', getLoginStudents);
router.post('/login', upload, storeLoginStudents);

module.exports = router;
