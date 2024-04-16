const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const TelegramBot = require('node-telegram-bot-api');
var validacao = false;
require('dotenv').config();

const token = process.env.TOKEN;

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/echo (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = match[1];

  bot.sendMessage(chatId, resp);
});

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const message = msg.text;

 
  var date = new Date();
  if(date.getHours() >= 9 && date.getHours <= 18){
    bot.sendMessage(chatId, 'https://faesa.br');
  }
  else{
    if(validacao && msg.text.includes('@')){
      await saveMessage(message);
      bot.sendMessage(chatId, 'Recebemos o seu e-mail! Em breve entraremos em contato.');
      validacao = false;
    }
    else if(validacao){
        bot.sendMessage(chatId, 'Envie o seu e-mail para contato futuro.');
    }
    else{
        bot.sendMessage(chatId, 'No momento nossa equipe se encontra indisponível, pois o horário de funcionamento é de 09:00 às 18:00. Por favor, envie o seu e-mail para contato futuro.');
    validacao = true;
    }
  }


  
});

async function saveMessage(message) {
  try {
    await prisma.emailContato.create({
      data: {
        email: message,
      },
    });
    console.log('Mensagem salva com sucesso!');
  } catch (error) {
    console.error('Erro ao salvar a mensagem:', error);
  }
}