import React from 'react'
import MainPage from '../hocs/MainPage'
import { Provider } from 'react-redux'
import 'enzyme-adapter-react-16'
import { mount } from 'enzyme'
import configureMockStore from 'redux-mock-store'
import { shallowToJson } from 'enzyme-to-json'
import { lightTheme, darkTheme } from '../../styles/themes'
import { setTheme } from '../actions/common'

const middlewares = []
const mockStore = configureMockStore(middlewares)
describe('[Component] Root', () => {
  it('[Case] Render without crashing', () => {
    const initialState = { common: { theme: 'light' } }
    const store = mockStore(initialState)
    const wrapper = mount(
      <Provider store={store}>
        <MainPage />
      </Provider>
    )

    expect(shallowToJson(wrapper)).toMatchSnapshot()
  })

  it('[Case] Should change theme after update redux', () => {
    const initialState = { common: { theme: 'light' } }
    const store = mockStore(initialState)
    const wrapper = mount(
      <Provider store={store}>
        <MainPage />
      </Provider>
    )

    // Light them apply
    expect(wrapper.find('ThemeProvider').props().theme.text).toEqual(lightTheme.text)

    // Simuate redux actoion
    store.dispatch(setTheme('dark'))
    const actions = store.getActions()
    const action = actions.splice(0, 1)[0]
    wrapper.find('ThemeProvider')
    const nextStore = mockStore({ common: { theme: action.payload } })
    wrapper.setProps({
      store: nextStore
    })

    // Dark them apply
    expect(wrapper.find('ThemeProvider').props().theme.text).toEqual(darkTheme.text)
  })
})