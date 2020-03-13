const keyConverterPattern = /_([a-z0-9])/g;

function replaceKey(patternString, firstMatch) {
  return firstMatch.toUpperCase();
}

export default function convertKeys(data) {
  if (Array.isArray(data)) {
    return data.map(convertKeys);
  }

  if (data instanceof Object) {
    return Object.entries(data)
      .reduce((result, [key, value]) => {
        const convertedKey = key.replace(keyConverterPattern, replaceKey);
        result[convertedKey] = convertKeys(value);
        return result;
      }, {});
  }

  return data;
}
