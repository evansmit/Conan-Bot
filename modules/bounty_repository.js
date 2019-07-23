// bounty_repository.js

class BountyRepository {
  constructor(AppDAO) {
    this.dao = AppDAO
  }

  createTable() {
    const sql = `CREATE TABLE IF NOT EXISTS bounties (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      OfferedBy TEXT,
      Target TEXT,
      Spoils TEXT)`
    return this.dao.run(sql)
  }
  create(OfferedBy, Target, Spoils) {
    return this.dao.run(
      'INSERT INTO bounties (OfferedBy, Target, Spoils) VALUES (?, ?, ?)',
      [OfferedBy, Target, Spoils])
  }
  delete(id) {
    return this.dao.run(
      `DELETE FROM bounties WHERE id = ${id}`,
    )
  }
  getById(id) {
    return this.dao.get(
      `SELECT * FROM bounties WHERE id = ${id}`,
    )
  }
  getAll() {
    return this.dao.all(
      'SELECT * FROM bounties',
    )
  }
}

module.exports = BountyRepository;
