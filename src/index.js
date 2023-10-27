const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
// require('./strategy/local');
require('./strategy/discord')
//Router
const authRoute = require('./routes/auth');
const groceriesRoute = require('./routes/groceries');
const marketsRoute = require('./routes/market');
require('./database');

const app = express();
const PROT = 3001;



//midleware

app.use(express.urlencoded());
app.use(cookieParser());
app.use(express.json());
app.use(
    session({
        secret: 'ASDSDFADFADSFASFASDFASDFASDFASDFSDAFFSA',
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: 'mongodb://127.0.0.1:27017/learnExpressJs',
        }),
    })
)


app.use((req, res, next) => {
    console.log(`${req.method}:${req.url}`);
    next();
});



app.use(passport.initialize());
app.use(passport.session());

app.use('/api/v1/auth', authRoute);
app.use('/api/v1/groceries', groceriesRoute);
app.use('/api/v1/markets', marketsRoute);


app.listen(PROT, () => console.log(`Running Express Server on Port ${PROT}!`))



// app.get('/groceries', (request, response, next) => {
//     console.log('Before Handling Request');
//     next();
// },
//     (request, response, next) => {
//         response.send(groceryList);
//         next()
//     },
//     (request, response, next) => {
//         console.log('Fininshed Executing GET Request');
//     });

