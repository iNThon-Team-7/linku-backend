const productArray = <T>(array: T[][]): T[] =>
  array.reduce((acc, cur) => {
    return acc.length
      ? acc.map((a) => cur.map((c) => ({ ...a, ...c }))).flat()
      : cur;
  }, []);

export { productArray };
