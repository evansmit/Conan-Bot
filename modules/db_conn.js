// db_conn.js

const config = require('../config/config.js')
const AppDAO = require('./dao')
const db_conn = new AppDAO('./database/' + (config.get('env')) + '.sqlite3')


module.exports = db_conn