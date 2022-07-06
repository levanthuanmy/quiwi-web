import React from 'react'

const useExtendQueue = (initialValue?: any) => {
  if (initialValue === void 0) {
    initialValue = []
  }

  const _a = React.useState(initialValue),
    state = _a[0],
    set = _a[1]

  return {
    add: function (value: any) {
      set(function (queue: any) {
        return [...queue, value]
      })
    },
    remove: function () {
      var result
      set(function (_a: string | any[]) {
        var first = _a[0],
          rest = _a.slice(1)
        result = first
        return rest
      })
      return result
    },
    get first() {
      return state[0]
    },
    get last() {
      return state[state.length - 1]
    },
    get size() {
      return state.length
    },
    get all() {
      return state
    },
  }
}
export default useExtendQueue
