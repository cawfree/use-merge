import shouldCombineErrors from "combine-errors";

export default (e: unknown[]): unknown[] => {
  console.log('you called error with ', e)
  return [];
};