const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const ip = require('ip');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const env = app.get('env');
const ipAddress = ip.address();
console.log(`Trying to start Boron server at ${ipAddress} (in ${env} mode)...`);

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname, 'public')));

if (env == 'development') {
} else if (env == 'testing') {
} else if (env == 'production') {
    app.use(helmet());
}

// api end points
const userApi = require('./api/user');

app.use('/api/user', userApi);


// website
const routes = require('./routes/index');
app.get('/', routes.home);



const dbUrl = config.get('server.db');
console.log(`Trying to connect to mongodb ${dbUrl}`);

const mongoDbConfig = {
    useNewUrlParser: true,
    useCreateIndex: true,
};

mongoose.connect(dbUrl,  mongoDbConfig)
    .then(() => console.log('Connected to mongodb.'))
    .catch(err => console.log('Could not connect to mongodb.', err));

// starting the server
const port = process.env.PORT || config.get('server.port');
app.listen(port, () => {
    console.log(`Listining to port ${port}`);
});