import { useCallback, useState, useEffect } from "react";
import isEqual from "react-fast-compare";
import debounce from "lodash.debounce";
import get from "lodash.get";

export type useMergeWithTransformOptions = {
  [key: string]: (e: unknown[]) => unknown;
};

export type transformOptions = {
  [key: string]: unknown;
};

export type transformResult = {
  [key: string]: unknown;
};

export type useMergeOptions = { [key: string]: unknown } | Function;

export type useMergeIntermediateResult = (transform: useMergeWithTransformOptions | undefined) => useMergeResult;

export type useMergeResult = {
  [key: string]: unknown;
  merged: {
    [key: string]: unknown;
  };
};

const reservedKeys = Object.freeze(["merged"]) as string[];

const shouldThrowOnReservedKeys = (options: object) => {
  reservedKeys.forEach((k) => {
    if (options.hasOwnProperty(k)) {
      throw new Error(`"${k}" is a reserved attribute."`);
    }
  });
  Object.keys(options).forEach((k) => {
    // @ts-ignore
    if (!isNaN(k)) {
      throw new Error(`"${k}" is a reserved attribute.`);
    }
  });
};

const extractNumerics = (key: string, merged: transformOptions): transformResult => {
  // @ts-ignore
  const n = Object.entries(merged).filter(([e]) => !isNaN(e)) as string[];
  return n.reduce((obj, i) => {
    const v = merged[Number.parseInt(i)];
    const g = Object.entries(v).reduce((obj, [k, v]) => {
      if (v && typeof v === "object" && v.hasOwnProperty(key)) {
        return { ...obj, [k]: v[key] };
      }
      return obj;
    }, {});
    return { ...obj, ...g };
  }, {});
};

const shouldTransform = (options: useMergeWithTransformOptions, merged: transformOptions): transformResult => {
  return Object.entries(options)
    .reduce((obj, [k, transform]) => {
      obj[k] = transform(Object.values({
        ...extractNumerics(k, merged),
        ...(merged[k] as object || {}),
      }));
      return obj;
    }, {});
};

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
  }, {});
  return { ...options, merged: shouldTransform(transform, merged) };
};

function useMergeWithTransform(
  options: useMergeOptions,
  transform: useMergeWithTransformOptions
): useMergeResult {
   if (transform !== undefined && typeof transform !== "object") {
    throw new Error(`Expected object or undefined transform, encountered ${typeof transform}.`);
  }

  const createInitialState = useCallback(() => ([{
    merged: {},
  }]), []);

  const [cache] = useState(createInitialState);
  const [buf] = cache;

  const opts = typeof options === 'function' ? options(Object.freeze(buf), get) : options;

  if (!opts || typeof opts !== 'object') {
    throw new Error(`Expected object options, encountered ${typeof opts}.`);
  }
  
  !!opts && shouldThrowOnReservedKeys(opts);

  const [merged, setMerged] = useState(() => shouldMerge(opts, transform));
  const [debouncedSetMerged] = useState(() => debounce(
    (e: useMergeResult) => requestAnimationFrame(() => setMerged(e)),
    0,
  ));

  useEffect(() => {
    const next = shouldMerge(opts, transform);
    if (!isEqual(merged, next)) {
      cache[0] = next;
      debouncedSetMerged(next);
    }
  }, [opts, debouncedSetMerged, merged, shouldMerge, transform]);

  return merged;
}

export default function useMerge(options: useMergeOptions): useMergeIntermediateResult {
  return (transform) => useMergeWithTransform(options, transform);
}
