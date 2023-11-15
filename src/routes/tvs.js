//Librerias externas
const express = require('express');
const router = express.Router()
const fs = require('fs');

//Modulos internas
const {models} = require('../libs/sequelize');
const LOG_FILE_NAME = 'access_log.txt';

//Rutas
//LISTAR TV
router.get('/', async (req, res) => {
    const data = await models.tv.findAll();
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
router.get('/create', (req,res) =>{
  //Mostrar el formulario
  res.render('tvs/create');
})

router.post('/', async (req,res) =>{
  try{
    const newtvs = await models.tv.create(req.body); 
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
router.post('/:id', async (req, res) => {
    try {
        //GUARDAR ID
        const id = req.params.id;
        // BUSCAR EL TV CON EL ID QUE RECIBE Y ELIMINARLO
        await models.tv.destroy({
            where: {
                id: id
            }
        });

        // Redirigir después de completar la eliminación
        res.redirect('/tvs');

        const currentTime = new Date().toISOString();
        const logEntry = `${currentTime} [DELETE] EliminarTV /TVs/Delete/id: `;
        
        fs.appendFile(LOG_FILE_NAME, logEntry + id + '\n', (err) => {
            if (err) {
                console.error('Error al escribir en el archivo de registro.', err);
            }
        });
        
    } catch (error) {
        console.error('Error al eliminar el TV:', error);
        res.status(500).send('Error interno del servidor al eliminar el TV.');
    }
});

module.exports = router;