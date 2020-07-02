import { handleActions } from 'redux-actions'
import * as actions from '../actions/common'

export const defaultState = {
  theme: 'light'
}

const handlers = {
  [actions.setTheme]: (state, action) => {
    return {
      ...state,
      theme: action.payload
    }
  }
}

export default handleActions(handlers, defaultState)
