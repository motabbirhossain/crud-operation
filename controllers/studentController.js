// get All Student
const path = require("path");
const { readFileSync, writeFileSync } = require("fs");
const { sendMail } = require("../utility/sendMail");
const sendSms = require("../utility/sendSms");

const getAllStudents = async (req, res) => {

    const students = JSON.parse(
        readFileSync(path.join(__dirname, "../db/students.json"))
    );

    const verified = students.filter(data => data.isVerified == true)

    res.render("student/index", { students:verified});
};

const getUnverifiedStudents = async (req, res) => {
    const students = JSON.parse(
        readFileSync(path.join(__dirname, "../db/students.json"))
    );
    const unVerified = students.filter(data => data.isVerified == false)

    res.render("student/unvarified", { students:unVerified});
};

const getCreateStudents = async (req, res) => {
    res.render("student/create");
};

const getShowStudents = async (req, res) => {
    try {
        const { id } = req.params;
        const students = JSON.parse(readFileSync(path.join(__dirname, "../db/students.json")));

        const student = students.find(stu => stu.id === parseInt(id));
        if (!student) {
            return res.status(404).send('Student not found');
        }

        res.render("student/show", { student })
    } catch (error) {
        console.error('Error retrieving student data:', error);
        res.status(500).send('Internal Server Error');
    }
};

const getEditStudents = async (req, res) => {
    try {
        const students = JSON.parse(readFileSync(path.join(__dirname, "../db/students.json")));
        const { id } = req.params;

        // Find the student with the matching id
        const student = students.find(data => data.id === parseInt(id));

        if (!student) {
            return res.status(404).send('Student not found');
        }

        res.render("student/edit", {
            student
        });
    } catch (error) {
        console.error('Error retrieving student data:', error);
        res.status(500).send('Internal Server Error');
    }
};

// Store Data
const studentDataStore = async (req, res) => {

    const students = JSON.parse(readFileSync(path.join(__dirname, "../db/students.json")));

    const { name, email, phone, location} = req.body;

    let lastId = 1;
    if (students.length > 0) {
        lastId = students[students.length - 1].id + 1
    }

    const token = Date.now()+'_'+Math.floor(Math.random()*100000);

    
    // send Mail
    await sendMail(email, "welcome", {
        name,
        email,
        phone,
        token
    }); 

    await sendSms(phone, `Hi ${name} , You are welcome To Phone Verification, Your Email Is ${email}`);

    // Add New Data
    students.push({
        id: lastId,
        name,
        email,
        phone,
        location,
        photo: req.file ? req.file.filename : "avatar.jpg",
        isVerified: false,
        token
    });

    //Write File
    writeFileSync(path.join(__dirname, "../db/students.json"), JSON.stringify(students))
    res.redirect("/student")
};

const getDeletedStudents = async (req, res) => {

    const students = JSON.parse(readFileSync(path.join(__dirname, "../db/students.json")));

    const { id } = req.params;

    const student = students.filter(data => data.id != id)

    writeFileSync(path.join(__dirname, "../db/students.json"), JSON.stringify(student))

    res.redirect("/student")

};

const getUpdateStudents = async (req, res) => {
    try {
        const students = JSON.parse(readFileSync(path.join(__dirname, "../db/students.json")));
        const { id } = req.params;
        const { name, email, phone, location } = req.body;

        // Find the index of the student to be updated
        const studentIndex = students.findIndex(data => data.id == id);

        if (studentIndex === -1) {
            return res.status(404).send('Student not found');
        }

        // Update the student data
        students[studentIndex] = {
            ...students[studentIndex],
            name: name || students[studentIndex].name,
            email: email || students[studentIndex].email,
            phone: phone || students[studentIndex].phone,
            location: location || students[studentIndex].location,
            // Update the photo if a new file is uploaded
            photo: req.file ? req.file.filename : students[studentIndex].photo
        };

        // Write the updated students array back to the file
        writeFileSync(path.join(__dirname, "../db/students.json"), JSON.stringify(students, null, 2));

        res.redirect("/student"); // Redirect to the students page or any other appropriate route
    } catch (error) {
        console.error('Error updating student data:', error);
        res.status(500).send('Internal Server Error');
    }
};


//Varify Email
const verifiedAccount = async (req, res) => {
    // Token
    const students = JSON.parse(readFileSync(path.join(__dirname, "../db/students.json")));

    const token = req.params.token;

    // Find the index of the student to be updated
    const studentIndex = students.findIndex(data => data.token == token);

     // Update the student data
     students[studentIndex] = {
        ...students[studentIndex],
        isVerified: true,
        token: null
    };

    // Write the updated students array back to the file
    writeFileSync(path.join(__dirname, "../db/students.json"), JSON.stringify(students, null, 2));

    res.redirect("/student"); // Redirect to the students page or any other appropriate route
};

module.exports = {
    getAllStudents,
    getCreateStudents,
    getShowStudents,
    getEditStudents,
    studentDataStore,
    getDeletedStudents,
    getUpdateStudents,
    getUnverifiedStudents,
    verifiedAccount
};
