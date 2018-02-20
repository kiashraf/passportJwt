let mongoose = require('mongoose');
let passport = require('passport');
let config = require('../config/database');

require('../config/passport')(passport);

let jwt = require('jsonwebtoken');
var express = require('express');
var router = express.Router();


let User = require('../models/user');
let Book = require('../models/book');


/* GET home page. */
router.get('/', function (req, res, next) {
    res.status(200).send('App is working');
});


router.post('/signup', (req, res, next) => {

    if (!req.body.username || !req.body.password) {
        res.json({ success: false, message: 'Username or Password is missing!' });

    } else {

        let newUser = new User();

        newUser.username = req.body.username;
        newUser.password = newUser.encryptPassword(req.body.password);

        newUser.save((err) => {
            if (err)
                res.json({ success: false, message: 'User already Exists' })
            else
                res.json({ success: true, message: `successfully created new User with user name ${newUser.username}` })
        });
    }

})


router.post('/login', (req, res, next) => {

    if (!req.body.username || !req.body.password)
        res.json({ success: false, message: 'Username or password is missing!!' });
    else {
        User.findOne({ username: req.body.username }, (err, user) => {
            if (err)
                res.json({ sucess: false, message: 'Username does not exists !' })
            else {
                if (!user.comparePassword(req.body.password) ){
                    res.json({ success: false, message: 'Password does not match!!' });
                } else {
                    let token = jwt.sign(user.toJSON(), config.secret,{expiresIn : '100s'});
                    res.json({ success: true, user: user ,bearer : token});
                }
            }
        })
    }
});

router.post('/book', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    let token = getToken(req.headers);
    if (token) {
        let newBook = new Book();

        newBook.isbn = req.body.isbn;
        newBook.title = req.body.title;
        newBook.author = req.body.author;
        newBook.publisher = req.body.publisher;


        newBook.save((err) => {
            if (err)
                res.json({ success: false, message: 'Error has occured!' })
            else res.json({ success: true, message: ` New Book has been added ${newBook}` })

        })
    } else {
        return res.status(403).send({ success: false, message: 'Unauthorozed : you are not authorized !!' });
    }

})

router.get('/book',passport.authenticate('jwt',{session : false}),(req,res,next)=>{
    res.send(200).json('Books are here!!')

})

function getToken(headers) {
    if (headers && headers.authorization) {
        let authHeader = headers.authorization.split(' ');
        if (authHeader.length == 2)
            return authHeader[1];
        else return null;
    } else return null;

}


module.exports = router;
