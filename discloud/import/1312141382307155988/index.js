const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();
const commands = require('./commands'); // Importa los comandos
const { generateUserImage } = require('./generateImage');
const mysql = require('mysql2');
// Configura el bot de Discord
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});

// Función para manejar la conexión con la base de datos
let db;

function handleDisconnect() {
    db = mysql.createConnection({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    db.connect((err) => {
        if (err) {
            console.error('Error conectando a la base de datos:', err.message);
            setTimeout(handleDisconnect, 2000); // Intentar reconectar después de 2 segundos
        } else {
            console.log('Conexión exitosa con la base de datos');
        }
    });

    // Enviar un ping cada 5 minutos para evitar desconexión por inactividad
    setInterval(() => {
        db.ping((err) => {
            if (err) {
                console.error('Error en el ping a la base de datos: ', err);
            } else {
                console.log('Ping exitoso a la base de datos');
            }
        });
    }, 300000); // 5 minutos

    db.on('error', function (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('La conexión con la base de datos se perdió. Intentando reconectar...');
            handleDisconnect(); // Reconectar si la conexión se pierde
        } else {
            console.error('Error en la base de datos:', err);
            throw err;
        }
    });
}

// Inicialización del bot
client.once('ready', () => {
    console.log(`Bot conectado como ${client.user.tag}`);
});

// Manejo de comandos
client.on('messageCreate', (message) => {
    if (message.author.bot || !message.content.startsWith('!J')) return;

    const args = message.content.slice(2).trim().split(' ');
    const command = args.shift().toLowerCase();

    // Ejecuta el comando correspondiente
    if (commands[command]) {
        commands[command](message, args);
    } else {
        message.reply('Comando no reconocido. Usa `!J help` para ver los comandos disponibles.');
    }
});

console.log("Iniciando el bot...");
client.login(process.env.BOT_TOKEN).catch(console.error);

// Llamada a la función de conexión con la base de datos
handleDisconnect();
const express = require('express');
const app = express();
