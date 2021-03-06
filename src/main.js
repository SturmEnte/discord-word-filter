/*
This file is part of discord-word-filter project
Copyright (C) 2022 SturmEnte.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
at your option any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/

require("dotenv/config");
const fs = require("fs");
const { Client } = require("discord.js");

// Check if the required env vars have been specified
if (!process.env.TOKEN) {
	console.error("Please specify a token for the bot");
	process.exit(1);
} else if (!process.env.TARGET_GUILD_ID) {
	console.error("Please specify a target guild id");
	process.exit(1);
}

let bannedWords = loadBannedWords();

const client = new Client({
	intents: ["GUILD_MESSAGES", "GUILDS", "DIRECT_MESSAGES"],
});
client.login(process.env.TOKEN);

client.on("ready", (client) => {
	console.log(`Logged in as ${client.user.tag}`);
	registerCommands();
});

client.on("messageCreate", (message) => {
	message.content.split(" ").forEach((word) => {
		if (bannedWords.includes(word)) {
			message.delete();
			message.author.send(
				"The word **" + word + "** is banned on " + message.guild.name
			);
			console.log(
				message.author.username +
					" sent a message with the following banned word: " +
					word
			);
		}
	});
});

client.on("interactionCreate", (interaction) => {
	if (!interaction.isCommand()) return;

	switch (interaction.commandName) {
		case "add-banned-word":
			bannedWords.push(interaction.options.getString("word"));
			interaction.reply(
				"Added **" +
					interaction.options.getString("word") +
					"** to the banned words list"
			);
			saveBannedWords();
			break;
		case "remove-banned-word":
			bannedWords = bannedWords.filter(
				(val) => val != interaction.options.getString("word")
			);
			interaction.reply(
				"Removed **" +
					interaction.options.getString("word") +
					"** from the banned words list"
			);
			saveBannedWords();
			break;
		default:
			break;
	}
});

async function registerCommands() {
	const commands = JSON.parse(fs.readFileSync(__dirname + "/commands.json"));

	// Get the target guild
	const targetGuild = await (
		await client.guilds.fetch()
	)
		.filter((guild, key) => key === process.env.TARGET_GUILD_ID)
		.first()
		.fetch();

	for (let i = 0; i < commands.length; i++) {
		await client.application.commands.create(commands[i], targetGuild.id);
	}

	console.log("Registered commands");
}

function loadBannedWords() {
	if (fs.existsSync("./bannedWords.json")) {
		const bannedWords = JSON.parse(fs.readFileSync("./bannedWords.json"));
		// Checking if bannedWords is an array by checking if it has a length prop
		if (bannedWords && bannedWords.length) return bannedWords;
	}
	return [];
}

function saveBannedWords() {
	fs.writeFileSync("./bannedWords.json", JSON.stringify(bannedWords));
}
