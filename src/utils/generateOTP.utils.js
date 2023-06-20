/**
 *
 * @param {number} len
 * @param {number} ttl
 * @returns
 */
export default function generateOTP(len, ttl) {
  if (typeof len !== 'number' || typeof ttl !== 'number') {
    throw new Error('Arguments must be of type "number".');
  }

  return {
    value: '' + Math.floor(Math.random() * 10 ** len),
    expiresIn: Date.now() + ttl * 60 * 1_000,
  };
}
