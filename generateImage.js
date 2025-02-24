const { createCanvas, loadImage } = require('@napi-rs/canvas');
const path = require('path');
const { loadFonts } = require('./fonts'); // Importar la función para cargar las fuentes

async function generateUserImage(discord_usuario, roblox_usuario, puntos_heroe, puntos_necesarios, avatarURL, rango, wins) {
    try {
        // Mapear los rangos con las plantillas correspondientes
        const rangoTemplates = {
            'EX': 'template.png',
            'A': 'template1.png',
            'B': 'template2.png',
            'C': 'template3.png',
            'D': 'template4.png',
            'E': 'template5.png',
            'F': 'template6.png',
        };

        // Verificar si el rango es válido y obtener la ruta de la plantilla
        const templateFilename = rangoTemplates[rango];
        if (!templateFilename) {
            throw new Error(`Rango inválido: ${rango}`);
        }

        const templatePath = path.join(__dirname, 'assets', templateFilename);
        const template = await loadImage(templatePath).catch(err => {
            throw new Error(`Error al cargar la plantilla: ${err.message}`);
        });

        // Crear canvas con dimensiones de la plantilla
        const canvas = createCanvas(template.width, template.height);
        const ctx = canvas.getContext('2d');

        // Dibujar la plantilla
        ctx.drawImage(template, 0, 0);

        // Cargar avatar y recortar como círculo
        const avatar = await loadImage(avatarURL).catch(err => {
            throw new Error(`Error al cargar el avatar: ${err.message}`);
        });

        // Configuración del círculo
        const circleX = 115;
        const circleY = 130;
        const circleRadius = 80;
        const imageX = 34;
        const imageY = 49;
        const imageWidth = 160;
        const imageHeight = 160;

        ctx.save();
        ctx.beginPath();
        ctx.arc(circleX, circleY, circleRadius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatar, imageX, imageY, imageWidth, imageHeight);
        ctx.restore();

        // Agregar texto de Discord y Roblox
        ctx.font = '28px "Lexend", sans-serif';
        ctx.lineWidth = 5;
        ctx.strokeStyle = '#000000';
        ctx.fillStyle = '#ffffff';
        ctx.strokeText(`Usuario: ${discord_usuario}`, 220, 88);
        ctx.fillText(`Usuario: ${discord_usuario}`, 220, 88);

        ctx.strokeText(`Usuario de Roblox: ${roblox_usuario}`, 50, 35);
        ctx.fillText(`Usuario de Roblox: ${roblox_usuario}`, 50, 35);

        // Agregar puntos de héroe
        ctx.font = '30px "Lexend", bold sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.lineWidth = 6;
        ctx.strokeStyle = '#000000';
        const texto = `${puntos_heroe}`;
        const textoWidth = ctx.measureText(texto).width;
        const x = 380;
        const y = 167;
        ctx.strokeText(texto, x - textoWidth / 2, y);
        ctx.fillText(texto, x - textoWidth / 2, y);

        ctx.font = '24px sans-serif';
        ctx.lineWidth = 5;
        ctx.strokeStyle = '#000000';
        ctx.fillStyle = '#ffffff';
        ctx.strokeText(`Siguiente rango en: ${puntos_necesarios} puntos`, 220, 250);
        ctx.fillText(`Siguiente rango en: ${puntos_necesarios} puntos`, 220, 250);

        // 🔹 **Nuevo: Mostrar Wins en la imagen con contorno negro**
        ctx.font = '30px "Lexend", bold sans-serif';
        ctx.lineWidth = 6;
        ctx.strokeStyle = '#000000';
        ctx.fillStyle = '#FFFFFF'; // Color dorado para resaltar las victorias
        ctx.strokeText(`Victorias: ${wins}`, 620, 60);
        ctx.fillText(`Victorias: ${wins}`, 620, 60);

        return canvas.toBuffer('image/png');
    } catch (error) {
        console.error('Error generando imagen:', error.message);
        throw error;
    }
}

module.exports = { generateUserImage };
