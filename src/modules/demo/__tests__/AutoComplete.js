import React from 'react'
import AutoComplete from '../components/AutoComplete'
import 'enzyme-adapter-react-16'
import { mount, shallow } from 'enzyme'
import { shallowToJson } from 'enzyme-to-json'

const MOCK_DATA = [
  { id: 'a1', label: 'Ho Chi Minh' },
  { id: 'a2', label: 'Ha Noi' },
  { id: 'a3', label: 'Da Nang' },
  { id: 'a4', label: 'Hue' },
  { id: 'a5', label: 'Vinh' },
  { id: 'a6', label: 'Thanh Hoa' },
  { id: 'a7', label: 'Nghe An' },
  { id: 'a8', label: 'Can Tho' },
  { id: 'a9', label: 'My Tho' },
  { id: 'a10', label: 'Tay Nguyen' },
  { id: 'a11', label: 'Binh Phuoc' },
  { id: 'a12', label: 'Binh Duong' },
  { id: 'a13', label: 'Son La' },
  { id: 'a14', label: 'Lao Cai' }
]

function wait (timeout = 800) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(true)
    }, timeout)
  })
}

function fakeFetchDataSuccess (input) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(MOCK_DATA.filter(item => item.label.toLowerCase().includes(`${input}`.trim().toLowerCase())))
    }, 200)
  })
}

function fakeFetchDataError (input) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('TIME_OUT'))
    }, 200)
  })
}

describe('[Component] AutoComplete', () => {
  const props = {
    getItemValue: item => item.label,
    renderItem: (item, highlighted) => {
      return (
        <div key={item.id} className='result-item'>{item.label}</div>
      )
    },
    onChange: (event, value) => {
    },
    onfilterItem: (item, value) => {
      return item.label.toLowerCase().indexOf(value.toLowerCase()) > -1
    },
    items: MOCK_DATA,
    menuWrapperProps: {
      className: 'MENU_WRAPPER'
    }
  }

  it('[Case] Render without crashing', () => {
    const wrapper = shallow(
      <AutoComplete
        {...props}
      />
    )

    expect(shallowToJson(wrapper)).toMatchSnapshot()
  })

  it('[Case] Should render input with value', () => {
    const expectedValue = 'Ho Chi Minh'
    const wrapper = mount(
      <AutoComplete
        {...props}
        value={expectedValue}
      />
    )
    expect(wrapper.find('input').prop('value')).toEqual(expectedValue)
  })

  it('[Case] Offline Mode -> Should filter items immediately', () => {
    const searchValue = 'ho'
    const expectedResult = ['Ho Chi Minh', 'Thanh Hoa', 'Can Tho', 'My Tho']
    const wrapper = mount(
      <AutoComplete
        {...props}
        value={searchValue}
      />
    )

    wrapper.find('input').first().simulate('change', { target: { value: searchValue } })
    wrapper.find('input').instance().value = searchValue
    wrapper.setState({ isShow: true })

    expect(wrapper.find('.result-item')).toHaveLength(expectedResult.length)
    wrapper.find('.result-item').forEach((item, index) => {
      expect(item.text()).toEqual(expectedResult[index])
    })
  })

  // Snapshot use renderer
  it('[Case] Should hide menu after unfocus input', () => {
    const searchValue = 'ho'
    const expectedResult = ['Ho Chi Minh', 'Thanh Hoa', 'Can Tho', 'My Tho']
    const wrapper = mount(
      <AutoComplete
        {...props}
        value={searchValue}
      />
    )

    wrapper.find('input').first().simulate('change', { target: { value: searchValue } })
    wrapper.find('input').instance().value = searchValue
    wrapper.setState({ isShow: true })

    // Render valid result
    expect(wrapper.find('.result-item')).toHaveLength(expectedResult.length)

    wrapper.find('input').simulate('blur')

    // Remove after lose focus
    expect(wrapper.find('.result-item')).toHaveLength(0)
  })

  it('[Case] Async Mode -> Should filter items after end editing', async () => {
    let triggerCount = 0
    const EXPECTED_FETCH = 1
    const searchValue = 'Tho'
    const wrapper = mount(
      <AutoComplete
        {...props}
        items={[]}
        getAsyncItems={async (value) => {
          triggerCount += 1
          const items = await fakeFetchDataSuccess(value)
          return items
        }}
      />
    )

    wrapper.find('input').first().simulate('change', { target: { value: searchValue } })
    wrapper.find('input').instance().value = searchValue
    wrapper.setState({ isShow: true })

    await wait()

    // Should trigger once time
    expect(triggerCount).toEqual(EXPECTED_FETCH)
  })

  it('[Case] Async Mode -> Only show data at last time input in advance case write -> stop -> write -> stop', async () => {
    let triggerCount = 0
    const EXPECTED_FETCH = 2
    const EXPECTED_RESULT = ['Ho Chi Minh']
    const step1Value = 'Ho'
    const step2Value = 'Ho Ch'
    const Rendered = []
    const wrapper = mount(
      <AutoComplete
        {...props}
        items={[]}
        renderItem={(item, highlighted) => {
          Rendered.push(item)
          return <div key={item.id}>{item.label}</div>
        }}
        getAsyncItems={async (value) => {
          triggerCount += 1
          const items = await fakeFetchDataSuccess(value)
          return items
        }}
      />
    )

    wrapper.find('input').first().simulate('change', { target: { value: step1Value } })
    wrapper.find('input').instance().value = step1Value
    wrapper.setState({ isShow: true })

    await wait()

    wrapper.find('input').first().simulate('change', { target: { value: step2Value } })
    wrapper.find('input').instance().value = step2Value

    await wait(1200)

    // Should trigger once time
    wrapper.setState({ isShow: true })
    expect(triggerCount).toEqual(EXPECTED_FETCH)
    expect(EXPECTED_RESULT.length).toEqual(Rendered.length)
    expect(Rendered.every(item => EXPECTED_RESULT.includes(item.label))).toEqual(true)
  })

  it('[Case] Async Mode -> Should not crash if async fetch error', async () => {
    let triggerCount = 0
    const searchValue = 'Tho'
    const wrapper = mount(
      <AutoComplete
        {...props}
        items={[]}
        getAsyncItems={async (value) => {
          triggerCount += 1
          const items = await fakeFetchDataError(value)
          return items
        }}
      />
    )

    wrapper.find('input').first().simulate('change', { target: { value: searchValue } })
    wrapper.find('input').instance().value = searchValue
    wrapper.setState({ isShow: true })

    await wait()

    // Should trigger once time
    expect(triggerCount).toEqual(1)
    expect(shallowToJson(wrapper)).toMatchSnapshot()
  })
})
