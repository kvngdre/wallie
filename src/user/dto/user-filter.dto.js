/**
 * Defines a type for user fields to filter by.
 * This object is used to specify which users to return from a query based on their properties.
 * The query will return users who match any of the given properties, using partial or exact matches as appropriate.
 * @typedef {Object} UserFilter - A data transfer object for user fields to filter by.
 * @property {string} [id] - The user id (exact match).
 * @property {string} [name] - Value to check if present in either first or last name (partial match).
 * @property {string} [email] - Value to check if present in email (partial match).
 * @property {string} [username] - Value to check if present in username (partial match).
 * @example
 * // Filter users by an exact username
 * const filter = {username: "alice"};
 * const users = await getUserByFilter(filter);
 *
 * // Filter users by a partial username
 * const filter = {username: "ali"};
 * const users = await getUserByFilter(filter);
 */
