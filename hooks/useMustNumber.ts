import React, { useCallback, useState } from "react";

const useMustNumber = (initialData: string, optional = { limit: 0, length: 7 }): [string, React.Dispatch<React.SetStateAction<string>>, (e: React.ChangeEvent<HTMLInputElement>) => void] => {
  const [value, setValue] = useState<string>(initialData);

  const handler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const mustNumberRegex = /[^0-9]/g;
      const result = e.target.value.replace(mustNumberRegex, "");
      if (result.length <= optional.length) {
        setValue(result);
      }
      if (optional.limit !== 0 && Number(result) > optional.limit) {
        setValue(optional.limit.toString());
      }
    },
    [optional.limit, optional.length]
  );

  return [value, setValue, handler];
};

export default useMustNumber;
