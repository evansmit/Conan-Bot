// rp_repository.js

class rpRepository {
  constructor(AppDAO) {
    this.dao = AppDAO
  }

  createTable() {
    const sql = `CREATE TABLE IF NOT EXISTS raidprotection (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      guild_id TEXT,
      ProtectionType TEXT,
      Clan TEXT,
      StartDate Text,
      EndDate Text,
      CreatedBy TEXT)`
    return this.dao.run(sql)
  }
  create(guild_id, ProtectionType, Clan, StartDate, EndDate, CreatedBy) {
    return this.dao.run(
      `INSERT INTO raidprotection (guild_id, ProtectionType, Clan, StartDate, EndDate, CreatedBy)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [guild_id, ProtectionType, Clan, StartDate, EndDate, CreatedBy]
    )
  }

  delete(guild_id, id) {
    return this.dao.run(
      `DELETE FROM raidprotection WHERE guild_id = ${guild_id} AND id = ${id}`,
    )
  }
  getById(guild_id, id) {
    return this.dao.get(
      `SELECT * FROM raidprotection WHERE guild_id = ${guild_id} AND id = ${id}`,
    )
  }
  getAll(guild_id) {
    return this.dao.all(
      `SELECT * FROM raidprotection WHERE guild_id = ${guild_id}`,
    )
  }
}

module.exports = rpRepository;
