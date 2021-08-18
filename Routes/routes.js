const mongoose = require('mongoose');
const config = require('../config');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost/data', 
{
    useUnifiedTopology: true,
    useNewUrlParser: true
});

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

let mdb = mongoose.connection;
mdb.on('error', console.error.bind(console, 'connection error'));
mdb.once('open', callback => {});

let loginSchema = mongoose.Schema
(
    {
        Name: String,
        Password: String,
        Age: Number,
        Email: String,
        AnswerOne: String,
        AnswerTwo: String,
        AnswerThree: String
    }
);

let Login = mongoose.model('Login_Collection', loginSchema);

exports.index = (req, res) => 
{
    res.render('index',
    {
        title: 'Home',
        config,
        Users: user
    });
};

exports.login = (req, res) =>
{
    res.render('login', {
        title: 'Login',
        config
    });
};

exports.create = (req, res) =>
{
    res.render('create', {
        title: 'Create'
    });
};

exports.createAccount = (req, res) => {

};

exports.editAccount = (req, res) => {

};

exports.deleteAccount = (req, res) => {

};