const Discord = require('discord.js');
const client = new Discord.Client();
const TOKEN = 'MTIyNjgyNDcyNTUwMjc1ODk2Mw.Gz-Y0e.QbkaS3Kdkx1WzQpXul4R2FCEOZw7ja3vDi9NEE';
const fs = require('fs');

// Объект для хранения времени последнего использования бота для каждого пользователя
const lastUsed = {};

// Функция для генерации фиктивного предсказания
function generatePrediction() {
    const predictions = [
        "Сегодня будет отличный день!",
        "Остерегайтесь неожиданных сюрпризов...",
        "Сегодня подойдет время для важного решения.",
        "Будьте готовы к неожиданным встречам.",
        "Лучше не принимать важные решения сегодня.",
        "Настройтесь на успех!",
        "Не забывайте про здоровье."
    ];
    // Выбираем случайное предсказание из массива
    const randomIndex = Math.floor(Math.random() * predictions.length);
    return predictions[randomIndex];
}
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});
client.on('message', msg => {
    if (msg.content === '!me') {
        // Проверяем, использовал ли пользователь бота в последние 12 часов
        if (lastUsed[msg.author.id] && Date.now() - lastUsed[msg.author.id] < 12 * 60 * 60 * 1000) {
            msg.reply('Предсказание действует 12 часов. Не торопи события.');
        } else {
            // Генерируем предсказание
            const prediction = generatePrediction();
        // Отправляем предсказание автору сообщения
        msg.author.send(prediction)
            .then(() => console.log(`Sent prediction to ${msg.author.username}`))
            .catch(error => console.error('Could not send prediction:', error));
        }
    }
});
client.login(TOKEN);