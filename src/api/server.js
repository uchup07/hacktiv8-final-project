const express = require('express');
const app = express();
require('dotenv').config();

const router = require('./routes');

const PORT = process.env.APP_PORT;

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.use('/v1/api',router);

app.listen(PORT, () => {
    console.log(`Running on Port: ${PORT}`);
});

module.exports = app;