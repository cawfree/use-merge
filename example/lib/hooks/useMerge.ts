
import { useState } from "react";
import useDeepCompareEffect from "use-deep-compare-effect";
import shouldCombineErrors from "combine-errors";
import isEqual from "react-fast-compare";
import debounce from "lodash.debounce";

export type maybeMergeOptions = {
  [key: string]: unknown[];
};

export type maybeMergeResult = {
  [key: string]: unknown;
};

export type useMergeOptions = {
  [key: string]: unknown;
};

export type useMergeResult = {
  [key: string]: unknown;
};

const shouldMerge = (options: useMergeOptions): useMergeResult => {
  return { ...options };
};

export default function useMerge(options: useMergeOptions): useMergeResult {
  if (!options || typeof options !== 'object') {
    throw new Error(`Expected object options, encountered ${typeof options}.`);
  }
  const [merged, setMerged] = useState(() => shouldMerge(options));
  const [debouncedSetMerged] = useState(() => debounce(
    (e: useMergeResult) => requestAnimationFrame(() => setMerged(e)), 0)
  );

  useDeepCompareEffect(() => {
    const next = shouldMerge(options);
    if (!isEqual(merged, next))
    requestAnimationFrame(() => setMerged(next));
  }, [options, debouncedSetMerged, shouldMerge]);

  return merged;
}