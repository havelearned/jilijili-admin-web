import {computed, onMounted, ref} from "vue";
import {deleted, list} from "src/api/singer"
import {useDialog} from "src/composables/useDialog";
import {useNotify} from "src/composables/useNotify";

export const useMusicData = () => {
  const searchFrom = ref({
    page: 1,
    size: 8,
    locked: 0

  });
  const tableDate = ref([
    {
      id: 1, //  歌手id
      singerName: 1, // 歌手名称
      singerDetails: 1, // 歌手信息
      singerPhoto: 1, // 歌手头像
      singerType: 1, // 歌手类型
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
    console.log("current===========>", current)
    searchFrom.value.page = current
    list(searchFrom.value).then(res => {
      console.log("歌手数据=>", res)
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
        console.log("取消删除")
      }
    })
  }

  // 删除全部
  const removeRow = (selected) => {
    let ids = '';
    selected.forEach(item => {
      ids += item.id + ','
    })
    if (!ids) {
      useNotify().warningNotify("未选中任何内容")
      return
    }
    deleted(ids).then(res => {
      if (res.code === 200) {
        location.reload()
        useNotify().infoNotify(res.message)
      } else {
        useNotify().negativeNotify(res.message)
      }

    })


  }


  return {
    removeRow,
    delRow,
    pagination,
    fetchData,
    pagesNumber,
    tableDate
  }

}
