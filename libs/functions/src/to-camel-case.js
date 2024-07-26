function toCamelCase(string, delimiter = " ") {
  return string
    .split(delimiter)
    .map((word, index) =>
      index === 0 ? word : `${word[0].toUpperCase()}${word.slice(1)}`
    )
    .join("")
}

export default toCamelCase
