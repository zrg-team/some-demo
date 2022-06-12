import React from 'react'
import Page from '../common/hocs/Page'
import Header from '../common/containers/Header'
import SearchForm from '../modules/demo/containers/SearchForm'

function HomePage () {
  const getData = (input) => {
    return input?.length
  }
  return (
    <Page>
      <Header />
      <SearchForm />
      {getData('hung')}
    </Page>
  )
}

export default HomePage
