const { Command } = require('discord.js-commando')
const { RichEmbed } = require('discord.js');
const config = require('../../config/config.js')
const db_conn = require('../../modules/db_conn.js')
var commandchannel = '<#' + (config.get('bot_commands_id')) + '>'
var timeout = (config.get('arg_timeout'))
module.exports = class MemberCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'member',
            group: 'members',
            memberName: 'member',
            description: 'Allows a user to be added as a new member of Cascade Exiles',
            examples: ['member'],
            guildOnly: true,
            //aliases: ['peacemakersmark'],
            args: [
                {
                    key: 'pl_psn',
                    prompt: 'Welcome to Cascade Exiles. Lets get you setup as a new member. What is your PSN ID?',
                    type: 'string',
                    wait: timeout,
                },
                {
                    key: 'pl_ign',
                    prompt: 'What is your Conan Exiles In-Game Name?',
                    type: 'string',
                    wait: timeout,
                },
                {
                    key: 'pl_clan',
                    prompt: 'All members are required to be in a clan, even solo players. What is your clan name? (14 character max)',
                    type: 'string',
                    wait: timeout,
                    validate: text => {
                        if (text.length < 14) return true
                        return 'Clan name cannot be longer than 14 characters. Please shorten and/or abbreviate the name'
                    },
                },
                {
                    key: 'pl_clanldr',
                    prompt: `Who is the leader of the clan?`,
                    type: 'string',
                    wait: timeout,
                }
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

    run(msg, { pl_psn, pl_ign, pl_clan, pl_clanldr }) {
        const MemberRepository = require('../../modules/member_repository')
        const MemberRepo = new MemberRepository(db_conn)
        MemberRepo.createTable()
            .then(() => MemberRepo.create(msg.guild.id, pl_psn, msg.author.username, pl_ign, pl_clan, pl_clanldr))
            .then((data) => {
                const embed = new RichEmbed()
                    .setTitle(`A new cascader has joined!`)
                    .addField('PSN ID', `${pl_psn}`, true)
                    .addField('Discord', `${msg.author.username}`, true)
                    .addField('Conan IGN', `${pl_ign}`, true)
                    .addField('Clan', `${pl_clan}`)
                    .addField('Clan Leader', `${pl_clanldr}`, true)
                msg.member.setNickname(`${pl_psn} ()`)
                let role = msg.guild.roles.find(r => r.name === "Cascader");
                msg.member.addRole(role).catch(console.error)
                msg.reply(`You are all done. Thanks!`)
                return this.client.channels.get((config.get('stop_and_identify_id'))).send(embed)
           })
    }
}
