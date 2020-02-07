import Knex = require('knex');
import uuidv4 from 'uuid/v4';

import { UserAuthType } from '@vcalendars/models/web';

interface TeamSeasonSummary {
  teamName: string;
  seasonName: string;
}

export default class UserService {
  knex: Knex;
  constructor(knex: Knex) {
    this.knex = knex;
  }

  async ensureUserExists(
    authType: UserAuthType,
    authenticationId: string,
  ): Promise<string> {
    let userId: string | undefined;
    await this.knex.transaction(async tsx => {
      try {
        const existing = await tsx('user')
          .select('user_id')
          .where({
            authentication_id: authenticationId,
            authentication_type: authType,
          })
          .first();
        if (existing) {
          userId = existing.user_id;
        } else {
          userId = uuidv4();
          await tsx('user').insert({
            user_id: userId,
            authentication_type: authType,
            authentication_id: authenticationId,
          });
        }
      } catch (err) {
        tsx.rollback();
        throw new Error('Error creating user');
      }
    });
    if (!userId) {
      throw new Error('Could not ensure user.');
    }
    return userId;
  }

  async getUserTeamSeasons(userId: string): Promise<TeamSeasonSummary[]> {
    const results = await this.knex('user_team')
      .select('season_name', 'team_name')
      .where({
        user_id: userId,
      });
    return results.map(result => ({
      teamName: result.team_name,
      seasonName: result.season_name,
    }));
  }

  async addUserTeamSeason(userId: string, teamSeason: TeamSeasonSummary) {
    const { teamName, seasonName } = teamSeason;
    await this.knex('user_team').insert({
      user_id: userId,
      team_name: teamName,
      season_name: seasonName,
    });
  }

  async deleteUserTeamSeason(userId: string, teamSeason: TeamSeasonSummary) {
    const { teamName, seasonName } = teamSeason;
    await this.knex('user_team')
      .delete()
      .where({
        user_id: userId,
        team_name: teamName,
        season_name: seasonName,
      });
  }
}
