import { persistStore, persistCombineReducers } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { createStore, applyMiddleware, compose } from 'redux'
import commonReducers from './reducers/common'

const config = {
  key: 'root',
  storage
}
const createMiddlewares = sagaMiddleware => {
  const middlewares = []

  return applyMiddleware.apply({}, middlewares)
}

const createReducers = reducers => {
  // Add module redux store
  return persistCombineReducers(config, {
    common: commonReducers,
    ...reducers
  })
}
const composeEnhancers = process.env.NODE_ENV !== 'production'
  ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
  : compose
const buildStore = (reducers, initialState) => {
  const store = createStore(createReducers(reducers), initialState, composeEnhancers(createMiddlewares()))

  const persistor = persistStore(store)

  store.reducers = createReducers(reducers)
  return { persistor, store }
}

export default buildStore()
