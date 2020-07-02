import { setTheme } from '../actions/common'

export default (dispatch, props) => ({
  setTheme: (theme) => {
    dispatch(setTheme(theme))
  }
})
