require('dotenv').config()
const { Client, Intents } = require('discord.js')
const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS]})
const token = process.env.TOKEN
client.login(token)

// para guardar os objetos das mensagens que estão sendo tracked
const messagesTracked = []

// limpa o console e mostra uma mensagem quando o bot ficar online
client.on('ready', () => {
    console.clear()
    console.log(`🤖 ${client.user.tag} ficou online!`)
})

// quando uma mensagem é enviada no discord, verifica se tem algum comando junto. Caso tenha, faz o que está dentro dos if's
client.on('messageCreate', msg => {
    const splittedMsg = msg.content.split(' ')
    const command = splittedMsg[0]
    const idMsg = splittedMsg[1]

    if(isTrackCommand(command)) {
        msg.reply(`A mensagem de ID "${idMsg}" está sendo monitorada!`)
    }

    if(isScoreCommand(msg.content)) {
        const score = calcScore(messagesTracked)

        msg.reply(`${score.pessoas.map((user, i) => `${i + 1}º - ${user} (${score.scores[i]} Pontos de Engajamento)\n`).toString().replaceAll(',', '')}`)
    }
})

// quando uma reação for adiciona a um comentário que esteja sendo tracked, faça tal coisa
client.on('messageReactionAdd', (reaction, user) => {
    // cria um objeto para o usuário que reagiu
    const userLog = {name: user.username}

    // verifica se a mensagem que o usuário reagiu já existia dentro do array "messagesTracked". Caso sim, retorna ela no "existingMessage"
    const existingMessage = messagesTracked.find(item => item.msgID === reaction.message.id)

    // verifica se o "existingMessage" retornou true. Caso sim, verifica quantos pontos de engajamento o usuário que interagiu deve ganhar
    if(existingMessage) {
        let engagementPointsToGive = 0
        
        if(existingMessage.users.length === 1) {
            engagementPointsToGive = 4
        } else if(existingMessage.users.length === 2) {
            engagementPointsToGive = 3
        } else if(existingMessage.users.length === 3) {
            engagementPointsToGive = 2
        } else if(existingMessage.users.length > 3) {
            engagementPointsToGive = 1
        }

        // verifica se é a primeira vez que esse usuário interagiu nessa mensagem e se essa mensagem já teve 10 interações
        if(!existingMessage.users.find(item => item.name === user.username) && existingMessage.users.length < 10) {
            existingMessage.users.push(userLog)
            userLog.engagement = engagementPointsToGive
        }

    // caso a mensagem ainda não existia no "trackedMessages", adiciona ela lá e da 5 pontos de engajamento para o usuário que interagiu
    } else {
        messagesTracked.push({msgID: reaction.message.id, users: [userLog]})
        userLog.engagement = 5
    }

    // mostra no console todas as mensagens que estão sendo tracked
    console.clear()
    console.dir(messagesTracked, { depth: null })
})

// verifica se foi usando o comando "!track" na mensagem
function isTrackCommand(command) {
    return command === '!track'
}

// verifica se foi usando o comando "!score" na mensagem
function isScoreCommand(command) {
    return command === '!score'
}

// agrupa um array baseado na key dele
const groupByEngagement = (array, key) => {
    return array.reduce((result, currentValue) => {
        (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue.engagement)
        return result
    }, {})
}

// calcula os scores de cada usuário que já interagiu com alguma mensagem tracked
function calcScore(messages) {
    let newScore = []

    messages.map(msg => newScore.push(...msg.users))

    newScore = groupByEngagement(newScore, 'name')

    console.dir(newScore, { depth: null })

    const pessoas = Object.keys(newScore)
    const scores = Object.values(newScore).map(score => score.reduce((acc, curr) => acc += curr, 0))

    return {pessoas, scores}
}