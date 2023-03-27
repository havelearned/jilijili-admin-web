<template>
  <div class="q-pa-md">

    <q-table
      grid
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
          <q-btn color="primary" :disable="loading" label="添加专辑" @click="addRow"/>
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
  console.log("row========>", row)
  // TODO[1] 删除歌手操作
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
    singerName: 1, // 歌手名称
    singerDetails: 1, // 歌手信息
    singerPhoto: 1, // 歌手头像
    singerType: 1, // 歌手类型
    createdTime: 1, // 创建时间
    specifyTime: 1, // 匹配时间
  },
])
for (let i = 2; i < 12; i++) {
  let newItem = {
    id: i, //  歌手id
    singerName: 1, // 歌手名称
    singerDetails: 1, // 歌手信息
    singerPhoto: 1, // 歌手头像
    singerType: 1, // 歌手类型
    createdTime: 1, // 创建时间
    specifyTime: 1, // 匹配时间
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
    name: 'singerName', align: 'center', label: '歌手名称', field: row => row.singerName,
    format: val => `${val}`, sortable: true
  },
  {
    name: 'singerDetails', align: 'center', label: '歌手简介', field: row => row.singerDetails,
    format: val => `${val}`, sortable: true
  },
  // {name: 'singerPhoto', align: 'center', label: '歌手头像', field: row => row.name,
  //   format: val => `${val}`, sortable: true},
  {
    name: 'singerType', align: 'center', label: '歌手类型', field: row => row.singerType,
    format: val => `${val}`, sortable: true
  },
  {
    name: 'createdTime', align: 'center', label: '创建时间', field: row => row.createdTime,
    format: val => `${val}`, sortable: true
  },
]


</script>
