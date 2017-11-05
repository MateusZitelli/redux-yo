export const createReducer = (handlers = {}, defaultState) => (
  (state = defaultState, { type, payload }) => {
    if (type && handlers[type]) {
      const newState = handlers[type](state, payload)
      return newState || state
    }

    return state
  }
)

export const createAction = store => type => {
  const action = payload => store.dispatch({ type, payload })
  action.toString = () => type

  return action
}

export const createActions = create => (labels, prefix) =>
  labels.reduce((acc, label) => ({
    ...acc,
    [label]: create(prefix ? `${prefix}/${label}` : label),
  }), {})

export default function(store) {
  const createActionBinded = createAction(store)
  const createActionsBinded = createActions(createActionBinded)

  return {
    createAction: createActionBinded,
    createActions: createActionsBinded,
    createReducer,
  }
}
