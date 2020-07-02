import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

class AutoComplete extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      isShow: false,
      loading: false,
      filtedItems: [],
      highlightedIndex: null
    }

    this.cachedValue = ''
    this.instanceRefs = {}
    this.cachedResults = []
    this.timeoutTyping = null
    this.fetchInstance = null
    this.setRef = this.setRef.bind(this)
    this.renderInput = this.renderInput.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleKeyDown = this.handleKeyDown.bind(this)
    this.handleInputBlur = this.handleInputBlur.bind(this)
    this.handleInputFocus = this.handleInputFocus.bind(this)
    this.getFilteredItems = this.getFilteredItems.bind(this)
    this.selectItemFromMouse = this.selectItemFromMouse.bind(this)
    this.highlightItemFromMouse = this.highlightItemFromMouse.bind(this)
  }

  componentWillUnmount () {
    clearTimeout(this.timeoutTyping)
  }

  setRef (key, ref) {
    this.instanceRefs[key] = ref
  }

  selectItemFromMouse (item) {
    const { getItemValue, onSelect } = this.props
    const value = getItemValue(item)
    this.setState({
      isShow: false,
      highlightedIndex: null
    }, () => {
      onSelect(value, item)
    })
  }

  filterItems (inputValue) {
    let { value, items = [], onfilterItem, sortItems, limit } = this.props

    if (onfilterItem) {
      items = items.filter((item) => (
        onfilterItem(item, inputValue || value || '')
      ))
    }

    if (sortItems) {
      items.sort((a, b) => (
        sortItems(a, b, inputValue || value)
      ))
    }

    if (limit) {
      items = items.slice(0, limit)
    }

    return items
  }

  getFilteredItems (value) {
    const filtedItems = this.filterItems(value)
    this.cachedResults = filtedItems
    this.setState({
      filtedItems
    })
  }

  highlightItemFromMouse (index) {
    this.setState({ highlightedIndex: index })
  }

  async processAsync (value) {
    const { getAsyncItems, onInputStopped, getAsyncItemsError } = this.props
    try {
      if (getAsyncItems) {
        this.setState({
          loading: true
        })
        this.cachedValue = value
        const items = await getAsyncItems(value)
        this.cachedValue = ''
        if (items && Array.isArray(items) && !this.canceledRequest) {
          this.cachedResults = items
          this.setState({
            loading: false,
            filtedItems: items
          })
        } else if (this.latestProcessValue && this.canceledRequest) {
          const nextValue = this.latestProcessValue
          this.canceledRequest = false
          this.latestProcessValue = ''
          return this.processAsync(nextValue)
        }
      } else {
        onInputStopped && onInputStopped(value)
        this.getFilteredItems(value)
      }
    } catch (err) {
      this.cachedValue = ''
      getAsyncItemsError && getAsyncItemsError(err)
      this.setState({
        loading: false
      })
    }
  }

  handleChange (event) {
    const {
      onChange,
      forceAsync,
      timeoutTyping = 800,
      onInputStopped,
      getAsyncItems
    } = this.props
    const { loading } = this.state

    const value = event.target.value
    if (getAsyncItems || forceAsync) {
      if (!loading && value && value !== this.cachedValue) {
        if (this.timeoutTyping) {
          clearTimeout(this.timeoutTyping)
        }
        this.timeoutTyping = setTimeout(async () => {
          this.processAsync(value)
        }, timeoutTyping)
      }
      if (loading) {
        this.canceledRequest = true
        this.latestProcessValue = value
      }
      if (!value) {
        this.setState({
          loading: false,
          filtedItems: []
        })
      }
    } else {
      onInputStopped && onInputStopped(value)
      this.getFilteredItems(value)
    }
    onChange && onChange(event, value)
  }

  handleInputBlur (event) {
    const { selectOnBlur, onSelect, getItemValue } = this.props
    const { highlightedIndex, filtedItems } = this.state
    let value = null
    let item = null
    if (this.timeoutTyping) {
      clearTimeout(this.timeoutTyping)
    }
    if (selectOnBlur && highlightedIndex !== null) {
      item = filtedItems[highlightedIndex]
      value = getItemValue(item)
    }
    this.setState({
      isShow: true,
      filtedItems: [],
      highlightedIndex: null
    }, () => {
      if (value && item) {
        onSelect(value, item)
      }
    })
  }

  handleInputFocus (event) {
    const { value } = this.props
    let filtedItems = []
    if (value && this.cachedResults) {
      filtedItems = this.cachedResults
    }
    this.setState({ isShow: true, filtedItems })
  }

  handleKeyDown (event) {
    // TODO: another solution
  }

  renderInput () {
    const { value, inputProps, inputWrapperProps, inputIcon } = this.props
    const { isShow } = this.state

    return (
      <div {...inputWrapperProps}>
        {inputIcon || null}
        <input
          {...{
            ...inputProps,
            role: 'combobox',
            'aria-autocomplete': 'list',
            'aria-expanded': isShow,
            autoComplete: 'off',
            ref: (ref) => this.setRef('input', ref),
            onFocus: this.handleInputFocus,
            onBlur: this.handleInputBlur,
            onChange: this.handleChange,
            onKeyDown: this.handleKeyDown,
            value: value || ''
          }}
        />
      </div>
    )
  }

  renderMenu () {
    const { filtedItems, loading } = this.state
    const { renderItem, menuWrapperProps, loadingComponent } = this.props

    if (loading) {
      return loadingComponent || (
        <p>Loading</p>
      )
    }
    const items = filtedItems.map((item, index) => {
      const element = renderItem(
        item,
        this.state.highlightedIndex === index,
        { cursor: 'default' }
      )
      return React.cloneElement(element, {
        onMouseEnter: () => this.highlightItemFromMouse(index),
        onClick: () => this.selectItemFromMouse(item),
        ref: (ref) => this.setRef(`item-${index}`, ref)
      })
    })
    const style = {
      left: this.state.menuLeft,
      top: this.state.menuTop,
      minWidth: this.state.menuWidth
    }

    if (!items || !items.length) {
      return null
    }
    return (
      <div
        {...menuWrapperProps}
        style={{ ...style }}
        children={items}
      />
    )
  }

  render () {
    const { wrapperStyle, wrapperProps } = this.props
    const { isShow } = this.state

    return (
      <div style={{ ...wrapperStyle }} {...wrapperProps}>
        {this.renderInput()}
        {isShow && this.renderMenu()}
      </div>
    )
  }
}

AutoComplete.propTypes = {
  getAsyncItems: PropTypes.func,
  getAsyncItemsError: PropTypes.func,
  loadingComponent: PropTypes.element,
  inputIcon: PropTypes.element,
  selectOnBlur: PropTypes.bool,
  getItemValue: PropTypes.func.isRequired,
  renderItem: PropTypes.func.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onSelect: PropTypes.func,
  menuWrapperProps: PropTypes.object,
  wrapperProps: PropTypes.object,
  inputProps: PropTypes.object,
  inputWrapperProps: PropTypes.object,
  wrapperStyle: PropTypes.object,
  timeoutTyping: PropTypes.number,
  forceAsync: PropTypes.bool,
  onfilterItem: PropTypes.func,
  sortItems: PropTypes.func,
  limit: PropTypes.number
}

AutoComplete.defaultProps = {
  selectOnBlur: true,
  value: '',
  timeoutTyping: 800,
  forceAsync: false
}

export default AutoComplete
