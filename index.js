const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

const messages = {
  start: `🤩Ура, вам досталась рукопись моей новой книги “Все наши демоны”.🤩\n\nЭто тг-бот, где можно удобно читать, писать отзывы (а они мне очень важны, конечно же), слушать саундтрек и получать уведомление о выходе глав.\n\nМне хотелось сделать что-то особенное, что будет не просто чтением, а каким-то интересным опытом. Спасибо, что решили попробовать! 🤩\n\nКнига доступна по кнопке в левом углу! Но возможно ты хочешь ознакомиться с аннотацией? Ну или сразу перейти к саундтреку главы?`,
  annotation: `\n\n“Все наши демоны” - это фэнтези-роман через который я пыталась понять отношения к множествам вещами: религии, политике, капитализму, фетишам, ну и любви.\n\n🤩🤩🤩\n\nКалеб — охотник на демонов, чья жизнь давно потеряла смысл. Он полностью отдал себя церкви и служению. Когда ему было шестнадцать, он встретил ее - девушку в кристальном гробу, и с того дня ее образ стал тайной одержимостью и стыдливым секретом. Но спустя тридцать лет он встречает ее вновь. Уже живой.\n\nЛейн оказывается не хрупкой беззащитной девушкой, а яростной и изобретательной ведьмой, которую опасаются даже верховные демоны...\n\n🤩🤩🤩\n\nТэги: Dark Fantasy, Enemies to Lovers, Found Family, Grumpy x Sunshine, Slowburn, Complicated Relationship, Hard Magic system`,
  warning1: `\n\n🤩Последние тонкости🤩\n\nОтзыв можно оставить в любой момент. Просто пишите этому боту так, как пишите своей подружке в ночи по поводу нового фанфика. Эмодзи, стикеры, любые реакции, рецензии, как угодно. Я хотела, чтобы у читателя была полная свобода действий. 🤩`,
  warningChoice: `\n\nСпасибо! Хочешь прочитать предупреждения перед книгой и Trigger warning?`,
  warning2: `\n\nПредупреждения:\nТак как книга изначально писалась на английском, я использую английский вариант оформления прямой речи.\n\nВ работе могут встречаться ошибки. Первые три главы были проверены Иман Мусаевой. Спасибо ей огромное!\n\n🤩Графическое насилие (включая сцены убийств, пыток и боевых действий).\n🤩Упоминания и изображения манипуляций сознанием и психического контроля.\n🤩Сложные и токсичные отношения между персонажами.\n🤩Тема одержимости и моральной деградации.\n🤩Описание травмирующих событий (включая потерю близких, предательство, насилие).\n🤩Присутствует ЛГБКТКиА персонажей, также расовое разнообразие.\n\nВсе в этой книге является выдумкой и не нацелено на оскорбление каких-либо групп, кроме, собственно, моих демонов.`
};

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, messages.start, {
    reply_markup: {
      inline_keyboard: [
        [{ text: 'Аннотация', callback_data: 'annotation' }],
        [{ text: 'Меню', callback_data: 'menu' }],
      ],
    },
  });
});

bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;
  let newText = messages.start;
  let newKeyboard = [
    [{ text: 'Аннотация', callback_data: 'annotation' }],
    [{ text: 'Меню', callback_data: 'menu' }]
  ];

  if (query.data === 'annotation') {
    newText += messages.annotation;
  } else if (query.data === 'menu') {
    newText += messages.warning1 + messages.warningChoice;
    newKeyboard = [
      [{ text: 'Прочитать', callback_data: 'read_warning' }],
      [{ text: 'Нет, спасибо', callback_data: 'skip_warning' }]
    ];
  } else if (query.data === 'read_warning') {
    newText += messages.warning2;
  } else if (query.data === 'skip_warning') {
    newText += '\n\nХорошо, продолжаем!';
  }

  bot.editMessageText(newText, {
    chat_id: chatId,
    message_id: query.message.message_id,
    reply_markup: {
      inline_keyboard: newKeyboard
    }
  });
});