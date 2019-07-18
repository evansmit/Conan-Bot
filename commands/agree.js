// agree.js

module.exports = {
  name: 'agree',
  description: 'Agree to terms of server and promote role',
  guildOnly: true,
  cooldown: 5,
  execute(message) {
    const config = require('../config/config.js')
    let channelid = message.channel.id;
    if (channelid !== (config.get('stop_and_identify_id'))){
      message.delete()
    } else {
      let role = message.guild.roles.find(role => role.name === (config.get('guild_member')))
      let member = message.member
      member.addRole(role).catch(console.error)
    }
  },
}
