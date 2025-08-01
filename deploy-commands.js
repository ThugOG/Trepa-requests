const { SlashCommandBuilder, REST, Routes } = require('discord.js');
require('dotenv').config();

const commands = [
  new SlashCommandBuilder()
    .setName('request')
    .setDescription('Submit a new pool request')
    .addStringOption(option =>
      option.setName('indicator')
        .setDescription('e.g., US CPI')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('source')
        .setDescription('Trusted outcome source URL')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('title')
        .setDescription('Pool title (e.g., US CPI for July 2025)')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('description')
        .setDescription('Tell more about the indicator, how it affects things, and any context')
        .setRequired(false))
    .toJSON()
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('🔁 Refreshing application commands...');
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
      { body: commands }
    );
    console.log('✅ Successfully registered application commands.');
  } catch (error) {
    console.error(error);
  }
})();
