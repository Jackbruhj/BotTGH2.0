const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();
const commands = require('./commands');
const { generateUserImage } = require('./generateImage');
const mysql = require('mysql2');  // Usamos mysql2 sin la parte de promesas aquí
const express = require('express');

const app = express();

// Configuración del puerto (Clever Cloud asignará un puerto dinámicamente)
const PORT = process.env.PORT || 8080;

// Configuración de la base de datos
const db = mysql.createConnection({
  host: process.env.DB_HOST, // Host de la base de datos
  user: process.env.DB_USER, // Usuario de la base de datos
  password: process.env.DB_PASSWORD, // Contraseña de la base de datos
  database: process.env.DB_NAME, // Nombre de la base de datos
});

// Conexión a la base de datos
db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    process.exit(1); // Termina la aplicación si no puede conectar
  } else {
    console.log('Conexión exitosa a la base de datos');
  }
});

// Middleware para analizar datos JSON
app.use(express.json());

// Ruta de prueba para verificar que el servidor esté corriendo
app.get('/', (req, res) => {
  res.send('¡Servidor Express funcionando correctamente!');
});

// Ruta de prueba para verificar la conexión a la base de datos
app.get('/test-db', (req, res) => {
  db.query('SELECT 1 + 1 AS resultado', (err, results) => {
    if (err) {
      console.error('Error ejecutando consulta:', err);
      res.status(500).send('Error conectando a la base de datos');
    } else {
      res.send(`Resultado de la consulta: ${results[0].resultado}`);
    }
  });
});

// Manejo de errores generales en Express
app.use((err, req, res, next) => {
  console.error('Error inesperado:', err);
  res.status(500).send('Algo salió mal');
});

// Inicio del servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});