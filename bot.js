const Discord = require('discord.js');
const bot = new Discord.Client();

let anonCooldowned = [];
let anonChannel = [];
let anonSend = [];

bot.on('ready', () => {
  console.log(`Logged in as ${bot.user.tag}! || ${new Date}`);
});

bot.on('message', msg => {
  let text = msg.content.toLowerCase();

  if(msg.author.id == bot.user.id) return;

  if(msg.channel.type == "dm"){
    if(text == "анон старт" && anonCooldowned[msg.channel.id] == (false || undefined)){
      msg.channel.send("**ШИС: Отправка анонимных сообщений**\nВведите название канала, куда это сообщение будет отправлено (например: \"куплю\", \"разные-объявления\"):");
      anonSend[msg.channel.id] = 1;
    } else if (anonSend[msg.channel.id] == 1){
        if((bot.guilds.cache.get("801494125064355957").channels.cache.find(channel => channel.name === msg.content) != undefined) && (bot.guilds.cache.get("801494125064355957").channels.cache.find(channel => channel.name === msg.content).parentID == "801502233845563462")){
          anonChannel[msg.channel.id] = bot.guilds.cache.get("801494125064355957").channels.cache.find(channel => channel.name === msg.content).id;
          anonSend[msg.channel.id] = 2;
          msg.channel.send("Канал #"+msg.content+" успешно выбран. Введите сообщение, которое будет туда анонимно отправлено:");
        } else msg.channel.send("Канал не найден или не находится в категории объявлений. Попробуйте снова.");
    } else if (anonSend[msg.channel.id] == 2){
      bot.guilds.cache.get("801494125064355957").channels.cache.get(anonChannel[msg.channel.id]).send("**Анонимное объявление:**\n" + msg.content);
      bot.guilds.cache.get("801494125064355957").channels.cache.get("801787710410588170").send("- Принято анонимное объявление от пользователя " + msg.author.tag + " за " + `${new Date().toLocaleString()}.\n\n**Текст объявления**:\n` + msg.content);
      msg.channel.send("Сообщение принято и отправлено. Следующее анонимное сообщение может быть отправлено только через час.\nСпасибо за использование услуги анонимной отправки сообщений.");
      anonCooldowned[msg.channel.id] = true;
      anonSend[msg.channel.id] = 0;
      setTimeout(function(){ anonCooldowned[msg.channel.id] = false}, 3600000);
    } else msg.channel.send("Возможна отправка лишь одного анонимного сообщения в час. Пожалуйста, подождите.");
  };
});

bot.login('ODAxNzUwNDc5MzM1ODUwMDE1.YAlOUg.s5VQqyuNjMkiftG6DXhl6awiDQA'); // Super secret token inside the code itself? In PLAINTEXT? Yes, please.
