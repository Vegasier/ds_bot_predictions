const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.cooldowns = new Collection();
client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// client.on('ready', () => {
//     console.log(`Logged in as ${client.user.tag}!`);
//   });
  
//   client.on('message', async message => {
//     if (message.author.bot) return; // Ignore messages from bots
//     if (!message.content.startsWith('/prediction')) return; // Check if message starts with '/prediction'
  
//     // You can put your prediction generation logic here
//     const prediction = generatePrediction();
  
//     // Send the prediction to the user
//     try {
//       await message.author.send(`Your prediction: ${prediction}`);
//       await message.channel.send('Prediction sent to your DM!');
//     } catch (error) {
//       console.error(`Could not send prediction to ${message.author.tag}:`, error);
//       message.channel.send('Failed to send prediction. Please make sure your DMs are open.');
//     }
//   });
  
//   // Function to generate a random prediction (replace this with your actual prediction logic)
//   function generatePrediction() {
//     const predictions = [
//       "Tomorrow will be a sunny day.",
//       "You will meet someone new today.",
//       "You'll receive good news soon.",
//       "Be cautious, as something unexpected might happen."
//     ];
//     return predictions[Math.floor(Math.random() * predictions.length)];
//   }

client.login(token);