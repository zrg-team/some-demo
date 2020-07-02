const MOCK_RESULT = [
  { id: 'a1', label: 'Ho Chi Minh' },
  { id: 'a2', label: 'Ha Noi' },
  { id: 'a3', label: 'Da Nang' },
  { id: 'a4', label: 'Hue' },
  { id: 'a5', label: 'Vinh' },
  { id: 'a6', label: 'Thanh Hoa' },
  { id: 'a7', label: 'Nghe An' },
  { id: 'a8', label: 'Can Tho' },
  { id: 'a9', label: 'My Tho' },
  { id: 'a10', label: 'Tay Nguyen' },
  { id: 'a11', label: 'Binh Phuoc' }
]

function fakeFetch (input) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('input', input)
      resolve(MOCK_RESULT.filter(item => item.label.toLowerCase().includes(`${input}`.trim().toLowerCase())))
    }, 200)
  })
}

export default (dispatch, props) => ({
  fetchData: async (input) => {
    return fakeFetch(input)
  }
})
