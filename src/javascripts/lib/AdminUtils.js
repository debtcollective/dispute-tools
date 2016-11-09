export function serialize(obj, prefix) {
  const str = [];

  Object.keys(obj).forEach((p) => {
    const k = prefix ? `${prefix}[${p}]` : p;
    const v = obj[p];

    if (v) {
      str.push(typeof v === 'object'
        ? serialize(v, k)
        : `${encodeURIComponent(k)}=${encodeURIComponent(v)}`
      );
    }
  });

  return str.join('&');
}
