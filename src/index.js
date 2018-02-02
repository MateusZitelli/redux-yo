const dispatcher = {
  dispatch: value => value,
}

export const bindDispatcher = store => {
  dispatcher.dispatch = store.dispatch.bind(store)
}

export const createAction = type => {
  const action = payload => dispatcher.dispatch({ type, payload })
  action.toString = () => type
  action.isReduxAction = true

  return action
}

export const createActions = (labels, prefix) =>
  labels.reduce((acc, label) => ({
    ...acc,
    [label]: createAction(prefix ? `${prefix}/${label}` : label),
  }), {})

export const bindActionCreators = actions =>
  Object.entries(actions).reduce((acc, [key, value]) => {
    const type = value.isReduxAction ? String(value) : value().type

    acc[key] = createAction(type)

    return acc
  }, {})

export const createReducer = (handlers = {}, defaultState) =>
  (state = defaultState, { type, payload }) => {
    if (type && handlers[type]) {
      const newState = handlers[type](state, payload)
      return newState || state
    }

    return state
  }

