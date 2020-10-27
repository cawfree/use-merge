export default (e: unknown[]): boolean => {
  if (e.length === 0) {
    return false;
  } else if (e.length === 1) {
    return !!e[0];
  }
  return !!e.reduce((res, i) => res || !!i, false);
};