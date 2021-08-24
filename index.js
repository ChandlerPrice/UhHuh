const express = require('express');
const pug = require('pug');
const routes = require('./routes/routes');
const expressSession = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());

app.use(expressSession({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Heaers", "Origin, X-Request-With, Content-Type, Accept");
    next();
});

let urlEncodedParser = express.urlencoded({
    extended: false
});

app.post('/', urlEncodedParser, (req, res) => {
    console.log(req.body.username);
    if(req.body.Username == 'user' && req.body.Password == 'pass')
    {
        req.session.user = {
            isAuthenticated: true,
            username: req.body.username
        }
        res.redirect('/')
    }
    else
    {
        res.redirect('/login')
    }

    res.cookie('visited', visited, {maxAge: 999999999999999999999999999999});
    res.cookie('stuff', myString, {maxAge: 999999999999999999999999999999});
});

app.get('/logout', (req, res) => {
    req.session.isAuthenticated = false;
    req.session.user = {
        isAuthenticated: false,
    }
    req.session.destroy(err => {
        if(err) {
            console.log(err);
        } else {
            res.redirect('/login')
        }
    });
});

app.get('/login', routes.login);
app.post('/login', urlEncodedParser, routes.loginCheck)
app.get('/', routes.index);
app.get('/create', routes.create)
app.post('/create', urlEncodedParser, routes.createAccount);
app.get('/edit/:id', routes.edit)
app.post('/edit/:id', urlEncodedParser, routes.editAccount);

app.listen(3000);