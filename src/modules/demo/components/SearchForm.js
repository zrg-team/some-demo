import React, { useState, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import AutoComplete from './AutoComplete'

const SearchContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  .box-wrapper {
    margin-top: 180px;
    width: 420px;
    height: 42px;
    margin-left: 10px;
    margin-right: 10px;
    border-radius: 4px;
  }
  .input {
    width: 100%;
    height: 100%;
    padding-left: 42px;
    padding-right: 12px;
    border: 1px solid ${({ theme }) => theme.border};
    border-radius: 4px;
    box-shadow: 0 0 2px ${({ theme }) => theme.border};
    background-color: ${({ theme }) => theme.primaryBackground100};
    font-weight: 800;
    font-size: 16px;
    color: ${({ theme }) => theme.text};
  }
  .input:focus {
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
    outline: none;
  }
  .complete-item {
    width: 100%;
    height: 42px;
    color: ${({ theme }) => theme.text};
    align-items: center;
    padding-left: 12px;
    padding-right: 12px;
    display: flex;
    font-weight: 500;
  }
  .complete-item-highlighted {
    background-color: ${({ theme }) => theme.primaryBackground100};
  }
  .box-menu-wrapper {
    border-radius: 4px;
    background-color: ${({ theme }) => theme.primaryBackground};
    border: 1px solid ${({ theme }) => theme.border};
    border-top-left-radius: 0px;
    border-top-right-radius: 0px;
    max-height: 300px;
    overflow: scroll;
  }
  .loader-container {
    width: 100%;
    height: 42px;
    align-items: center;
    justify-content: center;
    display: flex;
  }
  .loader {
    border: 5px solid ${({ theme }) => theme.primaryBackground100}; /* Light grey */
    border-top: 5px solid ${({ theme }) => theme.primaryBackground}; /* Blue */
    border-radius: 50%;
    width: 32px;
    height: 32px;
    animation: spin 2s linear infinite;
  }
  /* Safari */
  @-webkit-keyframes spin {
    0% { -webkit-transform: rotate(0deg); }
    100% { -webkit-transform: rotate(360deg); }
  }
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  .input-icon {
    width: 42px;
    height: 42px;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center
  }
  .input-container {
    width: 100%;
    height: 42px;
  }
  .search-icon {
    color: ${({ theme }) => theme.text};
    font-size: 16px
  }
`
function SearchForm ({ fetchData, theme }) {
  const [selectedValue, setSelectedValue] = useState('')

  const getAsyncItems = useCallback(async (value) => {
    const items = await fetchData(value)
    return items
  })
  const handleChange = useCallback(async (e) => {
    setSelectedValue(e.target.value)
  }, [])
  const renderItem = useCallback((item, highlighted) => {
    return (
      <div
        key={item.id}
        className={`complete-item ${highlighted ? 'complete-item-highlighted' : ''}`}
      >
        {item.label}
      </div>
    )
  })
  const LoadingComponent = useMemo(() => (
    <div className='loader-container'>
      <div className='loader' />
    </div>
  ), [])
  const SearchComponent = useMemo(() => (
    <div className='input-icon'>
      <FontAwesomeIcon icon={faSearch} className='search-icon' />
    </div>
  ), [])
  return (
    <SearchContainer>
      <AutoComplete
        // There are two mode: offline filter and async
        // offline filter active if provide items props: search will perform Immediately
        // async: search will perform after end editing
        // items={[
        //   { id: 'a1', label: 'Ho Chi Minh' },
        //   { id: 'a2', label: 'Ha Noi' },
        //   { id: 'a3', label: 'Da Nang' },
        //   { id: 'a4', label: 'Hue' },
        //   { id: 'a5', label: 'Vinh' },
        //   { id: 'a6', label: 'Thanh Hoa' },
        //   { id: 'a7', label: 'Nghe An' },
        //   { id: 'a8', label: 'Can Tho' },
        //   { id: 'a9', label: 'My Tho' }
        // ]}
        // onfilterItem={(item, value) => {
        //   return item.label.toLowerCase().indexOf(value.toLowerCase()) > -1
        // }}
        getAsyncItems={getAsyncItems}
        loadingComponent={LoadingComponent}
        inputIcon={SearchComponent}
        selectOnBlur
        getItemValue={item => item.label}
        renderItem={renderItem}
        value={selectedValue}
        onChange={handleChange}
        onSelect={value => setSelectedValue(value)}
        menuWrapperProps={{
          className: 'box-menu-wrapper'
        }}
        wrapperProps={{
          className: 'box-wrapper'
        }}
        inputProps={{
          className: 'input'
        }}
        inputWrapperProps={{
          className: 'input-container'
        }}
      />
    </SearchContainer>
  )
}

export default SearchForm
