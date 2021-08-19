const mongoose = require('mongoose');
const config = require('../config');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb+srv://ARapp:Nu190528560@cluster0.ddfio.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', 
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
        config
    });
};

exports.create = (req, res) =>
{
    res.render('create', 
    {
        title:'Create Account',
        config
    });
};

exports.createAccount = (req, res) =>
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
        );
        login.save((err, login) =>
        {
            if(err) return console.error(err);
            console.log(req.body.name + ' added');
        });
        res.redirect('/');
    };
    
    exports.edit = (req, res) =>
    {
        Login.findById(req.params.id, (err, login) =>
        {
            if(err) return console.error(err);
            res.render('edit',
            {
                title: 'Edit Account Information',
                login,
                config
            });
        });
    };
    
    exports.editAccount = (req, res) =>
    {
        Login.findById(req.params.id, (err, login) =>
        {
            if(err) return console.error(err);
            login.Name = req.body.Name,
            login.Password = req.body.Password,
            login.Email = req.body.Email,
            login.AnswerOne = req.body.AnswerOne,
            login.AnswerTwo = req.body.AnswerTwo,
            login.AnswerThree = req.body.AnswerThree
        });
    }

    exports.deleteAccount = (req, res) => {
    
    };
    
    exports.login = (req, res) =>
    {
        
    };
    
    