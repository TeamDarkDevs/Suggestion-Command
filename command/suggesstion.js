const Discord = require("discord.js")
const code = require("@codedipper/random-code");

module.exports = {
    name: "suggestion",
    description: "Rename Ticket",
    run: async (client, message, args, db, prefix) => {
         let command = args[0];
  let first = args[1];
  if(!command) return message.channel.send(`
  **Member Commands**
  ${prefix}suggestion suggest 
  **Admin Commands**
  ${prefix}suggestion reply <suggest-token> <reply>
  ${prefix}suggestion setsuggestion [channel]
  `)
  if(command.toLowerCase() === 'suggest') {
    let suggest = args.slice(1).join(" ");
    if(!suggest) return message.channel.send(`${prefix}suggestion suggest <ur suggestion>`)
    if(suggest.length < 5) return message.channel.send(`Suggestion's Length must be more then 5`)
    let suggestionroom = db.get(`suggest_${message.guild.id}_c`)
    if(!suggestionroom) return message.channel.send(`Suggestion room isn't available\nDm an admin to fix this.`)
    if(suggestionroom) {
        let check = message.guild.channels.cache.get(suggestionroom)
        if(!check) {
            db.delete(`suggestion_${message.guild.id}`)
            return message.channel.send(`i can't local the [Suggestion room] please dm an admin to fix this..`)
        }
        if(check) {
 let suggestontoken = code(10);
            let embed = new Discord.MessageEmbed()
         .setAuthor(message.author.username , message.author.displayAvatarURL())
         .setDescription(suggest)
         .setFooter(`Suggestion Token: ${suggestontoken}`, message.guild.iconURL())      
        .setTimestamp()
        check.send(embed).then(m => {
          m.react('✅')
          m.react('❌')
          message.author.send(`Suggestion Created. \nGuild ${message.guild.name}\nYou agreed to be dmed on admin reply on ur suggestion.`)
          db.set(`suggest_${suggestontoken}`, m.id)
           db.set(`suggest_${suggestontoken}_msg`, suggest)
          db.set(`suggest_${suggestontoken}_user`, message.author.id)
          message.channel.send(`successfully sumbited your suggestion`)
         })
        }
    }
  }
if(command.toLowerCase() === 'reply') {
if(!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(`**You missing required permisison __ADMINISTRATOR__**`)
let reply = args.slice(2).join(" ");
if(!first) return message.channel.send(`${prefix}suggestion reply <reply-token> <reply>`)
let messageid = db.get(`suggest_${first}`)
if(!messageid) return message.channel.send(`That's not vaild token.`)
if(!reply) return message.channel.send(`${prefix}suggestion reply ${first} <reply>`)
let channel =  db.get(`suggest_${message.guild.id}_c`)
let msg =  db.get(`suggest_${first}_msg`)
if(!channel) return message.channel.send(`${prefix}suggestion reply ${first} <reply>`)
if(!msg) return message.channel.send(`${prefix}suggestion reply ${first} <reply>`)
let checking = message.guild.channels.cache.get(channel)
if(!checking) return message.channel.send(`i can't find suggestion room please set anew one...`)
if(checking) {
    let user = db.get(`suggest_${first}_user`)
    let embed = new Discord.MessageEmbed()
    .setAuthor(client.users.cache.get(user).username , client.users.cache.get(user).displayAvatarURL())
    .setDescription(msg)
    .addField(`Reply By ${message.author.username} | ${message.author.id} ` , reply)
    .setFooter(`Suggestion Token: ${first}`, message.guild.iconURL())      
   .setTimestamp()
    checking.messages.fetch(messageid).then(editm => {
        editm.edit(embed)
        client.users.cache.get(user).send(`You've got answer on ur suggestion by admin.`)
        message.channel.send(`successfully replyed to suggestion.`)
    })
}
}
if(command.toLowerCase( ) === 'setsuggestion') {
if(!message.member.hasPermission('ADMINISTRATOR')) return message.channel.send(`**You missing required permisison __ADMINISTRATOR__**`)
let channel = message.mentions.channels.first()
if(!channel) return message.channel.send(`You must mention an vaild channel to set it as suggestion channel`)
if(channel) {
channel.send(`Suggestion Room ${message.guild.name}\nTo sumbit suggestion ${prefix}suggestion suggest <suggestion>`)
db.set(`suggest_${message.guild.id}_c`, channel.id)    
}
}
    }}
