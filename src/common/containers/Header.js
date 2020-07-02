import { connect } from 'react-redux'
import Header from '../components/Header'
import commonHandlers from '../handlers/common'

const mapDispatchToProps = (dispatch, props) => ({
  ...commonHandlers(dispatch, props)
})

const mapStateToProps = (state, props) => {
  // TODO: Only map something usefull
  return {
    theme: state.common.theme
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header)
