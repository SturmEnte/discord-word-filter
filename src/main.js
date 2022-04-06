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

console.log("Hello World");
require("dotenv/config");
const { Client } = require("discord.js");
// Check if the required env vars have been specified
if (!process.env.TOKEN) {
	console.error("Please specify a token for the bot");
	process.exit(1);
} else if (!process.env.TARGET_GUILD_ID) {
	console.error("Please specify a target guild id");
	process.exit(1);
}

const client = new Client({ intents: ["GUILD_MESSAGES"] });
client.login(process.env.TOKEN);

client.on("ready", (client) => {
	console.log(`Logged in as ${client.user.tag}`);
});
