import { connect } from 'react-redux'
import SearchForm from '../components/SearchForm'
import handlers from '../handlers'

const mapDispatchToProps = (dispatch, props) => ({
  ...handlers(dispatch, props)
})

const mapStateToProps = (state, props) => {
  // TODO: Only map something usefull
  return {
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchForm)
