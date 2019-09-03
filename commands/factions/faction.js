const { Command } = require('discord.js-commando')
const config = require('../../config/config.js')
const { RichEmbed } = require('discord.js');
var commandchannel = '<#' + (config.get('bot_commands_id')) + '>'
var timeout = (config.get('arg_timeout'))
module.exports = class FactionCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'faction',
            group: 'factions',
            memberName: 'faction',
            description: 'Allows a user to provide info for faction wars',
            examples: ['member'],
            guildOnly: true,
            aliases: ['pleasebecool'],
            args: [
                {
                    key: 'pl_psn',
                    prompt: `What is your PSN ID?`,
                    type: 'string',
                    wait: timeout,
                },
                {
                    key: 'pl_ign',
                    prompt: 'What is your Conan Exiles Character Name?',
                    type: 'string',
                    wait: timeout,
                },
                {
                    key: 'pl_faction',
                    prompt: `Do you want to be in a Faction or Exile (Solo)?`,
                    type: 'string',
                    wait: timeout,
                },
                {
                    key: 'pl_focus',
                    prompt: `What is your play style in Conan Exiles? You may choose one or more: \n Building, Raiding, Defending, Resourcing, Exploring, Organizing, Trading, No Preference.`,
                    type: 'string',
                    wait: timeout,
                },
                {
                    key: 'pl_friends',
                    prompt: `Do you have friends you would like to stick with? List them here.`,
                    type: 'string',
                    wait: timeout,
                },
            ]
        })
    }

    hasPermission(msg) {
        if (msg.channel.id !== (config.get('bot_commands_id'))) {
          msg.delete()
          return `Must run commands in ${commandchannel}`
          }
        else{
          return true}
      }

    run(msg, { pl_psn, pl_ign, pl_faction, pl_focus, pl_friends }) {
        const embed = new RichEmbed()
                    .addField('PSN ID', `${pl_psn}`)
                    .addField('Discord', `${msg.author.username}`)
                    .addField('Character Name', `${pl_ign}`)
                    .addField('Faction', `${pl_faction}`)
                    .addField('Play Style', `${pl_focus}`)
                    .addField('Friends', `${pl_friends}`)
                    msg.reply(`You are all done. Thanks!`)
                    msg.member.setNickname(`${pl_psn} ()`)
                    let role = msg.guild.roles.find(r => r.name === "Cascader");
                    msg.member.addRole(role).catch(console.error)
                    return this.client.channels.get((config.get('faction_sign_in'))).send(embed)
        //this.client.channels.get((config.get('faction_sign_in'))).send(`---------------\nPSN ID: ${pl_psn}\nDiscord: ${msg.author.username}\nFaction: ${pl_faction}\nFocus: ${pl_focus}\nFriends: ${pl_friends}\n---------------`)
    }
}
