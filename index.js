const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const ip = require('ip');
const mongoose = require('mongoose');
const path = require('path');
const morgan = require('morgan');
const config = require('config');
const helmet = require('helmet');
const session = require('express-session');
const flash = require('connect-flash');
const multer = require('multer');
const MongoDBStore = require('connect-mongodb-session')(session);


const MONGODB_URI = config.get('server.db');

const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});
const env = app.get('env');
const ipAddress = ip.address();
console.log(`Trying to start Boron server at ${ipAddress} (in ${env} mode)...`);

app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store,
}));
app.use(flash());

if (env == 'development') {
} else if (env == 'testing') {
} else if (env == 'production') {
    app.use(helmet());
}

const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
app.use('', userRoutes);
app.use('', adminRoutes);

// 404 page
app.use('*', (req, res, next) => {
    res.status(404).render('404', { pageTitle: 'Page not found' });  
});


console.log(`Trying to connect to mongodb ${MONGODB_URI}`);

// database configuration object for depricated functions
const mongoDbConfig = { 
    useNewUrlParser: true,
    useCreateIndex: true,
};

// connecting to mongo database
mongoose.connect(MONGODB_URI,  mongoDbConfig)
    .then(() => console.log('Connected to mongodb.'))
    .catch(err => console.log('Could not connect to mongodb.', err));

// starting the server
const port = process.env.PORT || config.get('server.port');
app.listen(port, () => {
    console.log(`Listining to port ${port}`);
});