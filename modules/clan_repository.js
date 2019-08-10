// clan_repository.js

class ClanRepository {
  constructor(AppDAO) {
    this.dao = AppDAO
  }

  createTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS clans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      guild_id TEXT,
      name TEXT,
      leaderpsn TEXT,
      leaderdiscord TEXT,
      status TEXT)`
    return this.dao.run(sql)
  }
  create(guild_id, name, leaderpsn, leaderdiscord, status) {
    return this.dao.run(
      `INSERT INTO clans (guild_id, name, leaderpsn, leaderdiscord, status) VALUES (?, ?, ?, ?, ?)`,
      [guild_id, name, leaderpsn, leaderdiscord, status])
  }
  delete(guild_id,id) {
    return this.dao.run(
      `DELETE FROM clans WHERE guild_id = ${guild_id} AND id = ${id}`,
    )
  }
  getAll(guild_id) {
    return this.dao.all(
      `SELECT * FROM clans WHERE guild_id = ${guild_id}`,
    )
  }
}

module.exports = ClanRepository;
