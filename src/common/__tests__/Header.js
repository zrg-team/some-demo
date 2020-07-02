import React from 'react'
import Header from '../components/Header'
import 'enzyme-adapter-react-16'
import { shallow } from 'enzyme'
import { shallowToJson } from 'enzyme-to-json'

describe('[Component] Header', () => {
  it('[Case] Render with light theme props', () => {
    const wrapper = shallow(
      <Header
        theme='light'
      />
    )

    expect(shallowToJson(wrapper)).toMatchSnapshot()
  })

  it('[Case] Render with dark theme props', () => {
    const wrapper = shallow(
      <Header
        theme='dark'
      />
    )

    expect(shallowToJson(wrapper)).toMatchSnapshot()
  })
})