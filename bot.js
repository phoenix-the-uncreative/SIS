const Discord = require('discord.js');
const mysql = require('mysql');
const fs = require('fs');
const bot = new Discord.Client();

let anonCooldowned = [];
let anonChannel = [];
let anonSend = [];

let config = JSON.parse(fs.readFileSync('config.json', (err, data) => {
	config = data;
}));

let connection = mysql.createConnection({
	host: config.host,
	user: config.user,
	password: config.password,
	database: config.database
});

bot.on('ready', () => {
	console.log(`Logged in as ${bot.user.tag}! || ${new Date}`);
});

bot.on('message', msg => {
	let text = msg.content.toLowerCase();
	let sisChannels = bot.guilds.cache.get("801494125064355957")
		.channels.cache;
	
	if (msg.author.id == bot.user.id) return;
	
	connection.connect(() => {
		connection.query("SELECT * FROM `" + config.table + "` WHERE `" + config.column + "` = " + msg.author.id + " and `" + config.column_ban + "` = 0", (err, result, fields) => {
				if (result.length == 0) {
					msg.channel.send(
						"За вашим аккаунтом Discord не закреплено ни одного персонажа Морганы или все ваши персонажи забанены. Публиковать анонимные объявления без персонажей запрещено в целях безопасности."
					);
				} else if (msg.channel.type == "dm") {
					if (anonCooldowned[msg.channel.id] == (false || undefined)) {
						if (text == "анон старт") {
							msg.channel.send(
								"**ШИС: Отправка анонимных сообщений**\nВведите название канала, куда это сообщение будет отправлено (например: \"куплю\", \"разные-объявления\"):"
							);
							anonSend[msg.channel.id] = 1;
						} else if (anonSend[msg.channel.id] == 1) {
							if ((sisChannels.find(channel => channel.name === msg.content) !=
									undefined) && (sisChannels.find(
										channel => channel.name === msg.content)
									.parentID == "801502233845563462")) {
								anonChannel[msg.channel.id] = sisChannels.find(channel => channel
										.name === msg.content)
									.id;
								anonSend[msg.channel.id] = 2;
								msg.channel.send("Канал #" + msg.content +
									" успешно выбран. Введите сообщение, которое будет туда анонимно отправлено:"
									);
							} else msg.channel.send(
								"Канал не найден или не находится в категории объявлений. Попробуйте снова."
								);
						} else if (anonSend[msg.channel.id] == 2) {
							sisChannels.get(anonChannel[msg.channel.id])
								.send("**Анонимное объявление:**\n" + msg.content);
							sisChannels.get("801787710410588170")
								.send("- Принято анонимное объявление от пользователя " + msg.author
									.tag + " за " +
									`${new Date().toLocaleString()}.\n\n**Текст объявления**:\n` +
									msg.content);
							msg.channel.send(
								"Сообщение принято и отправлено. Следующее анонимное сообщение может быть отправлено только через час.\nСпасибо за использование услуги анонимной отправки сообщений."
							);
							anonCooldowned[msg.channel.id] = true;
							anonSend[msg.channel.id] = 0;
							setTimeout(() => {
								anonCooldowned[msg.channel.id] = false
							}, 3600000);
						} else msg.channel.send(
							"Я реагирую только на команду \"анон старт\", а на другие темы разговаривать не умею. Пока."
							);
					} else msg.channel.send(
						"Возможна отправка лишь одного анонимного сообщения в час. Пожалуйста, подождите."
						);
				};
			});
	});
});

bot.login(config.token);
