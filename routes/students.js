const express = require('express');
const {getAllStudents , getCreateStudents, getShowStudents, getEditStudents, studentDataStore, getDeletedStudents, getUpdateStudents, getUnverifiedStudents, verifiedAccount} = require("../controllers/studentController");
// const {getLoginStudents, storeLoginStudents} = require("../controllers/studentLoginController");
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();


// Multer Config & Set storage engine
const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, path.join(__dirname, "../public/image/"))
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
router.get('/', getAllStudents);
router.get('/unverified', getUnverifiedStudents);
router.get('/verified/:token', verifiedAccount);

// router.get('/login', getLoginStudents);
// router.post('/login', upload, storeLoginStudents);

router.get('/create', getCreateStudents);
router.post('/create', upload, studentDataStore);


router.get('/edit/:id', getEditStudents);
router.post('/update/:id', upload, getUpdateStudents);
router.get('/delete/:id', getDeletedStudents);

router.get('/:id', getShowStudents);

module.exports = router;
