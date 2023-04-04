export function parseToString(param: string | string[] | undefined) {
  return !Array.isArray(param) ? param : undefined;
}

export function parseToNumber(param: string | string[] | undefined) {
  return (!Array.isArray(param) && Number(param)) || undefined;
}
