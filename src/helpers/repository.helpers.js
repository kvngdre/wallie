import objection from 'objection';

/**
 * A helper function that extracts the name of the duplicate field from a UniqueViolationError object
 * @param {objection.UniqueViolationError} error Unique violation error object
 * @returns {string}
 */
export function getDuplicateField(error) {
  const regex = /(?<=_)\w+(?=_)/;
  // error;

  const field = error.constraint.match(regex)[0];
  return field.charAt(0).toUpperCase().concat(field.slice(1)).replace('_', ' ');
}
