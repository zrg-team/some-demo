import React, { memo } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/lib/integration/react'
import MainPage from './MainPage'

// Do something before app loaded and setting routes but link to test page here
export default memo(({ store, persistor }) => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <MainPage />
      </PersistGate>
    </Provider>
  )
})
