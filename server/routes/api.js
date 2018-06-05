//import  { environment }  from './../src/environments/environment';

const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Video = require('../models/video');
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

//const db = "mongodb://sri***lllc:S*****123@ds149353.mlab.com:49353/db4videoplayer";
  const db = process.env.DB_CONN_STRING;

mongoose.Promise = global.Promise;
mongoose.connect(db, function(err){
    if(err){
        console.error("Error! " + err);
    }
});

router.get('/videos', function(req, res){
    console.log('Get request for all videos');
    Video.find({})
    .exec(function(err, videos){
        if (err){
            console.log("Error retrieving videos");
        }else {
            res.json(videos);
        }
    });
});

router.get('/videos/:id', function(req, res){
    console.log('Get request for a single video');
    Video.findById(req.params.id)
    .exec(function(err, video){
        if (err){
            console.log("Error retrieving video");
        }else {
            res.json(video);
        }
    });
});

router.post('/video', function(req, res){
    console.log('Post a video');
    var newVideo = new Video();
    newVideo.title = req.body.title;
    newVideo.url = req.body.url;
    newVideo.description = req.body.description;
    newVideo.save(function(err, insertedVideo){
        if (err){
            console.log('Error saving video');
        }else{
            res.json(insertedVideo);
        }
    });
});


router.put('/video/:id', function(req, res){
    console.log('Update a video');
    Video.findByIdAndUpdate(req.params.id,
    {
        $set: {title: req.body.title, url: req.body.url, description: req.body.description}
    },
    {
        new: true
    },
    function(err, updatedVideo){
        if(err){
            res.send("Error updating video");
        }else{
            res.json(updatedVideo);
        }
    }

    );
});

router.delete('/video/:id', function(req, res){
    console.log('Deleting a video');
    Video.findByIdAndRemove(req.params.id, function(err, deletedVideo){
        if(err){
            res.send("Error deleting video");
        }else{
            res.json(deletedVideo);
        }
    });
});

/*make sure the name of the field is 'image' and the type is 'file' for the image that is coming in
 */
router.post('/image', upload.single('image'), function(req, res){
    console.log('Post a Student Profile');
    var newVideo = new Video();
    newVideo.title = req.body.title;
    newVideo.url = req.body.url;
    newVideo.description = req.body.description;
    newVideo.password = req.body.password;
    //  newVideo.image = 'http://'+host+':3000/'+req.file.path ;
    newVideo.image = 'http://localhost:3000/'+req.file.path ;
    newVideo.save(function(err, insertedVideo){
        if (err){
            console.log('Error saving video');
        }else{
            res.json(insertedVideo);
        }
    });
})

module.exports = router;
