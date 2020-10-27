
import { useState } from "react";
import useDeepCompareEffect from "use-deep-compare-effect";
import shouldCombineErrors from "combine-errors";
import isEqual from "react-fast-compare";
import debounce from "lodash.debounce";

export type useMergeWithTransformOptions = {
  [key: string]: unknown[];
};

export type maybeMergeOptions = {
  [key: string]: unknown[];
};

export type maybeMergeResult = {
  [key: string]: unknown;
};

export type useMergeOptions = {
  [key: string]: unknown;
};

export type useMergeIntermediateResult = (transform: useMergeWithTransformOptions | undefined) => useMergeResult;

export type useMergeResult = {
  [key: string]: unknown;
};

// TODO: Implement transform.
const shouldMerge = (options: useMergeOptions, transform: useMergeWithTransformOptions): useMergeResult => {
  const merged = Object.entries(options).reduce((obj, [k, v]) => {
    if (v && typeof v === 'object') {
      return Object.entries(v).reduce((obj, [p, v]) => {
        const o = obj[p] || {};
        o[k] = v;
        obj[p] = o;
        return obj;
      }, obj);
    }
    return obj;
  }, []);
  return { ...options, merged };
};

function useMergeWithTransform(
  options: useMergeOptions,
  transform: useMergeWithTransformOptions
): useMergeResult {
  if (!options || typeof options !== 'object') {
    throw new Error(`Expected object options, encountered ${typeof options}.`);
  } else if (transform !== undefined && typeof transform !== "object") {
    throw new Error(`Expected object or undefined transform, encountered ${typeof transform}.`);
  }
  const [merged, setMerged] = useState(() => shouldMerge(options, transform));
  const [debouncedSetMerged] = useState(() => debounce(
    (e: useMergeResult) => requestAnimationFrame(() => setMerged(e)), 0)
  );

  useDeepCompareEffect(() => {
    const next = shouldMerge(options, transform);
    if (!isEqual(merged, next))
    requestAnimationFrame(() => setMerged(next));
  }, [options, debouncedSetMerged, shouldMerge, transform]);

  return merged;
}

export default function useMerge(options: useMergeOptions): useMergeIntermediateResult {
  const [mergeWithTransform] = useState(
    () => (transform: useMergeWithTransformOptions) => useMergeWithTransform(options, transform),
  );
  return mergeWithTransform;
}