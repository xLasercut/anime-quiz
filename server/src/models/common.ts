function isValidJson(val: string): boolean {
  try {
    JSON.parse(val);
    return true;
  } catch {
    return false;
  }
}

export { isValidJson };
