export const addMetaData = (action, type) => {
  action.type = type
  action.toString = () => type
  action.isReduxAction = true

  return action
}

export const createAction = type => {
  const action = (payload, meta) => ({ type, payload, meta })

  return addMetaData(action, type)
}

export const createActions = (labels, prefix) => (
  labels.reduce((acc, label) => ({
    ...acc,
    [label]: createAction(prefix ? `${prefix}/${label}` : label),
  }), {})
)

export const promisifyAction = (action, payload) => (
  new Promise((resolve, reject) => action(payload, { resolve, reject }))
)

export const createReducer = (handlers = {}, defaultState) =>
  (state = defaultState, { type, payload, meta }) => {
    if (type && handlers[type]) {
      const newState = handlers[type](state, payload, meta)
      return newState || state
    }

    return state
  }


export const bindActionCreator = (action, dispatch) => {
  const boundAction = (...args) => dispatch(action(...args))

  return addMetaData(boundAction, action().type)
}

export const bindActionCreators = (actions, dispatch) => {
  if (typeof actions === 'function') {
    return bindActionCreator(actions, dispatch)
  }

  return Object.entries(actions).reduce((acc, [label, action]) => {
    acc[label] = bindActionCreator(action, dispatch)

    return acc
  }, {})
}
