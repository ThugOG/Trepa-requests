const { Client, GatewayIntentBits, SlashCommandBuilder, Routes, REST } = require('discord.js');
const { google } = require('googleapis');
const fs = require('fs');
require('dotenv').config();

const credentials = JSON.parse(process.env.GOOGLE_CREDS);

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const sheets = google.sheets({ version: 'v4', auth });

const SPREADSHEET_ID = '1G99oS5jzrOCfq3w3m0Hwk1jdqlUSHwTNVn24dsnRFpU'; // from the URL

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName !== 'request') return;

  const indicator = interaction.options.getString('indicator');
  const source = interaction.options.getString('source');

  const user = interaction.user.tag;
  const timestamp = new Date().toISOString();

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Sheet1!A:F',
      valueInputOption: 'RAW',
      requestBody: {
        values: [[timestamp, user, indicator, source]]
      }
    });

    await interaction.reply({ content: '✅ Your request has been logged!', ephemeral: true });
  } catch (err) {
    console.error(err);
    await interaction.reply({ content: '❌ Failed to log your request.', ephemeral: true });
  }
});
console.log("Token loaded?", !!process.env.DISCORD_TOKEN);
client.login(process.env.DISCORD_TOKEN);
