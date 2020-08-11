import {reactive, toRefs} from '@vue/composition-api'

export default function paginationApi() {
  const paginationState = reactive({
    currentPage: 1,
    maxPage: 1,
    items: [5, 10, 15, 20],
    itemsPerPage: 10
  })

  function displayData(filteredData: Array<any>): Array<any> {
    paginationState.maxPage = Math.ceil(filteredData.length / paginationState.itemsPerPage)
    if (paginationState.currentPage > paginationState.maxPage) {
      paginationState.currentPage = 1
    }
    const startIndex = (paginationState.currentPage - 1) * paginationState.itemsPerPage
    const endIndex = startIndex + paginationState.itemsPerPage
    return filteredData.slice(startIndex, endIndex)
  }

  return {paginationState, displayData}
}
