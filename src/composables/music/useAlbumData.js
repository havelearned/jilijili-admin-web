import {computed, onMounted, ref} from "vue";
import {deleted, list} from "src/api/album"
import {useDialog} from "src/composables/useDialog";
import {useNotify} from "src/composables/useNotify";

export const useAlbumData = () => {
  const searchFrom = ref({
    page: 1,
    size: 8,
    id: undefined,
    albumName: undefined, // 专辑
    details: undefined, // 专辑信息
    albumImg: undefined, // 专辑头像
    createdTime: undefined, // 创建时间
    specifyTime: undefined, // 匹配时间

  });
  const tableDate = ref([
    {
      id: 1, //  专辑
      albumName: 1, // 专辑
      details: 1, // 专辑信息
      albumImg: 1, // 专辑头像
      createdTime: 1, // 创建时间
      specifyTime: 1, // 匹配时间
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
      console.log("专辑数据==>", res)
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
    searchFrom.value.id = undefined
    searchFrom.value.albumName = undefined
    searchFrom.value.details = undefined
    searchFrom.value.createdTime = undefined
    searchFrom.value.specifyTime = undefined
    fetchData(0)
  }

  // 删除
  const delRow = (row) => {
    useDialog().confirmDialog(`确定删除吗?`, `${row.albumName}`).then(r => {
      if (r) {

        deleted(row.id + '').then(res => {
          if (res.code === 200) {
            useNotify().infoNotify(res.message)
          } else {
            useNotify().negativeNotify(res.message)
          }
        })
      } else {
        console.log("取消删除")
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
