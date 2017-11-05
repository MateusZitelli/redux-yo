export const createReducer = (handlers = {}, defaultState) => (
  (state = defaultState, { type, payload }) => {
    if (type && handlers[type]) {
      const newState = handlers[type](state, payload)
      return newState || state
    }

    return state
  }
)

export const createBoundAction = store => type => {
  const action = payload => store.dispatch({ type, payload })
  action.toString = () => type

  return action
}

export const createActionsBuilder = create => (labels, prefix) =>
  labels.reduce((acc, label) => ({
    ...acc,
    [label]: create(prefix ? `${prefix}/${label}` : label),
  }), {})

export const createAction = type => {
  const action = payload => ({ type, payload })
  action.toString = () => type

  return action
}

export const createActions = createActionsBuilder(createAction)

export default function(store) {
  const boundCreate = createBoundAction(store)
  const boundCreateMultiple = createActionsBuilder(boundCreate)

  return {
    createAction: boundCreate,
    createActions: boundCreateMultiple,
    createReducer,
  }
}
