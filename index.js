const express = require('express');
const app = express();
const { ObjectId } = require('mongodb');
let bodyParser = require('body-parser');
let expressSession = require('express-session');
let db = require('./database.js');
app.use(expressSession({secret:"CheateCode123!@#",resave:true,saveUninitialized:true}));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

app.get('/', function(req, res) {
    let msg = "";
    if (req.session.msg != undefined && req.session.msg != "") {
        msg = req.session.msg;
    }

    // Clear the message after using it
    req.session.msg = "";

    // Render the home view with the message
    res.render('home', { msg: msg });
});


app.get('/questions',async function(req,res){
    try{
        const questions = db.collection("Questions");
        const quesList = await questions.find().toArray();
        res.render("queslist_view",{quesList:quesList});
    }
    catch (err){
        console.log(err);
    }
});

app.get('/addquestion',function(req,res){
    res.render('addquestion_view');
});

app.post("/addQuesSubmit", async function(req, res) {
    try {
        const question = db.collection("Questions");
        const newQuestion = {
            Q_name: req.body.q_name,
            Q_explanation: req.body.q_explanation,
            Q_input: req.body.q_input,
            Q_output: req.body.q_output,
            TypeOfQues: req.body.type_of_ques,
            Solved: req.body.solved,
            Comp_name: req.body.comp_name
        };

        const result = await question.insertOne(newQuestion);

        if (result.acknowledged) {
            req.session.msg = "Question Added";
        } else {
            req.session.msg = "Question Not Added";
        }
        res.redirect('/'); // Redirect to the home page or where you want to display the message
    } catch (err) {
        console.log(err);
        req.session.msg = "An error occurred while adding the question";
        res.redirect('/');
    }
});
app.get("/deleteques", async function(req, res) {
    try {
        // Extract Q_id from query parameters
        const Q_id = req.query.quesid; // Ensure 'quesid' matches the query parameter name in the URL

       

        // Reference to the Questions collection
        const questions = db.collection("Questions");

        // Perform the deletion operation
        const result = await questions.deleteOne({ _id: new ObjectId(Q_id) });

        if (result.deletedCount ==1) {
            req.session.msg = "Question deleted successfully";
        } else {
            req.session.msg = "Question not found";
        }

        // Redirect to the appropriate page after deletion
        res.redirect('/');
    } catch (err) {
        console.error(err);
        req.session.msg = "An error occurred while deleting the question";
        res.redirect('/');
    }
});

app.get('/editques', async (req, res) => {
    try {
        const quesId = req.query.quesid; // Extract question ID from query parameter

        const questions = db.collection("Questions");
        const question = await questions.findOne({ _id: new ObjectId(quesId) });

        if (!question) {
            req.session.msg = "Question not found";
            return res.redirect('/questions');
        }

        res.render('editques_view', { question: question });
    } catch (err) {
        console.error(err);
        req.session.msg = "An error occurred while retrieving the question";
        res.redirect('/questions');
    }
});

app.post('/updateques', async (req, res) => {
    try {
        const quesId = req.body.quesid; // Extract question ID from form data
        const updatedQuestion = {
            Q_name: req.body.Q_name,
            Q_explanation: req.body.Q_explanation,
            Q_input: req.body.Q_input,
            Q_output: req.body.Q_output,
            TypeOfQues: req.body.TypeOfQues,
            Solved: req.body.Solved,
            Comp_name: req.body.Comp_name
        };

        

        const questions = db.collection("Questions");
        const result = await questions.updateOne(
            { _id: new ObjectId(quesId) },
            { $set: updatedQuestion }
        );

        if (result.matchedCount ==1) {
            req.session.msg = "Question updated successfully";
        } else {
            req.session.msg = "Question not found";
        }

        res.redirect('/');
    } catch (err) {
        console.error(err);
        req.session.msg = "An error occurred while updating the question";
        res.redirect('/');
    }
});

app.get('/prouser', async (req, res) => {
    try {
        const proUsers = db.collection('Pro_users');
        const proUserList = await proUsers.find().toArray();
        res.render('prousers_list_view', { proUserList: proUserList });
    } catch (err) {
        console.error(err);
        req.session.msg = "An error occurred while fetching the professional users";
        res.redirect('/');
    }
});
app.get('/addprouser', (req, res) => {
    res.render('addprouser_view');
});
app.post('/addprouser', async (req, res) => {
    try {
        const proUser = db.collection('Pro_users');
        const result = await proUser.insertOne({
            P_name: req.body.P_name,
            P_email: req.body.P_email,
            P_dob: req.body.P_dob,
            P_status: req.body.P_status,
            P_StartDate: req.body.P_StartDate,
            P_endDate: req.body.P_endDate,
            Course_id: req.body.Course_id,
            Status: req.body.Status,
            SoftDelete: req.body.SoftDelete
        });

        if (result.acknowledged) {
            req.session.msg = "Professional user added successfully";
        } else {
            req.session.msg = "Failed to add professional user";
        }
        res.redirect('/');
    } catch (err) {
        console.error(err);
        req.session.msg = "An error occurred while adding the professional user";
        res.redirect('/');
    }
});


app.post('/addprouser', async (req, res) => {
    try {
        const proUser = db.collection('Pro_users');
        const result = await proUser.insertOne({
            P_name: req.body.P_name,
            P_email: req.body.P_email,
            P_dob: req.body.P_dob,
            P_status: req.body.P_status,
            P_StartDate: req.body.P_StartDate,
            P_endDate: req.body.P_endDate,
            Course_id: req.body.Course_id,
            Status: req.body.Status,
            SoftDelete: req.body.SoftDelete
        });

        if (result.acknowledged) {
            req.session.msg = "Professional user added successfully";
        } else {
            req.session.msg = "Failed to add professional user";
        }
        res.redirect('/');
    } catch (err) {
        console.error(err);
        req.session.msg = "An error occurred while adding the professional user";
        res.redirect('/');
    }
});

app.get('/editprouser', async (req, res) => {
    try {
        const proUserId = req.query.prouserid;
        const proUsers = db.collection('Pro_users');
        const proUser = await proUsers.findOne({ _id: new ObjectId(proUserId) });

        if (!proUser) {
            req.session.msg = "Professional user not found";
            return res.redirect('/');
        }

        res.render('editprouser_view', { proUser: proUser });
    } catch (err) {
        console.error(err);
        req.session.msg = "An error occurred while retrieving the professional user";
        res.redirect('/');
    }
});
app.post('/updateprouser', async (req, res) => {
    try {
        const proUserId = req.body.prouserid;
        const updatedProUser = {
            P_name: req.body.P_name,
            P_email: req.body.P_email,
            P_dob: req.body.P_dob,
            P_status: req.body.P_status,
            P_StartDate: req.body.P_StartDate,
            P_endDate: req.body.P_endDate,
            Course_id: req.body.Course_id,
            Status: req.body.Status,
            SoftDelete: req.body.SoftDelete
        };

        const proUsers = db.collection('Pro_users');
        const result = await proUsers.updateOne(
            { _id: new ObjectId(proUserId) },
            { $set: updatedProUser }
        );

        if (result.matchedCount > 0) {
            req.session.msg = "Professional user updated successfully";
        } else {
            req.session.msg = "Professional user not found";
        }
        res.redirect('/');
    } catch (err) {
        console.error(err);
        req.session.msg = "An error occurred while updating the professional user";
        res.redirect('/');
    }
});

app.get('/deleteprouser', async (req, res) => {
    try {
        const proUserId = req.query.prouserid;
        const proUsers = db.collection('Pro_users');
        const result = await proUsers.deleteOne({ _id: new ObjectId(proUserId) });

        if (result.deletedCount > 0) {
            req.session.msg = "Professional user deleted successfully";
        } else {
            req.session.msg = "Professional user not found";
        }
        res.redirect('/');
    } catch (err) {
        console.error(err);
        req.session.msg = "An error occurred while deleting the professional user";
        res.redirect('/');
    }
});

app.get('/typeOfQues', async (req, res) => {
    try {
        const typeOfQuesCollection = db.collection('TypeOfQues');
        const typeOfQuesList = await typeOfQuesCollection.find().toArray();
        res.render('typeOfQues_list_view', { typeOfQuesList: typeOfQuesList });
    } catch (err) {
        console.error(err);
        req.session.msg = "An error occurred while fetching the types of questions";
        res.redirect('/');
    }
});
app.get('/addTypeOfQues', (req, res) => {
    res.render('add_typeOfQues_view');
});
app.post('/addTypeOfQuesSubmit', async (req, res) => {
    try {
        const typeOfQuesCollection = db.collection('TypeOfQues');
        const result = await typeOfQuesCollection.insertOne({
            T_name: req.body.T_name
        });
        if (result.acknowledged) {
            req.session.msg = "Type of Question Added";
            res.redirect('/');
        } else {
            req.session.msg = "Type of Question Not Added";
            res.redirect('/');
        }
    } catch (err) {
        console.error(err);
        req.session.msg = "An error occurred while adding the type of question";
        res.redirect('/');
    }
});
app.get('/editTypeOfQues', async (req, res) => {
    try {
        const typeOfQuesCollection = db.collection('TypeOfQues');
        const typeOfQues = await typeOfQuesCollection.findOne({ _id: new ObjectId(req.query.typeid) });
        res.render('edit_typeOfQues_view', { typeOfQues: typeOfQues });
    } catch (err) {
        console.error(err);
        req.session.msg = "An error occurred while fetching the type of question";
        res.redirect('/');
    }
});
app.post('/updateTypeOfQues', async (req, res) => {
    try {
        const typeOfQuesCollection = db.collection('TypeOfQues');
        const result = await typeOfQuesCollection.updateOne(
            { _id: new ObjectId(req.body.T_id) },
            { $set: { T_name: req.body.T_name } }
        );
        if (result.modifiedCount > 0) {
            req.session.msg = "Type of Question Updated";
            res.redirect('/');
        } else {
            req.session.msg = "Type of Question Not Updated";
            res.redirect('/');
        }
    } catch (err) {
        console.error(err);
        req.session.msg = "An error occurred while updating the type of question";
        res.redirect('/');
    }
});
app.get('/deleteTypeOfQues', async (req, res) => {
    try {
        const typeOfQuesCollection = db.collection('TypeOfQues');
        const result = await typeOfQuesCollection.deleteOne({ _id: new ObjectId(req.query.typeid) });
        if (result.deletedCount > 0) {
            req.session.msg = "Type of Question Deleted";
        } else {
            req.session.msg = "Type of Question Not Deleted";
        }
        res.redirect('/');
    } catch (err) {
        console.error(err);
        req.session.msg = "An error occurred while deleting the type of question";
        res.redirect('/');
    }
});

app.get('/difficulty', async (req, res) => {
    try {
        const difficultyCollection = db.collection('Difficulty');
        const difficultyList = await difficultyCollection.find().toArray();
        res.render('difficulty_list_view', { difficultyList: difficultyList });
    } catch (err) {
        console.error(err);
        req.session.msg = "An error occurred while fetching the difficulty levels";
        res.redirect('/');
    }
});

app.get('/addDifficulty', (req, res) => {
    res.render('add_difficulty_view');
});

app.post('/addDifficultySubmit', async (req, res) => {
    try {
        const difficultyCollection = db.collection('Difficulty');
        const result = await difficultyCollection.insertOne({
            D_value: req.body.D_value
        });
        if (result.acknowledged) {
            req.session.msg = "Difficulty Level Added";
            res.redirect('/');
        } else {
            req.session.msg = "Difficulty Level Not Added";
            res.redirect('/');
        }
    } catch (err) {
        console.error(err);
        req.session.msg = "An error occurred while adding the difficulty level";
        res.redirect('/');
    }
});

app.get('/editDifficulty', async (req, res) => {
    try {
        const difficultyCollection = db.collection('Difficulty');
        const difficulty = await difficultyCollection.findOne({ _id: new ObjectId(req.query.diffid) });
        res.render('edit_difficulty_view', { difficulty: difficulty });
    } catch (err) {
        console.error(err);
        req.session.msg = "An error occurred while fetching the difficulty level";
        res.redirect('/');
    }
});

app.post('/updateDifficulty', async (req, res) => {
    try {
        const difficultyCollection = db.collection('Difficulty');
        const result = await difficultyCollection.updateOne(
            { _id: new ObjectId(req.body.D_id) },
            { $set: { D_value: req.body.D_value } }
        );
        if (result.modifiedCount > 0) {
            req.session.msg = "Difficulty Level Updated";
            res.redirect('/');
        } else {
            req.session.msg = "Difficulty Level Not Updated";
            res.redirect('/');
        }
    } catch (err) {
        console.error(err);
        req.session.msg = "An error occurred while updating the difficulty level";
        res.redirect('/');
    }
});

app.get('/deleteDifficulty', async (req, res) => {
    try {
        const difficultyCollection = db.collection('Difficulty');
        const result = await difficultyCollection.deleteOne({ _id: new ObjectId(req.query.diffid) });
        if (result.deletedCount > 0) {
            req.session.msg = "Difficulty Level Deleted";
        } else {
            req.session.msg = "Difficulty Level Not Deleted";
        }
        res.redirect('/');
    } catch (err) {
        console.error(err);
        req.session.msg = "An error occurred while deleting the difficulty level";
        res.redirect('/');
    }
});

app.get('/course', async (req, res) => {
    try {
        const courseCollection = db.collection('Course');
        const courseList = await courseCollection.find().toArray();
        res.render('course_list_view', { courseList: courseList });
    } catch (err) {
        console.error(err);
        req.session.msg = "An error occurred while fetching the courses.";
        res.redirect('/');
    }
});
app.get('/addCourse', (req, res) => {
    res.render('add_course_view');
});
app.post('/addCourseSubmit', async (req, res) => {
    try {
        const courseCollection = db.collection('Course');
        const result = await courseCollection.insertOne({
            Course_name: req.body.Course_name,
            Course_price: req.body.Course_price,
            Course_description: req.body.Course_description
        });
        if (result.acknowledged) {
            req.session.msg = "Course Added";
            res.redirect('/');
        } else {
            req.session.msg = "Course Not Added";
            res.redirect('/');
        }
    } catch (err) {
        console.error(err);
        req.session.msg = "An error occurred while adding the course.";
        res.redirect('/');
    }
});
app.get('/editCourse', async (req, res) => {
    try {
        const courseCollection = db.collection('Course');
        const course = await courseCollection.findOne({ _id: new ObjectId(req.query.courseid) });
        res.render('edit_course_view', { course: course });
    } catch (err) {
        console.error(err);
        req.session.msg = "An error occurred while fetching the course.";
        res.redirect('/');
    }
});
app.post('/updateCourse', async (req, res) => {
    try {
        const courseCollection = db.collection('Course');
        const result = await courseCollection.updateOne(
            { _id: new ObjectId(req.body.Course_id) },
            {
                $set: {
                    Course_name: req.body.Course_name,
                    Course_price: req.body.Course_price,
                    Course_description: req.body.Course_description
                }
            }
        );
        if (result.modifiedCount > 0) {
            req.session.msg = "Course Updated";
            res.redirect('/');
        } else {
            req.session.msg = "Course Not Updated";
            res.redirect('/');
        }
    } catch (err) {
        console.error(err);
        req.session.msg = "An error occurred while updating the course.";
        res.redirect('/');
    }
});
app.get('/deleteCourse', async (req, res) => {
    try {
        const courseCollection = db.collection('Course');
        const result = await courseCollection.deleteOne({ _id: new ObjectId(req.query.courseid) });
        if (result.deletedCount > 0) {
            req.session.msg = "Course Deleted";
        } else {
            req.session.msg = "Course Not Deleted";
        }
        res.redirect('/');
    } catch (err) {
        console.error(err);
        req.session.msg = "An error occurred while deleting the course.";
        res.redirect('/');
    }
});

app.get('/company', async (req, res) => {
    try {
        const companyCollection = db.collection('Company');
        const companyList = await companyCollection.find().toArray();
        res.render('company_list_view', { companyList: companyList });
    } catch (err) {
        console.error(err);
        req.session.msg = "An error occurred while fetching the companies.";
        res.redirect('/');
    }
});
app.get('/addCompany', (req, res) => {
    res.render('add_company_view');
});
app.post('/addCompanySubmit', async (req, res) => {
    try {
        const companyCollection = db.collection('Company');
        const result = await companyCollection.insertOne({
            Company_name: req.body.Company_name,
        });
        if (result.acknowledged) {
            req.session.msg = "Company Added";
            res.redirect('/');
        } else {
            req.session.msg = "Company Not Added";
            res.redirect('/');
        }
    } catch (err) {
        console.error(err);
        req.session.msg = "An error occurred while adding the company.";
        res.redirect('/');
    }
});

app.get('/editCompany', async (req, res) => {
    try {
        const companyCollection = db.collection('Company');
        const company = await companyCollection.findOne({ _id: new ObjectId(req.query.companyid) });
        res.render('edit_company_view', { company: company });
    } catch (err) {
        console.error(err);
        req.session.msg = "An error occurred while fetching the company.";
        res.redirect('/');
    }
});
app.post('/updateCompany', async (req, res) => {
    try {
        const companyCollection = db.collection('Company');
        const result = await companyCollection.updateOne(
            { _id: new ObjectId(req.body.Company_id) },
            {
                $set: {
                    Company_name: req.body.Company_name,
                }
            }
        );
        if (result.modifiedCount > 0) {
            req.session.msg = "Company Updated";
            res.redirect('/');
        } else {
            req.session.msg = "Company Not Updated";
            res.redirect('/');
        }
    } catch (err) {
        console.error(err);
        req.session.msg = "An error occurred while updating the company.";
        res.redirect('/');
    }
});
app.get('/deleteCompany', async (req, res) => {
    try {
        const companyCollection = db.collection('Company');
        const result = await companyCollection.deleteOne({ _id: new ObjectId(req.query.companyid) });
        if (result.deletedCount > 0) {
            req.session.msg = "Company Deleted";
        } else {
            req.session.msg = "Company Not Deleted";
        }
        res.redirect('/');
    } catch (err) {
        console.error(err);
        req.session.msg = "An error occurred while deleting the company.";
        res.redirect('/');
    }
});


app.listen(8080,()=>console.log("cheatecode CRUD runnig at server8080"));