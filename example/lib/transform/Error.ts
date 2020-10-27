import shouldCombineErrors from "combine-errors";

export default (e: unknown[]): unknown[] => {
  const errors =  e.filter(e => e instanceof Error);
  if (errors.length) {
    return errors.length > 1 ? shouldCombineErrors(errors) : errors[0];
  }
  return null;
};