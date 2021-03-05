import * as Knex from 'knex';

import { UserAuthType } from '../src/auth/auth.types';
const authTypes: UserAuthType[] = ['google'];

export async function up(knex: Knex): Promise<any> {
  await knex.schema.createTable('user', function(table) {
    table.uuid('user_id').primary();
    table.enu('authentication_type', authTypes).notNullable();
    table.string('authentication_id').notNullable();
    table.unique(['authentication_type', 'user_id']);
    table.timestamps(false, true);
  });

  return knex.schema.createTable('user_team', function(table) {
    table.uuid('user_team_id');
    table.uuid('user_id').notNullable();
    table.foreign('user_id').references('user.user_id');
    table.string('competition_name').notNullable();
    table.string('season_name').notNullable();
    table.string('team_name').notNullable();
    table.unique(['user_id', 'competition_name', 'season_name', 'team_name']);
    table.timestamps(false, true);
  });
}

export async function down(knex: Knex): Promise<any> {
  await knex.schema.dropTable('user_team');
  return knex.schema.dropTable('user');
}
