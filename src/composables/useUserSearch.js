import {computed, onMounted, ref} from "vue";
import {search} from "src/api/user.js";

export const useUserSearch = () => {
  let scrollTargetRef = ""
  let tableData = ref([])
  let filter = ref('')
  let loading = ref(true)
  let selected = ref([])// 选择内容
  // 搜索表单
  let searchFrom = {
    page: 0,
    size: 5,
    id: undefined,
    createdTime: undefined,
    specifyTime: undefined,
    nickname: undefined,
    username: undefined,
    unseal: undefined,
    gender: undefined
  }
  // 分页信息
  let pagination = ref({
    current: 0,
    sortBy: 'desc',
    descending: false,
    page: 0, // 当前页,选中的页面
    rowsPerPage: 0, // 每页行数
    rowsNumber: 0, // 总行数(总记录数)
    // rowsNumber: xx if getting data from a server
  })

  // 获取数据
  const fetchData = (current) => {
    loading.value = true
    searchFrom.page = current
    search(searchFrom).then(res => {
      // console.log("res=>",res)
      tableData.value = res.data.records
      pagination.value.rowsPerPage = res.data.size
      pagination.value.rowsNumber = res.data.total
      pagination.value.current = res.data.current

    }).finally(() => {
      loading.value = false
    })
  }

  // 计算分页
  const pageNumber = computed(() => {
    return (pagination.value.rowsNumber / pagination.value.rowsPerPage) + 1
  })

  // 钩子函数,初始化数据
  onMounted(fetchData)


  return {
    selected,
    loading, // 加载状态
    scrollTargetRef, // 不知道
    tableData, // 表单数据
    filter, // 搜索筛选数据
    pagination,
    pageNumber,
    fetchData,

    searchFrom,

  }
}
