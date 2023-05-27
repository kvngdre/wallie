/**
 * Defines a type for account fields to filter by.
 * This object is used to specify which accounts to return from a query based on their properties.
 * The query will return accounts who match any of the given properties, using partial or exact matches as appropriate.
 * @typedef {Object} AccountFilter - A data transfer object for account fields to filter by.
 * @property {string} [id] - The user id (exact match).
 * @property {string} [user_id] - The unique identifier of the user who owns the account. (exact match).
 * @property {number} [value] - Value to check if in range (partial match).
 * @property {number} [operator] - Value to check if in range (partial match).
 */
