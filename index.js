const { Client, GatewayIntentBits } = require('discord.js');
const { google } = require('googleapis');
require('dotenv').config();

const credentials = JSON.parse(process.env.GOOGLE_CREDS);

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

const sheets = google.sheets({ version: 'v4', auth });

const SPREADSHEET_ID = '1G99oS5jzrOCfq3w3m0Hwk1jdqlUSHwTNVn24dsnRFpU'; // Replace with yours

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName !== 'request') return;

  const indicator = interaction.options.getString('indicator');
  const source = interaction.options.getString('source');
  const title = interaction.options.getString('title');
  const description = interaction.options.getString('description') || '';

  const user = interaction.user.tag;
  const timestamp = new Date().toISOString();

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Sheet1!A:F', // Assumes columns: timestamp, user, indicator, source, title, description
      valueInputOption: 'RAW',
      requestBody: {
        values: [[timestamp, user, indicator, source, title, description]]
      }
    });

    await interaction.reply({
      content:
        `✅ **New Pool Request Submitted by <@${interaction.user.id}>**\n` +
        `📊 **Indicator**: ${indicator}\n` +
        `🧾 **Title**: ${title}\n` +
        `🔗 **Source**: ${source}\n` +
        `📝 **Description**: ${description || '—'}`,
      ephemeral: false
    });
  } catch (err) {
    console.error('❌ Google Sheets Error:', err);
    await interaction.reply({ content: '❌ Failed to log your request.', ephemeral: true });
  }
});

client.login(process.env.DISCORD_TOKEN);
