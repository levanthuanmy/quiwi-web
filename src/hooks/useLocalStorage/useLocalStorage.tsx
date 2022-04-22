import React from 'react'

export const useLocalStorage = (
  key: string,
  defaultValue: string
): [string, (value: Function | string) => void] => {
  const [storedLSValue, setStoredLSValue] = React.useState(() => {
    try {
      const item =
        typeof window !== 'undefined' && window.localStorage.getItem(key)
      return item ? item : defaultValue
    } catch (error) {
      return defaultValue
    }
  })

  const setLSValue = (value: Function | string) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedLSValue) : value

      setStoredLSValue(valueToStore)

      window.localStorage.setItem(key, valueToStore)
    } catch (error) {
      console.log(error)
    }
  }

  return [storedLSValue, setLSValue]
}
