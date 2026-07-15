import { useState } from 'react';

const useLayoutState: typeof useState = <S>(
  ...args: Parameters<typeof useState<S>>
): ReturnType<typeof useState<S>> => {
  return useState<S>(...args);
};

export default useLayoutState;
