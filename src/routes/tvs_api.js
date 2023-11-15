//Librerias externas
const express = require('express');
const router = express.Router()
const fs = require('fs');
const {v4: uuidv4} = require('uuid');

//Modulos internas
const { readFile, writeFile } = require('../files');

const FILE_NAME = './db/tvs.txt';
const LOG_FILE_NAME = 'access_log.txt';

//Rutas de la API

//API
//Listar TVs
router.get('/', (req,res) =>{
    
    const data = readFile(FILE_NAME);
    const filtro = req.query.filtro;

    if (filtro) {
        // Filtrar registros por la clave y valor especificados en el query param
        const registrosFiltrados = data.filter((registro) => {
          return registro.marca.includes(filtro); // Cambia "tipo" al nombre de la clave que quieras filtrar
        });
    
        res.json(registrosFiltrados);
      } else {
        // Si no se proporciona un valor para el query param, enviar todos los registros
        res.json(data);
      }

    const currentTime = new Date().toISOString();
    const logEntry = `${currentTime} [GET] ListarTVsAPI /TVs`;
    
    fs.appendFile(LOG_FILE_NAME, logEntry + '\n', (err) => {
        if (err) {
            console.error('Error al escribir en el archivo de registro.', err);
        }
    });
});

//Crear tvs
router.post('/', (req, res) => {
    try{
    //Leer el archivo de tvs
    const data = readFile(FILE_NAME);

    //Agregar el nuevo tv
    const newTv = req.body;
    newTv.id = uuidv4();
    console.log(newTv)
    data.push(newTv); //agrego nuevo elemento

    //Escribir en el archivo
    writeFile(FILE_NAME, data);
    res.json({message: 'El tv fue creado'});
    }catch (error){
        console.error(error);
        res.json({message: ' Error al almacenar el tv'});
    }

});

//Obtener un solo tv (usamos los dos puntos por que es un path param)
router.get('/:id', (req, res) =>{
    console.log(req.params.id);
    //GUARDAR ID
    const id = req.params.id
    //leer contenido del archivo
    const pets = readFile(FILE_NAME)

    //BUSCAR TV CON EL ID QUE RECIBE
    const petFound = pets.find(tv => tv.id === id)
    if(!petFound){
        res.status(404).json({'ok': false, message:"tv not found"})
        return;
    }

    res.json({'ok': true, pet: petFound});
})
//ACTUALIZAR UN DATO
router.put('/:id', (req, res) =>{
    console.log(req.params.id);
    //GUARDAR ID
    const id = req.params.id
    //leer contenido del archivo
    const pets = readFile(FILE_NAME)

    //BUSCAR TV CON EL ID QUE RECIBE
    const tvIndex = tvs.findIndex(tv => tv.id === id)
    if(tvIndex < 0){
        res.status(404).json({'ok': false, message:"tv not found"})
        return;
    }
    let tv = tvs[tvIndex]; //sacar del arreglo
    tv={...tv, ...req.body}
    tvs[tvIndex] = tv //Poner tv en el mismo lugar
    writeFile(FILE_NAME, pets);
    //SI LA MASCOTA EXISTE MODIFICAR LOS DATOS Y ALMACENAR NUEVAMENTE


    res.json({'ok': true, tv: tv});
})

//Delete, eliminar un dato
router.delete('/:id', (req, res) =>{
    console.log(req.params.id);
    //GUARDAR ID
    const id = req.params.id
    //leer contenido del archivo
    const tvs = readFile(FILE_NAME)

    //BUSCAR TV CON EL ID QUE RECIBE
    const tvIndex = tvs.findIndex(tv => tv.id === id)
    if(tvIndex < 0){
        res.status(404).json({'ok': false, message:"tv not found"})
        return;
    }
    //eliminar tv en la posicion
    tvs.splice(tvIndex,1);
    writeFile(FILE_NAME, pets)
    res.json({'ok': true});
})


module.exports = router;