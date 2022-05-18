require ('dotenv').config();
const { Client, Intents } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

const TOKEN = process.env.TOKEN;


client.on("ready", () => {
    console.log(`🤖 ${client.user.tag} It's online`);
});

client.on("message", (msg) => {
    let userName = msg.member.user.username;
    let idUser = msg.author.id;
    let messageContent = msg.content;
    let timeStamp = msg.createdTimestamp;
    if (messageContent === "olá" || messageContent == "oi") {
        msg.reply("Olá!");
    }

    let dataMessage = person(userName, idUser, messageContent, timeStamp);
    console.log('>>> log message: ', dataMessage);
    console.log('Mensagem: ', msg);
});


const formattedDate = (timeStamp) => {
    var date = new Date(timeStamp);
    let fullDate = date.getDate()+
    "/"+(date.getMonth()+1)+
    "/"+date.getFullYear()+
    " "+date.getHours()+
    ":"+date.getMinutes()+
    ":"+date.getSeconds();

    return fullDate;
}

const person = (userName, idUser, messageContent, timeStamp) => {
    const date = formattedDate(timeStamp);
    let logUser = {
        'nome': userName,
        'usuario': idUser,
        'mensagem': messageContent,
        'data': date, 
        'timestamp': timeStamp,
    }

    return logUser;
}

client.login(TOKEN);