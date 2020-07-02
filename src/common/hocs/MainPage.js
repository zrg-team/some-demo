import React, { memo } from 'react'
import { connect } from 'react-redux'
import { ThemeProvider } from 'styled-components'
import GlobalStyles from '../../styles/globalStyle'
import { lightTheme, darkTheme } from '../../styles/themes'
import HomePage from '../../pages/HomePage'

// Do something before app loaded and setting routes but link to test page here
const MainPage = memo(({ theme }) => {
  return (
    <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
      <>
        <GlobalStyles />
        <HomePage />
      </>
    </ThemeProvider>
  )
})

export default connect(
  (state) => {
    return {
      theme: state.common.theme
    }
  }
)(MainPage)
