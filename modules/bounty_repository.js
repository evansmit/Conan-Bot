// bounty_repository.js

class BountyRepository {
  constructor(AppDAO) {
    this.dao = AppDAO
  }

  createTable() {
    const sql = `CREATE TABLE IF NOT EXISTS bounties (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      guild_id TEXT,
      name TEXT,
      OfferedBy TEXT,
      Target TEXT,
      Spoils TEXT,
      Reason TEXT)`
    return this.dao.run(sql)
  }
  create(guild_id, OfferedBy, Target, Spoils, Reason) {
    return this.dao.run(
      'INSERT INTO bounties (guild_id, OfferedBy, Target, Spoils, Reason) VALUES (?, ?, ?, ?, ?)',
      [guild_id, OfferedBy, Target, Spoils, Reason])
  }
  delete(guild_id, id) {
    return this.dao.run(
      `DELETE FROM bounties WHERE guild_id = ${guild_id} AND id = ${id}`,
    )
  }
  getById(guild_id, id) {
    return this.dao.get(
      `SELECT * FROM bounties WHERE guild_id = ${guild_id} AND id = ${id}`,
    )
  }
  getAll(guild_id) {
    return this.dao.all(
      `SELECT * FROM bounties WHERE guild_id = ${guild_id}`,
    )
  }
}

module.exports = BountyRepository;
