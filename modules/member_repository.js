// member_repository.js

class MemberRepository {
  constructor(AppDAO) {
    this.dao = AppDAO
  }

  createTable() {
    const sql = `
      CREATE TABLE IF NOT EXISTS members (
      guild_id TEXT,
      pl_psn TEXT,
      pl_discord TEXT PRIMARY KEY,
      pl_ign TEXT,
      pl_clan TEXT,
      pl_clanldr TEXT)`
    return this.dao.run(sql)
  }
  create(guild_id, pl_psn, pl_discord, pl_ign, pl_clan, pl_clanldr) {
    return this.dao.run(
      'REPLACE INTO members (guild_id, pl_psn, pl_discord, pl_ign, pl_clan, pl_clanldr) VALUES (?, ?, ?, ?, ?, ?)',
      [guild_id, pl_psn, pl_discord, pl_ign, pl_clan, pl_clanldr])
  }
  delete(guild_id, pl_discord) {
    return this.dao.run(
      `DELETE FROM members WHERE guild_id = '${guild_id}' AND pl_discord = '${pl_discord}'`,
    )
  }
  getById(guild_id, pl_discord) {
    return this.dao.all(
      `SELECT * FROM members WHERE guild_id like '${guild_id}' AND pl_discord like '${pl_discord}' LIMIT 1`,
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
