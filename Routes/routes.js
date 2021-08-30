const mongoose = require('mongoose');
const config = require('../config');
const bcrypt = require('bcryptjs');

let salt = bcrypt.genSaltSync(10);
let hash = "";
let visited = 0;
let clientUser;

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

const AccountAnswers = {
    categories: 
    {
        "QuestionOne":[
            //{id:`1`, joke:`All of Yes`}
        ],
        "QuestionTwo":[
            //{id:`2`, joke:`Yes`}
        ],
        "QuestionThree":[
            //{id:`3`, joke:`They are pretty cool`}
        ]
    }
}

exports.api = (req, res) =>
{
    Login.collection.find().forEach( function(myDoc) 
    {
         AccountAnswers.categories.QuestionOne.push(myDoc.AnswerOne); 
         AccountAnswers.categories.QuestionTwo.push(myDoc.AnswerTwo); 
         AccountAnswers.categories.QuestionThree.push(myDoc.AnswerThree); 
    });
    res.json(AccountAnswers);
}

exports.index = (req, res) => 
{
    console.log(`isAuth: ${req.session.isAuthenticated}`);
    if(req.session.isAuthenticated)
    {
        req.session.user = {
            isAuthenticated: true,
            //User: user
        }
        if(req.cookies.beenToSiteBefore == 'yes')
        {
            visited++;
        }
        else
        {
            res.cookie('beenToSiteBefore', 'yes', {maxAge: 9999999999999999999999999999999999});
        }
        res.render('index',
        {
            title: 'Home', 
            user: clientUser,
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
            console.group(myHash);
            hashComplete(theString, myHash);
            hash = myHash;
        });
    })
    return the_hash;
}

const hashComplete = (theString, theHash) => {
    bcrypt.compare(theString, theHash, (err, res) => {
        console.log(res);
    })
}

exports.createAccount = (req, res) =>
{
    hash = bcrypt.hashSync(req.body.password, salt);

    let login = new Login(
        {
            Name: req.body.username,
            Password: hash,
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
        login.Name = (req.body.username) ? req.body.username : login.Name,
        login.Password = (req.body.password) ? bcrypt.hashSync(salt, req.body.password) : login.Password,
        login.Email = (req.body.email) ? req.body.email : login.Email,
        login.AnswerOne = req.body.answerOne,
        login.AnswerTwo = req.body.answerTwo,
        login.AnswerThree = req.body.answerThree
        login.save((err, login) => {
            if(err) return console.error(err);
            console.log(req.body.name + ' updated');
        });
        clientUser = login;
    });
    res.redirect('/');
};

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
    //let salt = bcrypt.genSaltSync(10);
    Login.findOne({Name: req.body.Username}, (err, user) =>
    {
        if(err) return console.error(err);
        console.log('User found');
        console.log(`passwordAttempt: ${req.body.Password}`)
        console.log(`databasePassword: ${user.Password}`)
        console.log(bcrypt.compareSync(req.body.Password, user.Password))
        if(user && bcrypt.compareSync(req.body.Password, user.Password))
        {
            console.log('Logged in')
            req.session.isAuthenticated = true;
            req.session.sesUser = user;
            clientUser = user;
            res.redirect('/');       
        }
        else
        {
            console.log('Incorrect')
            req.session.isAuthenticated = false;
            res.redirect('/'); 
        }
    });
};
