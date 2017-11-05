import bindUtils from '../src/'

const store = {
  state: undefined,
  dispatch(action) {
    this.state = this.reducer(this.state, action)
    return action
  },
}

const { createAction, createActions, createReducer } = bindUtils(store)

const testAction = createAction('boom')
const dirtyAction = createAction('bad boy')

const actions = createActions([
  'add',
  'toggle',
  'withoutHandler',
])

const initialState = {
  boolean: true,
  array: ['initialItem'],
  input: '',
  modifyMe: {
    omg: true,
  },
}

store.reducer = createReducer({
  [testAction]: (state, input) => ({ ...state, input }),

  [dirtyAction]: (state, omg) => {
    state.modifyMe.omg = omg
  },

  [actions.add]: (state, item) => ({
    ...state,
    array: [
      ...state.array,
      item
    ]
  }),

  [actions.toggle]: state => ({
    ...state,
    boolean: !state.boolean,
  }),
}, initialState)

describe('Basic utils', () => {
  test('Initial state form reducer', () => {
    actions.withoutHandler()

    expect(store.state).toEqual(initialState)
  })

  test('Prefixed actions', () => {
    const prefixedActions = createActions(['delete'], 'users')

    expect(prefixedActions.delete().type).toEqual('users/delete')
  })

  test('Actions are binded to store', () => {
    const userInput = 'user input'

    testAction(userInput)
    actions.toggle()
    actions.add(userInput)

    expect(store.state.input).toEqual(userInput)
    expect(store.state.boolean).toEqual(false)
    expect(store.state.array).toEqual(['initialItem', userInput])
  })

  test('Not pure reducer works', () => {
    const omg = 'I wanna be a string'
    dirtyAction(omg)

    expect(store.state.modifyMe.omg).toEqual(omg)
  })
})
