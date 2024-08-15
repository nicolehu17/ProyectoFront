var express = require('express');
var router = express.Router();
var axios = require('axios');

// Ruta para la página de inicio
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Home' });
});

// Ruta para la página de login
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});


router.post('/verifyUser', async function (req, res, next) {
  let {usuario, password } = req.body;

  const URL = 'http://localhost:3000/rest/Api/verifyUser';

  let data = {
    usuario: usuario,
    password: password,
  }

  const config = {
    proxy: {
      host: 'localhost',
      port: 3000
    }
  }

  const response = await axios.post(URL, data, config);
  if (response.status == '200' && response.statusText == 'OK') {
    res.redirect('/')
  } else {
    res.redirect('/login')
  }
});

// Ruta para la página de registro
router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register' });
});

// Ruta para manejar el formulario de registro
router.post('/register', function(req, res, next) {
  // Aquí podrías agregar la lógica para registrar al usuario
  res.redirect('/login');
});



// Ruta para mostrar el formulario de creación de serie
router.get('/create-series', function(req, res, next) {
  res.render('create-series', { title: 'Create Series', sereies: null});
});


// Ruta para mostrar el formulario de creación de serie
router.get('/editar/:id', async function(req, res, next) {
  let id = parseInt(req.params.id);
  const URL = 'http://localhost:3000/rest/Api/findById/'+id+'/json';
  const response = await axios.get(URL);
  res.render('update-series', { title: 'Actualizar Series', series: response.data});
  
  /*
  const URL2 = 'http://localhost:3000/rest/Api/AllGeneros/json';
  const generosjson = await axios.get(URL2);*/

  //res.render('create-series', { title: 'Actualizar Series', series: response.data, generos: generosjson.data});
});

// Ruta para mostrar el formulario de creación de serie
router.post('/create', async function(req, res, next) {
  let { nombre, descripcion, rating} = req.body;

  const URL = 'http://localhost:3000/rest/Api/NuevaSerie2'
  let data = {
    nombre: nombre,
    descripcion: descripcion,
    rating: rating,
    imagen: 'public/images/'+ nombre
  }

  const config = {
    proxy: {
      host: 'localhost',
      port: 3000
    }
  }

  const response = await axios.post(URL, data, config);
  if (response.status == '200' &&
    response.statusText == 'OK') {
    res.redirect('/series')
  } else {
    res.redirect('/login')
  }
});

router.post('/update', async function (req, res, next) {
  let {id, nombre, descripcion, rating} = req.body;

  const URL = 'http://localhost:3000/rest/Api/update'
  let data = {
    id: id,
    nombre: nombre,
    descripcion: descripcion,
    rating: rating,
    imagen: 'public/images/'+ nombre
  }

  const config = {
    proxy: {
      host: 'localhost',
      port: 3000
    }
  }

  const response = await axios.put(URL, data, config);
  if (response.status == '200' && response.statusText == 'OK') {
    res.redirect('/series')
  } else {
    res.redirect('/')
  }

});

// Ruta para la página de series
router.get('/series', async function(req, res, next) {
  const URL = 'http://localhost:3000/rest/Api/Allseries/json';
  const response = await axios.get(URL);
  res.render('series', { title: 'Series', series: response.data});
});


router.get('/eliminar/:id', async function (req, res, next) {
  let id = parseInt(req.params.id);
  const URL = 'http://localhost:3000/rest/Api/delete/' + id;

  const config = {
    proxy: {
      host: 'localhost',
      port: 3000
    }
  }

  const response = await axios.delete(URL, config);
  if (response.status == '200' && response.statusText == 'OK') {
    res.redirect('/series')
  } else {
    res.redirect('/')
  }
});


// Ruta para obtener los géneros y las series por género
router.get('/generos', async (req, res) => {
  const selectedGenre = req.query.selectedGenre || null;

  try {
    // Obtener todos los géneros
    const generosResponse = await axios.get('http://localhost:3000/rest/Api/AllGeneros/json');
    const generos = generosResponse.data;

    let series = [];
    if (selectedGenre) {
      // Encontrar el ID del género seleccionado
      const genero = generos.find(g => g.descripcion === selectedGenre);
      if (genero) {
        // Obtener series por el ID del género
        const generoId = genero.id;
        const seriesResponse = await axios.get(`http://localhost:3000/rest/Api/SeriesPorGenero/${generoId}/json`);
        series = seriesResponse.data;
      }
    }

    // Renderizar la vista con los datos obtenidos
    res.render('generos', {
      title: 'Géneros de Series',
      generos: generos,
      series: series,
      selectedGenre: selectedGenre
    });
  } catch (error) {
    console.error('Error al obtener géneros o series:', error);
    res.status(500).send('Error al obtener datos');
  }
});

// Ruta para obtener el Top 10 de series
router.get('/top10', async (req, res) => {
  try {
    // Obtener el Top 10 de series
    const top10Response = await axios.get('http://localhost:3000/rest/Api/Top10Series/json');
    const top10Series = top10Response.data;

    // Renderizar la vista con los datos obtenidos
    res.render('top10', {
      title: 'Top 10 Series',
      series: top10Series
    });
  } catch (error) {
    console.error('Error al obtener el Top 10 de series:', error);
    res.status(500).send('Error al obtener datos');
  }
});


// Ruta para mostrar la página de contacto
router.get('/contacto', (req, res) => {
  res.render('contacto', {
    title: 'Contáctanos', // Título de la página
    contactoEmail: 'info@seriesmania.com' // Ejemplo de dato dinámico
  });
});

module.exports = router;
