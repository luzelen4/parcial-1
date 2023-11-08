//Librerias externas
const express = require('express');
const fs = require('fs');
const {v4: uuidv4} = require('uuid');

//Modulos internas
const { readFile, writeFile } = require('./src/files');

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

//LISTAR TV
app.get('/tvs', (req, res) => {
    const data = readFile(FILE_NAME);
    const filtro = req.query.filtro;

    if (filtro) {
        // Filtrar registros por la clave y valor especificados en el query param
        const registrosFiltrados = data.filter((registro) => {
          return registro.marca.includes(filtro); // Cambia "tipo" al nombre de la clave que quieras filtrar
        });
        res.render('tvs/index', { tvs: registrosFiltrados });
      } else {
        // Si no se proporciona un valor para el query param, enviar todos los registros
        //res.json(data);
        res.render('tvs/index', { tvs: data });
      }

    const currentTime = new Date().toISOString();
    const logEntry = `${currentTime} [GET] ListarTV /TVs`;
    
    fs.appendFile(LOG_FILE_NAME, logEntry + '\n', (err) => {
        if (err) {
            console.error('Error al escribir en el archivo de registro.', err);
        }
    });
});

//CREAR TV
app.get('/tvs/create', (req,res) =>{
  //Mostrar el formulario
  res.render('tvs/create');
})

app.post('/tvs', (req,res) =>{
  try{
      //Leer el archivo de tvs
      const data = readFile(FILE_NAME);
  
      //Agregar el nuevo registro
      const newTV = req.body;
      newTV.id = uuidv4();
      console.log(newTV)
      data.push(newTV); //agrego nuevo elemento
      //Escribir en el archivo
      writeFile(FILE_NAME, data);
      res.redirect('/tvs')
  } catch (error){
          console.error(error);
          res.json({message: ' Error al almacenar el TV'});
      }

      const currentTime = new Date().toISOString();
      const logEntry = `${currentTime} [POST] CrearTV /TVs`;
      
      fs.appendFile(LOG_FILE_NAME, logEntry + '\n', (err) => {
          if (err) {
              console.error('Error al escribir en el archivo de registro.', err);
          }
      });
});

//ELIMINAR TV
app.post('/tvs/Delete/:id', (req, res) =>{
  console.log(req.params.id);
  //GUARDAR ID
  const id = req.params.id
  //leer contenido del archivo
  const tvs = readFile(FILE_NAME)

  //BUSCAR EL TV CON EL ID QUE RECIBE
  const tvIndex = tvs.findIndex(tv => tv.id === id)
  if(tvIndex < 0){
      res.status(404).json({'ok': false, message:"tv not found"})
      return;
  }
  //eliminar el tv en la posicion
  tvs.splice(tvIndex,1);
  writeFile(FILE_NAME, tvs)
  res.redirect('/tvs');

  const currentTime = new Date().toISOString();
  const logEntry = `${currentTime} [DELETE] EliminarTV /TVs/Delete/id: `;
  
  fs.appendFile(LOG_FILE_NAME, logEntry + id + '\n', (err) => {
      if (err) {
          console.error('Error al escribir en el archivo de registro.', err);
      }
  });
});

//API
//Listar TVs
app.get('/api/tvs', (req,res) =>{
    
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
app.post('/api/tvs', (req, res) => {
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
app.get('/api/tvs/:id', (req, res) =>{
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
app.put('/api/tvs/:id', (req, res) =>{
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
app.delete('/api/tvs/:id', (req, res) =>{
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


//EJECUCIÓN DEL SERVIDOR
app.listen(3000, () => {
    console.log(`${APP_NAME} está corriendo en http://localhost:${PORT}`);
});