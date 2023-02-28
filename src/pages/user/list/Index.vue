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
          binary-state-sort
          v-model:pagination="pagination"
          v-model:selected="selected"
          @row-click="rowClick"
        >


          <template v-slot:top>
            <q-btn color="primary" :disable="loading" label="添加" @click="toggleDialog"/>
            <q-btn class="q-ml-sm" color="secondary" :disable="loading" label="删除"/>

            <q-space/>
            <q-input borderless dense debounce="300" color="primary" v-model="filter">
              <template v-slot:append>
                <q-icon name="search"/>
              </template>
            </q-input>
          </template>
          <!--                    <template v-slot:body="props">

                                <q-tr :props="props">
                                  <q-td key="id" :props="props">{{ props.row.id }}</q-td>

                                  <q-td key="username" :props="props">{{ props.row.username }}</q-td>
                                  <q-td key="nickname" :props="props">{{ props.row.nickname }}</q-td>
                                  <q-td key="gender" :props="props">{{ props.row.gender }}</q-td>
                                  <q-td key="unseal" :props="props">{{ props.row.unseal }}</q-td>
                                  <q-td key="lastLoginIp" :props="props">{{ props.row.lastLoginIp }}</q-td>
                                  <q-td key="lastLoginTime" :props="props">{{ props.row.lastLoginTime }}</q-td>
                                  <q-td key="createdTime" :props="props">{{ props.row.createdTime }}</q-td>
                                </q-tr>


                              </template>-->


        </q-table>

      </div>
      <div class="page-bar row justify-center q-mt-md ">
        <q-pagination
          direction-links
          unelevated
          color="black"
          active-color="purple"
          @update:modelValue="fetchData"
          v-model="pagination.current"
          row-key="username"
          :max="pageNumber"
          :max-pages="pagination.rowsPerPage"
          :boundary-numbers="false"
          boundary-links
        />
        <div class="row justify-center">
          <span>一共:10000条记录</span>
          <q-select filled v-model="skip" :options="[10,20,30,40]" label="Filled"/>
          <q-btn label="跳转"></q-btn>
        </div>

      </div>

    </div>
  </div>

  <create-dialog v-if="showDialog" @hide="toggleDialog"/>


</template>

<script setup>
import {useUserSearch} from "src/composables/useUserSearch.js";
import {ref} from "vue";
import {useToggleDialog} from "src/composables/useToggleDialog.js";
import CreateDialog from "pages/user/list/CreateDialog.vue";

const showDialog = ref(false);
const {
  selected,
  loading, // 加载状态
  scrollTargetRef, // 不知道
  tableData, // 表单数据
  filter, // 搜索筛选数据
  pagination,
  pageNumber,
  fetchData,
  searchFrom,
  rowClick
} = useUserSearch()
const {toggleDialog} = useToggleDialog(showDialog)

const skip = ref(1)

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
