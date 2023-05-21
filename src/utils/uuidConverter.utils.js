import Knex from 'knex';
import knexfile from '../../knexfile.js';

function getKnexInstance() {
  const config = knexfile[process.env.NODE_ENV];
  const knex = Knex(config);

  return knex;
}

export function uuidToBin(uuid) {
  const knex = getKnexInstance();
  const uuidWithoutDashes = uuid.replace(/-/g, '');

  return knex.fn.uuidToBin(uuid);
}

export function binToUuid(binUuid) {
  const knex = getKnexInstance();
  return knex.fn.binToUuid(binUuid);
}
