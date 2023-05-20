import { UniqueViolationError } from 'objection';

/**
 * Extracts and returns the duplicate field.
 * @param {UniqueViolationError} error Unique violation error object
 * @returns {string}
 */
export default function getDuplicateField(error) {
  const regex = /(?<=_)\w+(?=_)/;
  error;

  const field = error.constraint.match(regex)[0];

  return field.charAt(0).toUpperCase().concat(field.slice(1)).replace('_', ' ');
}
