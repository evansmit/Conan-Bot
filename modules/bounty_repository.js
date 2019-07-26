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
      Spoils TEXT,
      Reason TEXT)`
    return this.dao.run(sql)
  }
  create(OfferedBy, Target, Spoils, Reason) {
    return this.dao.run(
      'INSERT INTO bounties (OfferedBy, Target, Spoils, Reason) VALUES (?, ?, ?, ?)',
      [OfferedBy, Target, Spoils, Reason])
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
