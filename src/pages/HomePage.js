import React, { useCallback, useMemo } from 'react'
import Page from '../common/hocs/Page'
import Header from '../common/containers/Header'
import SearchForm from '../modules/demo/containers/SearchForm'

function HomePage () {
  const handlePress = useCallback((value) => {
    alert('press', value)
  }, [])
  const footer = useMemo(() => {
    return <p>Footer</p>
  }, [])
  return (
    <Page>
      <Header />
      <SearchForm onPress={handlePress} />
      {footer}
    </Page>
  )
}

export default HomePage
