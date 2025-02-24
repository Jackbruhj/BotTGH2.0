const { createCanvas, loadImage, registerFont } = require('@napi-rs/canvas');
const path = require('path');
const { loadFonts } = require('./fonts'); // Asegurar que las fuentes están cargadas

async function generateUserImage(discord_usuario, roblox_usuario, puntos_heroe, puntos_necesarios, avatarURL, rango, wins) {
    try {
        if (!discord_usuario || !roblox_usuario || isNaN(puntos_heroe) || isNaN(puntos_necesarios) || !avatarURL || !rango || isNaN(wins)) {
            throw new Error("Datos de entrada inválidos o incompletos.");
        }

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

        const templateFilename = rangoTemplates[rango];
        if (!templateFilename) {
            throw new Error(`Rango inválido: ${rango}`);
        }

        const templatePath = path.join(__dirname, 'assets', templateFilename);
        const template = await loadImage(templatePath);

        // Crear canvas
        const canvas = createCanvas(template.width, template.height);
        const ctx = canvas.getContext('2d');

        ctx.drawImage(template, 0, 0);

        // Cargar avatar
        const avatar = await loadImage(avatarURL);

        // Recortar avatar como círculo
        const circleX = 115, circleY = 130, circleRadius = 80;
        const imageX = 34, imageY = 49, imageWidth = 160, imageHeight = 160;

        ctx.save();
        ctx.beginPath();
        ctx.arc(circleX, circleY, circleRadius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(avatar, imageX, imageY, imageWidth, imageHeight);
        ctx.restore();

        // Configurar fuente
        ctx.font = '28px "Lexend", sans-serif';
        ctx.lineWidth = 5;
        ctx.strokeStyle = '#000000';
        ctx.fillStyle = '#ffffff';

        ctx.strokeText(`Usuario: ${discord_usuario}`, 220, 88);
        ctx.fillText(`Usuario: ${discord_usuario}`, 220, 88);

        ctx.strokeText(`Usuario de Roblox: ${roblox_usuario}`, 50, 35);
        ctx.fillText(`Usuario de Roblox: ${roblox_usuario}`, 50, 35);

        // Puntos de héroe
        ctx.font = '30px "Lexend", bold sans-serif';
        ctx.lineWidth = 6;
        const texto = `${puntos_heroe}`;
        const textoWidth = ctx.measureText(texto).width;
        ctx.strokeText(texto, 380 - textoWidth / 2, 167);
        ctx.fillText(texto, 380 - textoWidth / 2, 167);

        ctx.font = '24px sans-serif';
        ctx.strokeText(`Siguiente rango en: ${puntos_necesarios} puntos`, 220, 250);
        ctx.fillText(`Siguiente rango en: ${puntos_necesarios} puntos`, 220, 250);

        // Mostrar victorias
        ctx.font = '30px "Lexend", bold sans-serif';
        ctx.strokeText(`Victorias: ${wins}`, 620, 60);
        ctx.fillText(`Victorias: ${wins}`, 620, 60);

        return canvas.toBuffer('image/png');
    } catch (error) {
        console.error('Error generando imagen:', error.message);
        throw error;
    }
}

module.exports = { generateUserImage };
