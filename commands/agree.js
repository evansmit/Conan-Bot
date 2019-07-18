// agree.js
module.exports = {
  name: 'agree',
  description: 'Agree to terms of server and promote to Cascader',
  execute(message) {
    const config = require('../config/config.js')
    let channelname = message.channel.name;
    if (channelname !== 'stop_and_identify'){
      message.delete()
    } else {
      let role = message.guild.roles.find(role => role.name === (config.get('guild_member')))
      let member = message.member
      member.addRole(role).catch(console.error)
    }
  },
}
