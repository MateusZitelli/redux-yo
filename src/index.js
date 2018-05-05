export const createAction = type => {
  const action = payload => ({ type, payload })

  action.type = type
  action.toString = () => type
  action.isReduxAction = true

  return action
}

export const createActions = (labels, prefix) =>
  labels.reduce((acc, label) => ({
    ...acc,
    [label]: createAction(prefix ? `${prefix}/${label}` : label),
  }), {})

export const createReducer = (handlers = {}, defaultState) =>
  (state = defaultState, { type, payload }) => {
    if (type && handlers[type]) {
      const newState = handlers[type](state, payload)
      return newState || state
    }

    return state
  }
