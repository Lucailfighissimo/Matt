const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once('ready', () => {
  console.log(`✅ Bot pronto! Collegato come ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (message.content.startsWith('!club')) {
    const args = message.content.split(' ');
    if (args.length < 2) {
      return message.reply('⚠️ Specifica un tag. Esempio: `!club #ABCDEF`');
    }

    const playerTag = args[1].trim().replace('#', '').toUpperCase();

    if (!/^[0-9A-Z]{3,}$/.test(playerTag)) {
      return message.reply('⚠️ Tag giocatore non valido!');
    }

    try {
      const response = await fetch(`https://api.brawlstars.com/v1/players/%23${playerTag}`, {
        headers: {
          'Authorization': `Bearer "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjZhNzNhZjc5LTIxZTEtNDFlNS1iYWM1LTMyNGQyMWE3ZTk2NyIsImlhdCI6MTc1MTcyNzM2Miwic3ViIjoiZGV2ZWxvcGVyLzliMjlkNGIyLTQzNjUtNWQwMi03NTlhLTExOWI1ZjAxZTU3NyIsInNjb3BlcyI6WyJicmF3bHN0YXJzIl0sImxpbWl0cyI6W3sidGllciI6ImRldmVsb3Blci9zaWx2ZXIiLCJ0eXBlIjoidGhyb3R0bGluZyJ9LHsiY2lkcnMiOlsiMy4yMjAuMTU5LjM0IiwiMzQuNjEuMTMwLjcxIl0sInR5cGUiOiJjbGllbnQifV19.v9_7kp8rFCedAPfXNhD7yaO3U2yMHvwPfaLXbF2S86GaAGL4TekOejCjHCVv3WObHAtNZAKr_R-gpBBEagb29g"`,
          'Accept': 'application/json'
        }
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 404) {
          return message.reply('🔍 Giocatore non trovato!');
        }
        if (data.reason === 'accessDenied') {
          return message.reply('🔑 Problema di autorizzazione API. Verifica il token!');
        }
        throw new Error(`Errore API: ${data.reason || response.status}`);
      }

      if (!data.club) {
        return message.reply('❌ Il giocatore non è in nessun club!');
      }

      const club = data.club;
      const embed = new EmbedBuilder()
        .setColor(0x00FF00)
        .setTitle(`🏆 Club di ${data.name}`)
        .setThumbnail(club.badgeUrl)
        .addFields(
          { name: 'Nome Club', value: club.name, inline: true },
          { name: 'Tag Club', value: `#${club.tag}`, inline: true }
        )
        .setFooter({ 
          text: `Richiesto da ${message.author.username}`, 
          iconURL: message.author.displayAvatarURL() 
        });

      message.reply({ embeds: [embed] });

    } catch (error) {
      console.error('Errore API:', error);
      message.reply('🚨 Errore durante il recupero dei dati!');
    }
  }
});

client.login(MTM5MTAzMzk4MTEyNTc5MTg3NA.GR1BFh.4xl9JimzwzB8G6SEKT8e712cEI98h8AV4TB9tg);
