const Discord = require('discord.js');
const fs = require('fs');
const token = require('./token');
const bot = new Discord.Client();

bot.login(token);

bot.on('ready', () => {
    console.log("To vivo")
})

function responderPorindex(msg, arraydeRespostas){
    const escolhido = Math.floor(Math.random() * arraydeRespostas.length);
    if(arraydeRespostas[escolhido]){
        msg.channel.send(`${msg.author} ${arraydeRespostas[escolhido]}`);
    }
}

bot.on('message', (msg) => {
    splitedMessage = msg.content.split(" ");
    let mensagensResposta = JSON.parse(fs.readFileSync('respostas.json').toString());
    let keyword = '';
    switch (splitedMessage[0]) {
        case '!ensinar':
            keyword = splitedMessage[1];
            if(keyword.length > 3 || keyword.length < 2){
                msg.channel.send(`${msg.author} as ultimas letras podem ser só 2 ou 3 seu arrombado`);
            }else{
                let response = '';
                for (let index = 2; index < splitedMessage.length; index++) {
                    response += splitedMessage[index] + ' ';
                }

                if(mensagensResposta[keyword]){
                    mensagensResposta[keyword].push(response);
                }else{
                    mensagensResposta[keyword] = [response];
                }
                fs.writeFileSync('respostas.json', JSON.stringify(mensagensResposta, null, '\t'));
                msg.channel.send(`${msg.author} aprendi a falar **${response}**quando alguém digitar **${keyword}**`);
            }        
            break;
        case '!listar':
            let mensagemFinal = '';
            const objMsg = Object.entries(mensagensResposta);
            objMsg.forEach((keyword) => {
                let mensagens = '';
                keyword[1].forEach((msge, indexmsge) => {
                    mensagens += `\t${msge}(${indexmsge})\n`;
                });
                mensagemFinal += `${keyword[0]}: \n${mensagens}`;
            });
            msg.channel.send(`${msg.author} \n${mensagemFinal}`);
            break;
        case '!remover':
            keyword = splitedMessage[1];
            const frase = splitedMessage[2];
            const finded = mensagensResposta[keyword];
            if(finded){
                if(mensagensResposta[keyword][frase]){
                    mensagensResposta[keyword].splice(frase, 1);
                    fs.writeFileSync('respostas.json', JSON.stringify(mensagensResposta, null, '\t'));
                    msg.channel.send(`${msg.author} removi ${frase} dentro de **${keyword}**`);  
                }else{
                    msg.channel.send(`${msg.author} não achei o ${frase} dentro de **${keyword}**`);  
                }
            }else{
                msg.channel.send(`${msg.author} não achei esse **${keyword}**`);
            }
            break
        case '!ajuda':
            msg.channel.send(`${msg.author} Comandos: 
            \t!ensinar [3 ultimas letras] [frase]: Ensina o PortugaBot
            \t!listar: Lista as respostas atuais
            \t!remover [3 ultimas letras] [Índice]: Remove uma resposta, veja no !listar pra saber o índice`
            );
            break
        default:
            if(msg.author.id !== '713642502367739955'){
                const mtext3 = msg.content.substr(msg.content.length - 3);
                const mtext2 = msg.content.substr(msg.content.length - 2);

                if(mensagensResposta[mtext3]){
                    responderPorindex(msg, mensagensResposta[mtext3])
                }else{
                    if(mensagensResposta[mtext2]){
                        responderPorindex(msg, mensagensResposta[mtext2])
                    }}
            }
            break;
    }
})