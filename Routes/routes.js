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
    if(req.session.isAuthenticated)
    {
        req.session.user = {
            isAuthenticated: true,
            username: req.body.username
        }
        res.render('index',
        {
            title: 'Home', 
            Login,
            config
        }); 
    }
    else
    {
        res.redirect('/login'); 
    }
};

exports.create = (req, res) =>
{
    res.render('create', 
    {
        title:'Create Account',
        Login,
        config
    });
};

const makeHash = theString =>
{
    bcrypt.genSalt(10, (err, salt) =>
    {
        bcrypt.hash(theString, salt, (err, myHash) =>
        {
            console.log(salt);
            console.group(hash);
            hashComplete(myHash);
        });
    })
}

exports.createAccount = (req, res) =>
{
    let login = new Login(
        {
            Name: req.body.username,
            Password: makeHash(req.body.password),
            Age: req.body.age,
            Email: req.body.email,
            AnswerOne: req.body.answerOne,
            AnswerTwo: req.body.answerTwo,
            AnswerThree: req.body.answerThree
        }
        );
        login.save((err, login) =>
        {
            if(err) return console.error(err);
            console.log(req.body.username + ' added');
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
                Login,
                config
            });
        });
    };
    
    exports.editAccount = (req, res) =>
    {
        Login.findById(req.params.id, (err, login) =>
        {
            if(err) return console.error(err);
            login.Name = req.body.username,
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
        res.render('login', 
        {
            title:'Login',
            Login,
            config
        });
    };

    exports.loginCheck = (req, res) =>
    {
        req.session.user = {
            isAuthenticated: true,
            username: req.body.username
        }
        res.redirect('/');
    }


    
    