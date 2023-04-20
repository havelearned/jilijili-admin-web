import {computed, onMounted, ref} from "vue";
import {deleted, list} from "src/api/singer"
import {useDialog} from "src/composables/useDialog";
import {useNotify} from "src/composables/useNotify";

export const useSingerData = () => {
  const searchFrom = ref({
    page: 1,
    size: 8,
    id: undefined,
    singerName: undefined,
    singerType: undefined,
    createdTime: undefined, // 创建时间
    specifyTime: undefined, // 匹配时间
    locked: 0

  });
  const tableDate = ref([
    {
      id: undefined, //  歌手id
      singerName: undefined, // 歌手名称
      singerDetails: undefined, // 歌手信息
      singerPhoto: undefined, // 歌手头像
      singerType: undefined, // 歌手类型
      createdTime: undefined, // 创建时间
      specifyTime: undefined, // 匹配时间
    },
  ])


  let pagination = ref({
    current: 0,
    sortBy: 'desc',
    descending: false,
    page: 0, // 当前页,选中的页面
    rowsPerPage: 0, // 每页行数
    rowsNumber: 0, // 总行数(总记录数)
    // rowsNumber: xx if getting data from a server
  })

  onMounted(() => {
    fetchData()

  })

  const fetchData = (current) => {
    searchFrom.value.page = current
    list(searchFrom.value).then(res => {
      if (res.code === 200) {
        tableDate.value = res.data.records
        pagination.value.rowsPerPage = res.data.size
        pagination.value.rowsNumber = res.data.total
        pagination.value.current = res.data.current
      } else {
        useNotify().negativeNotify(res.message)
      }
    })
  }
  const pagesNumber = computed(() => {
    return Math.ceil(pagination.value.rowsNumber / pagination.value.rowsPerPage)
  })


  const search = () => {
    fetchData(searchFrom.value.page)

  }
  const searchReset = () => {
    searchFrom.value.createdTime = undefined
    searchFrom.value.specifyTime = undefined
    searchFrom.value.singerName = undefined
    searchFrom.value.singerType = undefined
    searchFrom.value.id = undefined
  }

  // 删除
  const delRow = (row) => {
    useDialog().confirmDialog(`确定删除吗?`, `${row.singerName}`).then(r => {
      if (r) {
        deleted(row.id).then(res => {
          if (res.code === 200) {
            location.reload()
            useNotify().infoNotify(res.message)
          } else {
            useNotify().negativeNotify(res.message)
          }
        })


      } else {
      }
    })
  }

  // 删除全部
  const removeRow = (selected) => {
    let ids = '';
    let count = 0;
    selected.forEach(item => {
      ids += item.id + ','
      count++;
    })

    if (!ids) {
      useNotify().warningNotify("未选中任何内容")
      return
    }

    useDialog().confirmDialog('删除?', `确定删除${count}项数据吗?`).then(res => {
      if (res) {
        deleted(ids).then(res => {
          if (res.code === 200) {
            location.reload()
            useNotify().infoNotify(res.message)
          } else {
            useNotify().negativeNotify(res.message)
          }
        })
      }
    })


  }


  return {
    searchFrom,
    searchReset,

    search,
    removeRow,
    delRow,
    pagination,
    fetchData,
    pagesNumber,
    tableDate
  }

}
