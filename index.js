//Librerias externas
const express = require('express');
const fs = require('fs');
const {v4: uuidv4} = require('uuid');

//Modulos internas
const { readFile, writeFile } = require('./src/files');
const tvs_api = require ('./src/routes/tvs_api');
const tvs =  require ('./src/routes/tvs');

const app = express();
const PORT = process.env.PORT || 3000;
const APP_NAME = process.env.APP_NAME || 'My App';
const FILE_NAME = './db/tvs.txt';
const LOG_FILE_NAME = 'access_log.txt';

//Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.set('views', './src/views');
app.set('view engine', 'ejs') //DEBEMOS CREAR LA CARPETA

app.get('/read-file', (req, res)=>{
    const data = readFile(FILE_NAME);
    res.send(data);
})

//Rutas
app.get('/hola/:name', (req, res) => {
    console.log(req);
    const name = req.params.name;
    const type = req.query.type;
    const formal = req.query.formal;
    const students_list = ['Juan', 'Pablo', 'Lucas']
    //res.send(`Hello ${formal ? 'Mr.' : ''} 
    //${name} ${type ? ' ' + type : ''}`);
    res.render('index',{
        name : name,
        students : students_list,
    })
});

app.get('/read-file', (req, res)=>{
    const data = readFile(FILE_NAME);
    res.send(data);
})

app.use('/api/tvs', tvs_api);
app.use('/tvs', tvs);
app.use('/tvs/:id', tvs)

app.listen(3000, () => {
    console.log(`${APP_NAME} está corriendo en http://localhost:${PORT}`);
});