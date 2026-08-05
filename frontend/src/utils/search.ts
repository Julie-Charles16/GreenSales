export const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");


export const matchStartSearch = (
  search: string,
  value: string
) => {
  const query = normalizeText(search);

  if (!query) return true;

  return normalizeText(value).startsWith(query);
};