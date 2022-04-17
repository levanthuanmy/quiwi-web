export const JsonParse = (input: string | null) => {
  try {
    if (!input) return {}
    return JSON.parse(input)
  } catch (error) {
    console.log('JsonParse - error', error)
    return {}
  }
}
