// clan_repository.js

class ClanRepository {
  constructor(AppDAO) {
    this.dao = AppDAO
  }

  createTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS clans (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      leaderpsn TEXT,
      leaderdiscord TEXT,
      status TEXT)`
    return this.dao.run(sql)
  }
  create(name, leaderpsn, leaderdiscord, status) {
    return this.dao.run(
      'INSERT INTO clans (name, leaderpsn, leaderdiscord, status) VALUES (?, ?, ?, ?)',
      [name, leaderpsn, leaderdiscord, status])
  }
  update(column, value, id) {
    switch (column) {
      case 'status':
        return this.dao.run(
          'UPDATE clans SET status = ? WHERE id = ?',
          [id, column, value]
        )
    }
  }
  delete(id) {
    return this.dao.run(
      `DELETE FROM clans WHERE id = ${id}`,
    )
  }
  getAll() {
    return this.dao.all(
      'SELECT * FROM clans',
    )
  }
}

module.exports = ClanRepository;
