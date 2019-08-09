// member_repository.js

class MemberRepository {
  constructor(AppDAO) {
    this.dao = AppDAO
  }

  createTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      guild_id TEXT,
      pl_psn TEXT,
      pl_discord TEXT,
      pl_ign TEXT,
      pl_clan TEXT,
      pl_clanldr TEXT)`
    return this.dao.run(sql)
  }
  create(guild_id, pl_psn, pl_discord, pl_ign, pl_clan, pl_clanldr) {
    return this.dao.run(
      'INSERT INTO members (guild_id, pl_psn, pl_discord, pl_ign, pl_clan, pl_clanldr) VALUES (?, ?, ?, ?, ?, ?)',
      [guild_id, pl_psn, pl_discord, pl_ign, pl_clan, pl_clanldr])
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
  delete(guild_id, id) {
    return this.dao.run(
      `DELETE FROM members WHERE guild_id = ${guild_id} AND id = ${id}`,
    )
  }
  getById(guild_id, id) {
    return this.dao.run(
      `SELECT * FROM members WHERE guild_id = ${guild_id} AND id = ${id}`,
    )
  }
  getAll(guild_id) {
    return this.dao.all(
      `SELECT * FROM members WHERE guild_id = ${guild_id}`,
    )
  }
  find(guild_id,term) {
    return this.dao.all(
      `SELECT * FROM members WHERE
      guild_id like '${guild_id}' AND
      pl_psn like '%${term}%' OR
      pl_discord like '%${term}%' OR
      pl_ign like '%${term}%' OR
      pl_clan like '%${term}%' OR
      pl_clanldr like '%${term}%'`,
    )
  }
}

module.exports = MemberRepository;
