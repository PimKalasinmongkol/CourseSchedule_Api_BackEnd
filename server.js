const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv').config();
const app = express();
const port = process.env.PORT;

// import controller
const user = require('./controller/user')
const teacher = require('./controller/teacher')
const course = require('./controller/course')
const admin = require('./controller/admin')

/* const validApiKey = new Set([
    'course-ku-66'
])

const apiKeyMiddleWare = (request ,response ,next) => {
    const apiKey = request.headers['x-api-key'] || request.query.api_key
    if (!apiKey || !validApiKey.has(apiKey)) {
        return response.status(403).json({ error: 'Invalid API key' });
    }
    next();
} */

// set up middleware
app.use(express.json());
app.use(express.urlencoded({
    extended: true,
}))
app.use(cors());
app.use(morgan('dev'));

// use route controller
app.use('/user' ,user)
app.use('/teacher', teacher)
app.use('/course', course)
app.use('/admin' ,admin)

// test server
app.get('/', (request ,response) => {
    response.send("<h1 style='font-size: 100px'>Server has ready</h1>")
})

// start server
app.listen(port ,() => {
    console.log(`----\nRunning on port ${port}\n----`);
});