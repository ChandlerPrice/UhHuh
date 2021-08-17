const express = require('express');
const pug = require('pug');
const routes = require('./routes/routes');
const expressSession = require('express-session');
const path = require('path');

const app = express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

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

app.get('/login', routes.login);
app.post('/login', urlEncodedParser, routes.login)
app.get('/', routes.api);
app.get('/create', routes.create)
app.post('/create', urlEncodedParser, routes.createAccount);
app.get('/edit', routes.edit)
app.post('/edit', urlEncodedParser, routes.editAccount);
app.post('/delete', urlEncodedParser, routes.deleteAccount);

app.listen(3000);