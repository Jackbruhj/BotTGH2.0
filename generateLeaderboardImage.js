const { createCanvas, loadImage } = require('canvas');
const path = require('path');

async function generateLeaderboardImage(rows) {
    const templatePath = path.join(__dirname, 'assets', 'leaderboard_template.png');
    const template = await loadImage(templatePath);

    const canvas = createCanvas(template.width, template.height);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(template, 0, 0);

    // Title
    const textX = canvas.width / 2; // Centra el texto horizontalmente
const textY = 585; // La posición vertical permanece fija

ctx.font = 'bold 24px Arial';
ctx.fillStyle = '#ffffff';
ctx.textAlign = 'center'; // Centrar el texto horizontalmente
ctx.fillText('Top 10 Mejores Miembros', textX, textY);
  // Usernames
ctx.font = 'bold 24px Arial';
ctx.textAlign = 'left';
ctx.lineWidth = 2; // Grosor del contorno
ctx.strokeStyle = '#000000'; // Color del contorno
ctx.fillStyle = '#ffffff'; // Color de relleno del texto

let y = 40;
const x = 30;

rows.forEach((row, index) => {
    const text = `${index + 1}. ${row.discord_usuario} ${row.puntos_heroe} puntos `;
    
    // Dibuja el contorno del texto primero
    ctx.strokeText(text, x, y);
    
    // Rellena el texto con el color principal
    ctx.fillText(text, x, y);
    
    y += 55;
});

return canvas.toBuffer();

}

module.exports = generateLeaderboardImage; // Exportación correcta
