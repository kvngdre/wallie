import { operatorMap } from '../../utils/common.utils';

/**
 * Defines a type for account fields to filter by.
 * This object is used to specify which accounts to return from a query based on their properties.
 * The query will return accounts who match any of the given properties, using partial or exact matches as appropriate.
 * @typedef {Object} AccountFilter - A data transfer object for account fields to filter by.
 * @property {keyof operatorMap} [operator] - The logical operator to apply.
 * @property {number} [value] - Value the logical operator would be applied to check if balance in range (partial match).
 */
