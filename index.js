require ('dotenv').config();
const { Client, Intents } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });

const TOKEN = process.env.TOKEN;


var idMessage = '';
var arrayComentarios = [];

client.on("ready", () => {
    console.log(`🤖 ${client.user.tag} It's online`);
});

client.on("messageCreate", (msg) => {
    var idUser = msg.author.id;
    let message_dividida = msg.content.split(" ");
    //Verificando se é o comando para rastrear uma mensagem e se é por uma pessoa autorizada
    if ( isTrackCommand(message_dividida[0]) && isAuthorizedPerson(idUser)) {
        msg.reply("Enquete sendo analisada XD");
        idMessage = message_dividida[1];
        console.log('Id da mensagem rastreada: ', idMessage);
    }

});

client.on("messageReactionAdd", (msg) => {
    let idMessageFromDiscord = msg.message.id;
    if (idMessageFromDiscord == idMessage){
        console.log('\n\n');
        // console.log('>>> id da mensagem correta está sendo rastreada');
        // console.log('>>> id da mensagem reagida: ', idMessageFromDiscord);
        console.log("reação");
        console.log(">>> msg: reactions ", msg.toJSON());
        // console.log(">>> msg: reactions ", msg.emoji.toString());
        // console.log('>>> users: ', msg.users);
        console.log('>>> msg', msg);
    }

});

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

function isAuthorizedPerson (id) {
    return id === '486988988788375572';
    // return id === '863845718837166170';
}

function isTrackCommand(command) {
    return command === '!track'
}

client.login(TOKEN);