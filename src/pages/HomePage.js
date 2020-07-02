import React from 'react'
import Page from '../common/hocs/Page'
import Header from '../common/containers/Header'
import SearchForm from '../modules/demo/containers/SearchForm'

function HomePage () {
  return (
    <Page>
      <Header />
      <SearchForm />
    </Page>
  )
}

export default HomePage
