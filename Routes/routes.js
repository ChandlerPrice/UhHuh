const mongoose = require('mongoose');

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
        title: 'Home'
    });
};

exports.create = (req, res) =>
{
    res.render('create', 
    {
        title:'Create Account'
    });
};

exports.createJoke = (req, res) =>
{
    let login = new Login(
        {
            Name: req.body.Name,
            Password: req.body.Password,
            Age: req.body.Age,
            Email: req.body.Email,
            AnswerOne: req.body.AnswerOne,
            AnswerTwo: req.body.AnswerTwo,
            AnswerThree: req.body.AnswerThree
        }
    )
};

exports.edit = (req, res) =>
{

};

exports.login = (req, res) =>
{

};

