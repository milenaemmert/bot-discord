require ('dotenv').config();
const { Client, Intents } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });

const TOKEN = process.env.TOKEN;

var idMessage = '';

client.on("ready", () => {
    console.log(`🤖 ${client.user.tag} It's online`);
});

client.on("messageCreate", (msg) => {
    var userName = msg.member.user.username;
    var idUser = msg.author.id;
    var messageContent = msg.content;
    var timeStamp = msg.createdTimestamp;

    if (isAuthorizedPerson(idUser) && commandForTrackMessage(messageContent)) {
        let dataMessage = person(userName, idUser, messageContent, timeStamp);
        // console.log('>>> log message: ', dataMessage);
        //msg.reply('Mensagem recebida RUI!!!');
        // console.log('>>> idMessage ', idMessage);
    }

});

client.on("messageUpdate", (msg) => {
    console.log("mensagem atualizada");
});

client.on("messageReactionAdd", (msg) => {
    let idMessageFromDiscord = msg.message.id;
    if (idMessageFromDiscord == idMessage){
        console.log('>>> id da mensagem correta está sendo rastreada');
        console.log('>>> id da mensagem reagida: ', idMessageFromDiscord);
        console.log("reação");
        console.log(">>> msg: ", msg);
    }
});

function formattedDate  (timeStamp)  {
    var date = new Date(timeStamp);
    let fullDate = date.getDate()+
    "/"+(date.getMonth()+1)+
    "/"+date.getFullYear()+
    " "+date.getHours()+
    ":"+date.getMinutes()+
    ":"+date.getSeconds();

    return fullDate;
}

function person  (userName, idUser, messageContent, timeStamp) {
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

function isAuthorizedPerson (id) {
    return id === '486988988788375572';
}

function commandForTrackMessage (command) {
    command = splitMessage(command);
    if (command[0] !== '!track') {
        return false;
    }
    idMessage = command[1];
    console.log('>>> IdMessage', idMessage);
    return true;
}

function splitMessage (message) {
    return message.split(' ');
}

client.login(TOKEN);