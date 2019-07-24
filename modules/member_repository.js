// member_repository.js

class MemberRepository {
  constructor(AppDAO) {
    this.dao = AppDAO
  }

  createTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      pl_psn TEXT,
      pl_discord TEXT,
      pl_ign TEXT,
      pl_clan TEXT,
      pl_clanldr TEXT)`
    return this.dao.run(sql)
  }
  create(pl_psn, pl_discord, pl_ign, pl_clan, pl_clanldr) {
    return this.dao.run(
      'INSERT INTO members (pl_psn, pl_discord, pl_ign, pl_clan, pl_clanldr) VALUES (?, ?, ?, ?, ?)',
      [pl_psn, pl_discord, pl_ign, pl_clan, pl_clanldr])
  }
  // update(column, value, id) {
  // switch (column) {
  //  case 'status':
  // return this.dao.run(
  // 'UPDATE members SET status = ? WHERE id = ?',
  // [id, column, value]
  // )
  // }
  // }
  delete(id) {
    return this.dao.run(
      `DELETE FROM members WHERE id = ${id}`,
    )
  }
  getById(id) {
    return this.dao.run(
      `SELECT * FROM members WHERE id = ${id}`,
    )
  }
  getAll() {
    return this.dao.all(
      'SELECT * FROM members',
    )
  }
  find(term) {
    return this.dao.all(
      `SELECT * FROM members WHERE
      pl_psn like '%${term}%' OR
      pl_discord like '%${term}%' OR
      pl_ign like '%${term}%' OR
      pl_clan like '%${term}%' OR
      pl_clanldr like '%${term}%'`,
    )
  }
}

module.exports = MemberRepository;
