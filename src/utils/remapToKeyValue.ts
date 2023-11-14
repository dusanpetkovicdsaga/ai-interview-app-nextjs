export function remapToKeyLabel<T extends string | number>(
  obj: Record<T, any>
) {
  return Object.entries(obj).map(([key, value]) => ({
    key,
    label: value,
  }));
}
