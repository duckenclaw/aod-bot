const TelegramBot = require('node-telegram-bot-api');
const path = require('path');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token);

exports.handler = async (event) => {
  const body = JSON.parse(event.body);
  bot.processUpdate(body);
  return { statusCode: 200, body: "OK" };
};

const targetChannelId = process.env.TARGET_CHANNEL_ID;

const messages = {
  start: `<i>Ура, вам досталась рукопись моей новой книги "Все наши демоны".</i>\n\nЭто тг-бот, где можно <b>удобно читать</b>, <b>писать отзывы</b> (<span class="tg-spoiler">а они мне очень важны, конечно же</span>),<b>слушать саундтрек</b> и получать уведомление о выходе глав.\n\nМне хотелось сделать что-то особенное, что будет не просто чтением, а каким-то интересным опытом. Спасибо, что решили попробовать!\n\nКнига доступна по кнопке в левом углу! Но возможно ты хочешь ознакомиться с аннотацией? Ну или сразу перейти к саундтреку главы?`,
  annotation: `<i>“Все наши демоны”</i> - это фэнтези-роман, через который я пыталась понять отношение к множествам вещей: религии, политике, капитализму, фетишам, ну и любви.\n\n                                                                        ⚪️⚪️⚪️\n\n<i>Калеб — охотник на демонов, чья жизнь давно потеряла смысл.Он полностью отдал себя церкви и служению.  Когда ему было шестнадцать, он встретил ее - девушку в кристальном гробу, и с того дня ее образ стал тайной одержимостью и стыдливым секретом. Но спустя тридцать лет он встречает ее вновь. Уже живой.</i>\n\n<i>Лейн оказывается не хрупкой беззащитной девушкой, а яростной и изобретательной ведьмой, которую опасаются даже верховные демоны. Кроме одного — демона Желания,владеющий душой Калеба, манипулируя его мыслями и  тайнами. Лейн обещает избавить его от этого проклятия, но взамен требует защиты в мире, который она больше не узнает, мире, где магия стала машиной, а ведьмы уже давно  сгорели в кострах инквизиции.</i>\n\n                                                                        ⚫️⚫️⚫️\n\n<b>Тэги:</b> Dark Fantasy, Enemies to Lovers, Found Family, Grumpy x Sunshine, Slowburn, Complicated Relationship, Hard Magic system`,
  warning1: `<b>Последние тонкости</b>\n\nОтзыв можно оставить в <b>любой момент</b>. Просто пишите этому боту так, как пишите своей подружке в ночи по поводу нового фанфика. Я хотела, чтобы у читателя была полная свобода действий.\n\nНа отзывы и вопросы я буду отвечать <a href="https://t.me/+akK9sc-CH2c0MjAy">здесь</a>. Не волнуйтесь, анонимность сохраняем ✨\n\nЕще здесь всегда доступна менюшка с промо материалами. Саундтреком к главе, фейковым кадром и цитатой. Просто для атмосферы. Если хочется больше материалов и истории создания, то для этого есть отдельный <a href="https://t.me/+akK9sc-CH2c0MjAy">канал</a>. \n\nНачнем с 1 главы? Нажми на кнопку читать в левом нижнем углу окна чата.`,
  warningChoice: `Спасибо! Хочешь прочитать предупреждения перед книгой и Trigger warning?`,
  warning2: `<b>Предупреждения:</b>\nТак как книга изначально писалась на английском, я использую английский вариант оформления прямой речи.\n\nВ работе могут встречаться ошибки. Первые три главы были проверены <b>Иман Мусаевой</b>. Спасибо ей огромное!\n\n♦️ <i>Графическое насилие (включая сцены убийств, пыток и боевых действий).</i>\n♦️ <i>Упоминания и изображения манипуляций сознанием и психического контроля.</i>\n♦️ <i>Сложные и токсичные отношения между персонажами.</i>\n♦️ <i>Тема одержимости и моральной деградации.</i>\n♦️ <i>Описание травмирующих событий (включая потерю близких, предательство, насилие).</i>\n♦️ <i>Присутствует ЛГБКТКиА персонажей, также расовое разнообразие.</i>\n\n<i>Все в этой книге является выдумкой и не нацелено на оскорбление каких-либо групп, кроме, собственно, моих демонов.</i>`
};

// Function to get folders in the public/promo directory
const getFolders = () => {
  const promoPath = path.resolve(__dirname, '..', '..', 'public', 'promos'); 
  return fs.readdirSync(promoPath).filter(file => {
    return fs.statSync(path.join(promoPath, file)).isDirectory();
  });
};


bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, messages.start, {
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Аннотация', callback_data: 'annotation' }],
        [{ text: 'Меню', callback_data: 'menu' }],
      ],
    },
  });
});

bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  let newText = messages.start;
  let newKeyboard = [
    [{ text: 'Аннотация', callback_data: 'annotation' }],
    [{ text: 'Меню', callback_data: 'menu' }]
  ];
  if (query.data === 'annotation') {
    newText = messages.annotation;
    newKeyboard = [
      [{ text: 'Отлично', callback_data: 'menu' }],
    ];
  } else if (query.data === 'menu') {;
    newText = messages.warning1;
    newKeyboard = [
      [{ text: 'Ура!', callback_data: 'hooray' }],
    ];
  } else if (query.data === 'hooray') {
    newText = messages.warningChoice;
    newKeyboard = [
      [{ text: 'Прочитать', callback_data: 'read_warning' }],
      [{ text: 'Пропустить', callback_data: 'skip_warning' }],
    ];
  } else if (query.data === 'read_warning') {
    newText = messages.warning2;
    newKeyboard = [
      [{ text: 'Дальше', callback_data: 'skip_warning' }],
    ];
  } else if (query.data === 'skip_warning') {
    newText = '\n\nХорошо\, напишите команду \/menu\!';
    newKeyboard = [];
  } else {
    // Handle folder selection
    const folderPath = path.join(__dirname, 'public', 'promos', query.data);
    const files = fs.readdirSync(folderPath);

    // Find the required files
    const startPromoMd = files.find(file => file === 'start-promo.md');
    const promoMd = files.find(file => file === 'promo.md');
    const promoJpg = files.find(file => file === 'promo.jpg');
    const mp3File = files.find(file => file.endsWith('.mp3'));

    if (startPromoMd) {
      const startPromoContent = fs.readFileSync(path.join(folderPath, startPromoMd), 'utf8');
      await bot.sendMessage(chatId, startPromoContent, {
        parse_mode: "Markdown",
      });
    }

    if (promoMd) {
      const promoContent = fs.readFileSync(path.join(folderPath, promoMd), 'utf8');
      await bot.sendMessage(chatId, promoContent, { parse_mode: 'Markdown' });
    }

    if (mp3File) {
      const mp3FilePath = path.join(folderPath, mp3File);
      await bot.sendAudio(chatId, mp3FilePath);
    }

    if (promoJpg) {
      const promoImagePath = path.join(folderPath, promoJpg);
      await bot.sendPhoto(chatId, promoImagePath, {
        has_spoiler: true, // Mark the image as a spoiler
      });
    }

    return;
  }

  bot.editMessageText(newText, {
    chat_id: chatId,
    message_id: query.message.message_id,
    parse_mode: "HTML",
    reply_markup: {
      inline_keyboard: newKeyboard
    }
  });
});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if ((msg.chat.type === 'private') && !(msg.text.startsWith("/"))) {
    bot.sendMessage(targetChannelId, `New message from @${msg.from.username}: ${text}`, {parse_mode: "HTML"})
      .then(() => {
        console.log(`Message forwarded to channel ${targetChannelId}: ${text}`);
      })
      .catch((err) => {
        console.error('Error forwarding message:', err);
      });
  }
});

// Add menu with folder buttons
bot.onText(/\/menu/, (msg) => {
  const folders = getFolders();
  const folderButtons = folders.map(folder => [{ text: folder, callback_data: folder }]);
  bot.sendMessage(msg.chat.id, 'Выберите главу:', {
    reply_markup: {
      inline_keyboard: folderButtons
    }
  });
});