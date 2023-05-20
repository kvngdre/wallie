export default function isDevEnvironment() {
  if (process.env.NODE_ENV === 'development') return true;

  return false;
}
