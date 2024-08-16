import React from "react";


export function useDebounceValue<T>(
  init: T, delay: number
): [T, T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = React.useState(init);
  const [debounceValue, setDebounceValue] = React.useState(init);

  React.useEffect(() => {
    const timeout = setTimeout(() => setDebounceValue(value), delay);
    return () => clearTimeout(timeout);
  }, [delay, value]);

  return [value, debounceValue, setValue];
}