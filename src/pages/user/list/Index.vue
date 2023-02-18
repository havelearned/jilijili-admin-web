<template>

  <div class="page">
    <div class="content rounded-borders">
      <q-markup-table flat class="rounded-borders">
        <!--    表格头部     -->
        <thead class="bg-grey">
        <tr>
          <th colspan="7">
            <div class="row no-wrap items-center my-title-left-text ">
              <div>
                <q-img style="width: 70px" :ratio="1" class="rounded-borders"
                       src="https://cdn.quasar.dev/img/donuts.png"/>
                <div class="text-h5 q-ml-md text-white">用户管理</div>
              </div>
              <div>
                <div class="header">
                  <div class="tab-bar ">
                    <q-btn-group push>
                      <div class=" row q-pa-md q-gutter-sm">
                        <q-input type="date" color="white" text-color="black" hint="起始时间"/>
                        <q-input type="date" color="primary" hint="结束时间"/>
                      </div>
                      <div class=" row q-pa-md q-gutter-sm">
                        <q-btn color="secondary" label="Secondary"/>
                        <q-btn color="amber" glossy label="Amber"/>
                      </div>
                    </q-btn-group>
                  </div>

                </div>
              </div>

            </div>
          </th>
        </tr>
        </thead>
      </q-markup-table>

      <!--   表格内容   -->
      <div>
        <q-table
          row-key="username"
          :rows="tableData"
          :columns="columns"
          :filter="filter"
          selection="multiple"
          :loading="loading"
          loading-label="加载"
          hide-pagination
          v-model:pagination="pagination"
          v-model:selected="selected"
        >


          <template v-slot:top>
            <q-btn color="primary" :disable="loading" label="添加" @click="add"/>
            <q-btn class="q-ml-sm" color="secondary" :disable="loading" label="删除" @click="remove"/>
            <q-space/>
            <q-input borderless dense debounce="300" color="primary" v-model="filter">
              <template v-slot:append>
                <q-icon name="search"/>
              </template>
            </q-input>
          </template>


        </q-table>
        <div class=" row justify-center q-mt-md">
          <q-pagination
            @update:modelValue="fetchData"
            v-model="pagination.current"
            row-key="username"
            color="black"
            :max="pageNumber"
            :max-pages="pagination.rowsPerPage"
            :boundary-numbers="false"
            boundary-links
          />
          <div>当前页:</div>
          <div>总页数:</div>
          <div>跳转</div>
        </div>
      </div>


    </div>
  </div>

</template>

<script>
import {computed, ref} from "vue";
import {search} from "src/api/user.js";


export default {
  name: "",
  setup() {
    let scrollTargetRef = ""
    let tableData = ref([])
    let filter = ref('')
    let loading = ref(true)
    let selected = ref([])// 选择内容
    /*列和行*/
    const columns = [
      {
        name: "id",
        required: true,
        label: "id",
        align: 'center',
        field: row => row.id,
        format: val => `${val}`,
        sortable: true
      },
      {
        name: "username",
        required: true,
        label: "用户名",
        align: 'center',
        field: row => row.username,
        format: val => `${val}`,
        sortable: true
      },
      {
        name: "nickname",
        required: true,
        label: "昵称",
        align: 'center',
        field: row => row.nickname,
        format: val => `${val}`,
        sortable: true
      },
      {
        name: "gender",
        required: true,
        label: "性别",
        align: 'center',
        field: row => row.gender,
        format: val => `${val}`,
        sortable: true
      },
      {
        name: "unseal",
        required: true,
        label: "是否可用",
        align: 'center',
        field: row => row.unseal,
        format: val => `${val === 1 ? "可用" : "禁用"}`,
        sortable: true
      },
      {
        name: "lastLoginIp",
        required: true,
        label: "IP地址",
        align: 'center',
        field: row => row.lastLoginIp,
        format: val => `${val}`,
        sortable: true
      },
      {
        name: "lastLoginTime",
        required: true,
        label: "最后登录时间",
        align: 'center',
        field: row => row.lastLoginTime,
        format: val => `${val}`,
        sortable: true
      },
      {
        name: "createdTime",
        required: true,
        label: "创建时间",
        align: 'center',
        field: row => row.createdTime,
        format: val => `${val}`,
        sortable: true
      }];
    let searchFrom = {
      page: 0,
      size: 10,
      id: undefined,
      createdTime: undefined,
      specifyTime: undefined,
      nickname: undefined,
      username: undefined,
      unseal: undefined,
      gender: undefined
    }

    /*分页*/
    let pagination = ref({
      current: 0,
      sortBy: 'desc',
      descending: false,
      page: 0, // 当前页,选中的页面
      rowsPerPage: 10, // 每页行数
      rowsNumber: 0, // 总行数(总记录数)
      // rowsNumber: xx if getting data from a server
    })

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
    fetchData()
    const add = () => {
      console.log(selected);
    }
    const remove = () => {
    }

    return {
      selected,
      loading, // 加载状态
      scrollTargetRef, // 不知道
      columns,
      tableData,
      filter,
      pagination,
      pageNumber: computed(() => {
        return (pagination.value.rowsNumber / pagination.value.rowsPerPage) + 1
      }),
      fetchData,
      searchFrom,

      add,
      remove


      // onLoadRef,
    }
  },
  created() {

  },


}

</script>

<style scoped lang="less">
.page {
  margin: 20px;
  display: flex;
  flex-direction: column;

  //background-color: gray;
  .header {
    margin-bottom: 2%;

    .tab-bar {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
  }

  .content {
    .my-title-left-text {
      display: flex;
      flex-direction: row;
      justify-content: space-between;

    }

  }
}


</style>
