import {computed, onMounted, ref} from "vue";
import {search} from "src/api/user.js";
import {useNotify} from "src/composables/useNotify";
import {useDialog} from "src/composables/useDialog";

export const useUserSearch = () => {
  let scrollTargetRef = ""
  let tableData = ref([])
  let filter = ref('')
  let loading = ref(true)
  let selected = ref([])// 选择内容
  let options = ref(["FEMALE", "MALE", "UNKNOWN", "ALL"])

  // 搜索表单
  const searchFrom = ref({
    page: 0,
    size: 10,
    id: '',
    createdTime: '',
    specifyTime: '',
    nickname: '',
    username: '',
    unseal: 1,
    gender: 'MALE'
  })

  // 分页信息
  const pagination = ref({
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
    console.log("current===>", current)
    searchFrom.value.page = current
    searchFrom.value.nickname = searchFrom.value.nickname.trim();
    searchFrom.value.username = searchFrom.value.username.trim();
    searchFrom.value.id = searchFrom.value.id.trim();
    search(searchFrom.value).then(res => {
      if (res.code === 200) {
        tableData.value = res.data.records
        pagination.value.rowsPerPage = res.data.size
        pagination.value.rowsNumber = res.data.total
        pagination.value.current = res.data.current
      } else {
        useNotify().negativeNotify(res.message)
      }

    }).finally(() => {
      loading.value = false
    })
  }

  /**
   * 重置表单
   */
  const onReset = () => {
    searchFrom.value.id = undefined;
    searchFrom.value.username = undefined;
    searchFrom.value.nickname = undefined;
    searchFrom.value.gender = undefined;
    searchFrom.value.createdTime = undefined;
    searchFrom.value.specifyTime = undefined;
    searchFrom.value.unseal = 1;
    searchFrom.value.specifyTime = undefined;
  }

  // 计算分页
  const pageNumber = computed(() => {
    return (pagination.value.rowsNumber / pagination.value.rowsPerPage) + 1
  })

  // 钩子函数,初始化数据
  onMounted(fetchData)

  // 删除用户
  const delUsers = () => {
    let count = selected.value.length;
    let message = "";
    selected.value.forEach(item => {
      message += "<" + item.username + ">\n"
    })
    message += "这" + count + "项数据吗?"
    useDialog().confirmDialog("确定删除吗?", message).then(r => {
      if (r === 1) {
        // TODO 删除并且重新发送请求
      }
    })
  }


  return {
    delUsers,
    selected,
    loading, // 加载状态
    scrollTargetRef, // 不知道
    tableData, // 表单数据
    filter, // 搜索筛选数据
    pagination,
    pageNumber,
    fetchData,
    options,
    onReset,
    searchFrom,
  }
}
