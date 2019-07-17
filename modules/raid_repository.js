// rp_repository.js

class rpRepository {
  constructor(AppDAO) {
    this.dao = AppDAO
  }

  createTable() {
    const sql = 'CREATE TABLE IF NOT EXISTS raidprotection (id INTEGER PRIMARY KEY AUTOINCREMENT,ProtectionType TEXT,Clan TEXT,StartDate Text, EndDate Text, CreatedBy TEXT)'
    return this.dao.run(sql)
  }
  create(ProtectionType, Clan, StartDate, EndDate, CreatedBy) {
    return this.dao.run(
      `INSERT INTO raidprotection (ProtectionType, Clan, StartDate, EndDate, CreatedBy)
      VALUES (?, ?, ?, ?, ?)`,
      [ProtectionType, Clan, StartDate, EndDate, CreatedBy]
    )
  }

  delete(id) {
    return this.dao.run(
      `DELETE FROM raidprotection WHERE id = ${id}`,
    )
  }
  getById(id) {
    return this.dao.get(
      `SELECT * FROM raidprotection WHERE id = ${id}`,
    )
  }
  getAll() {
    return this.dao.all(
      'SELECT * FROM raidprotection',
    )
  }
}

module.exports = rpRepository;
