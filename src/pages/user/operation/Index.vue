<template>
  <div class="q-pa-md ">
    <q-card class="my-card page">
      <div class="tree-card">
        <div class="q-gutter-sm">
          <q-btn size="sm" color="primary" @click="selectGoodService" label="Select 'Good service'"/>
          <q-btn v-if="selected" size="sm" color="red" @click="unselectNode" label="Unselect node"/>
        </div>
        <q-card class="my-card">
          <q-card-section>
            <q-tree
              :nodes="props"
              no-connectors
              accordion
              v-model:selected="treeSelected"
              v-model:expanded="expanded"
              @update:selected="selectGoodService"
              node-key="label"
            />
          </q-card-section>
        </q-card>

      </div>
      <div class="table-card">
        <q-table
          :filter="filter"
          :rows="tableDate"
          :columns="columns"
          row-key="id"
          binary-state-sort
          class="q-pa-md-sm"
          selection="multiple"
          v-model:selected="selected"
          :pagination="initialPagination"
          :loading="loading"
          virtual-scroll
        >


          <template v-slot:top="props">
            <div class="q-gutter-md">
              <q-btn color="primary" :disable="loading" label="添加角色" @click="addRow"/>
              <q-btn class="q-ml-sm" color="primary" :disable="loading" label="删除" @click="removeRow(selected)"/>
              <q-checkbox size="xl" keep-color v-model="selectedAll" label="全选" color="teal" @click="checkAll"/>
            </div>
            <q-space/>
            <q-input borderless dense debounce="300" color="primary" v-model="filter">
              <template v-slot:append>
                <q-icon name="search"/>
              </template>
            </q-input>
          </template>

          <template v-slot:item="props">
            <div
              class="q-pa-xs col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-style-transition"
              :style="props.selected ? 'transform: scale(0.95);' : ''"
            >
              <q-card class="my-card">
                <q-img src="https://cdn.quasar.dev/img/parallax2.jpg">
                  <div class="absolute-bottom">
                    <strong>专辑名字:{{ props.row.singerName }}</strong><br>
                    <strong>歌手:{{ props.row.singerType }}</strong><br>
                    专辑简介: {{ props.row.singerDetails }}<br>
                  </div>
                </q-img>

                <q-card-actions class="justify-center">
                  <q-btn-group outline>
                    <q-btn outline color="brown" label="修改" @click="updateRow(props.row.id)"/>
                    <q-btn outline color="brown" label="删除" @click="removeRow(props.row)"/>
                    <q-btn color="brown" label="专辑信息" @click="infoRow(props.row.id)"/>
                    <q-checkbox style="margin-left: 20px" size="xl" color="brown" dense v-model="props.selected"
                                label="选中"/>
                  </q-btn-group>
                </q-card-actions>
              </q-card>
              <q-card :class="props.selected ? 'bg-grey-2' : ''">
                <q-separator/>

              </q-card>
            </div>
          </template>

        </q-table>
        <CreateDialog ref="isOpenCreateDialog"/>
        <UpdateDialog ref="isOpenUpdateDialog"/>
      </div>
    </q-card>

  </div>
</template>

<script setup>
import {ref} from 'vue'
import CreateDialog from "./CreateDialog.vue";
import UpdateDialog from "./UpdateDialog.vue";
import {useDialog} from "src/composables/useDialog";

const isOpenCreateDialog = ref(null)
const isOpenUpdateDialog = ref(null)
const addRow = () => {
  isOpenCreateDialog.value.changeDialog()
}
const updateRow = (id) => {
  isOpenUpdateDialog.value.changeDialog(id);
}

const infoRow = (id) => {

}
const removeRow = (row) => {
  useDialog().confirmDialog("确定删除吗?", row + '').then(r => {
    if (r) {
      console.log("确定删除")
    } else {
      console.log("取消删除")
    }
  })
}

const checkAll = () => {

}

const tableDate = ref([
  {
    id: 1, //  歌手id
    name: 1, // 歌手名称
    description: 1, // 歌手信息
    status: 1, // 歌手头像
    musicFilepath: 1, // 歌手类型
    createdTime: 1, // 创建时间c
    albumId: undefined, // 专辑id,
    singerId: undefined //  歌手id
  },
])
for (let i = 2; i < 12; i++) {
  let newItem = {
    id: 1, //  歌手id
    name: 1, // 歌手名称
    description: 1, // 歌手信息
    status: 1, // 歌手头像
    musicFilepath: 1, // 歌手类型
    createdTime: 1, // 创建时间
  };

  tableDate.value.push(newItem)
}
const filter = ref('')
const selected = ref([])
const selectedAll = ref(true);
const loading = ref(false)
const initialPagination = {
  sortBy: 'desc',
  descending: false,
  page: 1,
  rowsPerPage: 8
  // rowsNumber: xx if getting data from a server
}
const columns = [
  {
    name: 'id',
    required: true,
    label: '歌手Id',
    align: 'center',
    field: row => row.id,
    format: val => `${val}`,
    sortable: true
  },
  {
    name: 'name', align: 'center', label: '歌曲名称', field: row => row.name,
    format: val => `${val}`, sortable: true
  },
  {
    name: 'description', align: 'center', label: '歌词', field: row => row.description,
    format: val => `${val}`, sortable: true
  },
  {
    name: 'status', align: 'center', label: '状态', field: row => row.status,
    format: val => `${val}`, sortable: true
  },
  {
    name: 'musicFilepath', align: 'center', label: '歌曲源文件', field: row => row.musicFilepath,
    format: val => `${val}`, sortable: true
  },
  {
    name: 'createdTime', align: 'center', label: '创建时间', field: row => row.createdTime,
    format: val => `${val}`, sortable: true
  },
]


const selectGoodService = (array) => {
}
const treeSelected = ref(null)
const expanded = ref(['Admin'])
const props = [
  {
    label: '选择角色',
    avatar: 'https://cdn.quasar.dev/img/boy-avatar.png',
    children: [
      {
        label: 'Admin',
        icon: 'photo',
        children: [
          {label: '添加'},
          {label: '修改'},
          {label: '删除'},
          {label: '查询'},
        ]
      },
      {
        label: '普通用户',
        icon: 'room_service',
        children: [
          {label: '查询'},
        ]
      },
      {
        label: 'Pleasant surroundings',
        icon: 'photo',
        children: [
          {
            label: 'Happy atmosphere'
          },
          {
            label: 'Good table presentation'
          },
          {
            label: 'Pleasing decor'
          }
        ]
      }
    ]
  }
]

</script>


<style scoped lang="less">
.page {
  display: flex;
  width: 100%;
  height: 100%;

  .tree-card {
    margin-right: 20px;
    height: 100%;
    width: 300px;
  }

  .table-card {
    width: 100%;
    height: 100%;
  }

}
</style>
