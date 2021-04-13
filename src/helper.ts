export const excludeTopKey = (key: string): string => {
  return key.replace(/^.*?\./, "");
};