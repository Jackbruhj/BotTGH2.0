const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();
const commands = require('./commands');
const { generateUserImage } = require('./generateImage');
const mysql = require('mysql2');  // Usamos mysql2 sin la parte de promesas aquí
const express = require('express');

// Configuración del bot de Discord
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});

// Configuración de conexión con la base de datos usando un pool de conexiones
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 30000,  // 30 segundos

});

// Función para realizar un ping a la base de datos
async function pingDatabase() {
    try {
        // Realizamos un ping a la base de datos para comprobar la conexión
        const [rows, fields] = await pool.promise().query('SELECT 1');
        console.log('Ping exitoso a la base de datos');
    } catch (err) {
        console.error('Error en el ping a la base de datos:', err);
    }
}

pool.on('error', (err) => {
    console.error('Error de conexión con la base de datos:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
        console.log('Intentando reconectar...');
        pingDatabase(); // Intentar el ping para verificar si la conexión está activa
    }
});

pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error de conexión:', err);
    } else {
        // Aquí haces tus consultas
        connection.query('SELECT 1', (err, result) => {
            if (err) {
                console.error('Error de consulta:', err);
            } else {
                console.log('Resultado:', result);
            }
            connection.release();  // Siempre libera la conexión después de usarla
        });
    }
});


// Inicialización del bot
client.once('ready', () => {
    console.log(`Bot conectado como ${client.user.tag}`);
});

// Manejo de comandos
client.on('messageCreate', (message) => {
    if (message.author.bot || !message.content.startsWith('!J')) return;

    const args = message.content.slice(2).trim().split(' ');
    const command = args.shift().toLowerCase();

    if (commands[command]) {
        commands[command](message, args);
    } else {
        message.reply('Comando no reconocido. Usa `!J help` para ver los comandos disponibles.');
    }
});

console.log("Iniciando el bot...");
client.login(process.env.BOT_TOKEN).catch(console.error);

// Llamamos a la función de ping cada 5 minutos
setInterval(pingDatabase, 300000);  // 5 minutos

// Configuración del servidor Express
const app = express();

// Endpoint para Uptime Robot
app.get('/status', (req, res) => {
    res.send('Bot is running');
});

// Puerto del servidor Express
const EXPRESS_PORT = 3000; // Cambia el puerto si es necesario

// Iniciar el servidor Express
app.listen(EXPRESS_PORT, () => {
    console.log(`Servidor Express corriendo en http://localhost:${EXPRESS_PORT}`);
});
