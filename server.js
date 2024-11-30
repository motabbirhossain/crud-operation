const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const express = require('express');
const app = express();
const dotenv = require('dotenv');
const students = require('./routes/students');
const user = require('./routes/studentsLogin');
dotenv.config();

//Data Manages
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Set the view engine to ejs
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layouts/main');

// Set the views directory
app.set('views', path.join(__dirname, 'views'));

// Set the public directory
app.use(express.static(path.join(__dirname, 'public')));

app.use('/user', user)
app.use('/student', students)

// Start the server
const PORT = process.env.PORT || 3000;

app.listen(PORT, '127.0.0.1', () => {
    console.log(`Server is running on port ${PORT}`);
});
