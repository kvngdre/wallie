import knex from 'knex';

export function uuidToBin(uuid) {
  const uuidWithoutDashes = uuid.replace(/-/g, '');

  return knex.fn.uuidToBin(uuid);
}

export function binToUuid(binUuid) {
  return knex.fn.binToUuid(uuid);
}
