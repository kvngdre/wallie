/**
 *
 * @param {number} count
 * @returns {string}
 */
export default function formatItemCountMessage(count) {
  if (count == 1) return '1 record found';
  return `${count} records found`;
}
