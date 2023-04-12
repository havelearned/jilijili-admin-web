<template>

  <div class="page">
    <div class="content rounded-borders">
      <q-markup-table flat bordered>
        <thead class="bg-teal">
        <tr>
          <th colspan="5">
            <div class="row no-wrap items-center">
              <q-img
                style="width: 70px"
                :ratio="1"
                class="rounded-borders"
                src="https://cdn.quasar.dev/img/donuts.png"
              />

              <div class="text-h4 q-ml-md text-white">Treats</div>
            </div>
          </th>
        </tr>
        </thead>
      </q-markup-table>

      <!--   表格内容   -->
      <div>
        <q-table
          row-key="id"
          separator="cell"
          :rows="tableData"
          :columns="columns"
          :filter="filter"
          selection="multiple"
          :loading="loading"
          loading-label="加载"
          binary-state-sort
          v-model:selected="selected"
          @row-dblclick="doubleRowClick"
          hide-pagination
          v-model:pagination="pagination"
        >

          <template v-slot:top="props">
            <q-btn color="primary" :disable="loading" label="添加" @click="createToggleDialog.toggleDialog()"/>
            <q-btn class="q-ml-sm" color="deep-orange" :disable="loading" label="删除" @click="delUsers"/>
            <q-btn class="q-ml-sm" color="secondary" :disable="loading" label="修改">
              <q-tooltip anchor="top middle" self="top start">
                双击条目即可修改
              </q-tooltip>
            </q-btn>
            <q-space/>
            <q-form
              @submit="fetchData(pagination.page)" @reset="onReset" class="q-gutter justify-center">
              <q-item class="row-lg q-gutter-md">
                <q-icon name="jilijili:exclamation" style="width: 32px;height: 32px;">
                  <q-tooltip anchor="top middle" self="center middle">
                    用户名称,昵称搜索,自动删除前后空格
                  </q-tooltip>
                </q-icon>
                <q-input filled label="id" lazy-rules v-model="searchFrom.id"/>
                <q-input filled label="用户名称" lazy-rules v-model="searchFrom.username"/>

                <q-input filled label="昵称" lazy-rules v-model="searchFrom.nickname"/>
                <q-select filled v-model="searchFrom.gender" :options="options" label="性别"/>
                <!--                <q-input filled type="date" hint="开始时间" v-model="searchFrom.createdTime"/>-->
                <!--                <q-input filled type="date" hint="结束时间" v-model="searchFrom.specifyTime"/>-->


                <div class="q-mt-md content-center">
                  <q-btn label="搜索" type="submit" color="primary"/>
                  <q-btn label="重置" type="reset" color="primary" flat/>
                </div>
              </q-item>
            </q-form>

          </template>

          <template v-slot:top-right>
            <q-btn
              color="primary"
              icon-right="archive"
              label="Export to csv"
              no-caps
            />
          </template>
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
        >

        </q-pagination>

      </div>

    </div>
  </div>
  <create-dialog v-if="showDialog" @hide="createToggleDialog.toggleDialog()"/>
  <update-dialog v-if="updateDialogFlag" @hide="updateToggleDialog.toggleDialog()" :currentRow="currentRow"/>
</template>

<script setup>
import {useUserSearch} from "src/composables/useUserSearch.js";
import {ref} from "vue";
import {useToggleDialog} from "src/composables/useToggleDialog.js";
import CreateDialog from "pages/user/list/CreateDialog.vue";
import UpdateDialog from "pages/user/list/UpdateDialog.vue";

const updateDialogFlag = ref(false)
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
  options,
  onReset,
  delUsers
} = useUserSearch()
const createToggleDialog = useToggleDialog(showDialog)
const updateToggleDialog = useToggleDialog(updateDialogFlag)
const skip = ref(1)
const currentRow = ref({})

// 双击修改当前用户
const doubleRowClick = (evt, row, index) => {
  currentRow.value = row
  updateDialogFlag.value = !updateDialogFlag.value;

}


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
