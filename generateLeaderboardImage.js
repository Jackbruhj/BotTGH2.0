const { createCanvas, loadImage } = require('canvas');
const path = require('path');

async function generateLeaderboardImage(rows, category) {
    const templatePath = path.join(__dirname, 'assets', 'leaderboard_template.png');
    const template = await loadImage(templatePath);

    const canvas = createCanvas(template.width, template.height);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(template, 0, 0);

    // Configuración de título según la categoría
    const titleText = category === 'wins' ? 'Top 10 por Victorias' : 'Top 10 por Puntos';
    const textX = canvas.width / 2;
    const textY = 585;

    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText(titleText, textX, textY);

    // Configuración de nombres y valores
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'left';
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#000000';
    ctx.fillStyle = '#ffffff';

    let y = 40;
    const x = 30;

    rows.forEach((row, index) => {
        const value = category === 'wins' ? `${row.wins} wins` : `${row.puntos_heroe}`;
        const text = `${index + 1}. ${row.discord_usuario} - ${value}`;

        ctx.strokeText(text, x, y);
        ctx.fillText(text, x, y);

        y += 55;
    });

    return canvas.toBuffer();
}

module.exports = generateLeaderboardImage;
