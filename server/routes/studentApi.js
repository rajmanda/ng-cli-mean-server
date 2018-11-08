//import  { environment }  from './../src/environments/environment';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Student = require('../models/student');
const fs = require('fs');

const hostname = require('os-hostname');
const publicIp = require('public-ip');

let host = '';
/*
hostname(function (err, hname) {
    console.log('hname', hname) ;
    host = hname ;
})
*/
 
publicIp.v4().then(ip => {
    console.log(ip);
    host = ip ;
});

const multer = require('multer') ;
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        error = null ;
        cb(error, './uploads') ;
    },
    filename: function(req, file, cb){
        console.log("file. originalname", file.originalname)
        error = null ;
        //cb(error, new Date().toISOString() + file.originalname) ; 
        cb(error, file.originalname) ; 
    }
}) ;
//Filter filetypes. Restrict only Jpeg and png files
const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true) ;
    }else{
        cb(new Error('FileType Not Suuported - only Jpeg & PNG files are supported.'), false) ;
    }
}
const upload = multer({storage: storage, 
                       limits:{fileSize:1024 * 1024 * 10},
                       fileFilter: fileFilter
                       }) ;

//const db = "mongodb://sri***lllc:S*****123@ds149353.mlab.com:49353/db4studentplayer";
  const db = process.env.DB_CONN_STRING;

mongoose.Promise = global.Promise;
mongoose.connect(db, function(err){
    if(err){
        console.error("Error! " + err);
    }
});

router.get('/students', function(req, res){
    console.log('Get request for all students');
    Student.find({})
    .exec(function(err, students){
        if (err){
            console.log("Error retrieving students");
        }else {
            res.json(students);
        }
    });
});

router.get('/students/:id', function(req, res){
    console.log('Get request for a single student');
    Student.findById(req.params.id)
    .exec(function(err, student){
        if (err){
            console.log("Error retrieving student");
        }else {
            res.json(student);
        }
    });
});

router.post('/student', function (req, res) {
  console.log('Post a student', req.body);
    var newStudent = new Student();
    newStudent.name = req.body.name;
    newStudent.school = req.body.school;
    newStudent.achievement = req.body.achievement;
    newStudent.password = req.body.password;
    newStudent.image = req.body.image;

    newStudent.save(function(err, insertedStudent){
        if (err){
            console.log('Error saving student');
        }else{
            res.json(insertedStudent);
        }
    });
});


router.put('/student/:id', function(req, res){
    console.log('Update a student');
    Student.findByIdAndUpdate(req.params.id,
    {
        $set: {name: req.body.name, url: req.body.school, achievement: req.body.achievement}
    },
    {
        new: true
    },
    function(err, updatedStudent){
        if(err){
            res.send("Error updating student");
        }else{
            res.json(updatedStudent);
        }
    }

    );
});

router.delete('/student/:id', function(req, res){
    console.log('Deleting a student');
    Student.findByIdAndRemove(req.params.id, function(err, deletedStudent){
        if(err){
            res.send("Error deleting student");
        }else{
            res.json(deletedStudent);
        }
    });
});

/*make sure the name of the field is 'image' and the type is 'file' for the image that is coming in
 */
router.post('/image', upload.single('image'), function(req, res){
    console.log('Post a Student Profile');
    var newStudent = new Student();
    newStudent.name = req.body.name;
    newStudent.school = req.body.school;
    newStudent.achievement = req.body.achievement;
    newStudent.password = req.body.password;
    //newStudent.image = 'http://'+host+':3000/'+req.file.path ;
    //newStudent.image = 'http://localhost:3000/'+req.file.path ;
    newStudent.image = 'http://'+process.env.LOCALHOST+':3000/'+req.file.path ;
    newStudent.save(function(err, insertedStudent){
        if (err){
            console.log('Error saving student');
        }else{
            res.json(insertedStudent);
        }
    });
})

/*make sure the name of the field is 'image' and the type is 'file' for the image that is coming in
 * to copy mongodb from one instance to another use the following command
 *  - db.copyDatabase(<from_db>, <to_db>, <from_hostname>, <username>, <password>);
 *  - db.copyDatabase('db4studentplayer', 'studentplayer', 'ds149353.mlab.com:49353', 'sritechllc', 'S******123')
 *  - then run the following endpoint operation using postman to update the image URL's. 
 */
router.get('/updateHostToLocal', upload.single('image'), function (req, res) {
  console.log('get a students to update');
  let studentArray = []; 
  Student.find({})
    .exec(function (err, students) {
      if (err) {
        console.log("Error retrieving students");
      } else {
        studentArray = students;
        console.log("all Students", studentArray);


        for (let i = 0; i < studentArray.length; i++) {
          var findStr = "http://18.207.242.134:3000";
          var replaceStr = "http://localhost:3000";
       
          Student.findByIdAndUpdate(studentArray[i].id,
            {
              $set: { name: studentArray[i].name, url: studentArray[i].school, achievement: studentArray[i].achievement, image: studentArray[i].image.replace(findStr, replaceStr) }
            },
            {
              new: true
            },
            function (err, updatedStudent) {
              if (err) {
                console.log("Error updating student");
              } else {
                console.log("Record Updated Successfully", studentArray[i]);
              }
            }
          );
        }

        res.json(students);
      }
    });

})

module.exports = router;
