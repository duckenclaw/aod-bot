require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const token = process.env.TELEGRAM_BOT_TOKEN;
const targetChannelId = process.env.TARGET_CHANNEL_ID;

const bot = new TelegramBot(token, { polling: true });

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (msg.chat.type === 'private') {
    bot.sendMessage(targetChannelId, `New message from @${msg.from.username}: ${text}`)
      .then(() => {
        console.log(`Message forwarded to channel ${targetChannelId}: ${text}`);
      })
      .catch((err) => {
        console.error('Error forwarding message:', err);
      });
  }
});

console.log('Bot is running...');