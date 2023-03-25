<template>
  <div class="q-pa-md">

    <div v-if="childHead">
      <q-markup-table flat bordered>
        <thead class="header-bg">
        <tr>
          <th colspan="5">
            <div class="row no-wrap items-center">
              <q-img
                style="width: 70px"
                :ratio="1"
                class="rounded-borders"
                src="https://cdn.quasar.dev/img/donuts.png"
              />

              <div class="music-header">
                <div>
                  <div>音乐管理</div>
                  <div>使用这个Piees产品管理是最简单快速有效的工作方式。</div>
                </div>

                <div>
                  <q-btn color="primary" label="上架音乐"/>
                </div>

              </div>

            </div>
          </th>
        </tr>
        </thead>
      </q-markup-table>
    </div>
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


      <template v-slot:top>
        <div class="q-gutter-md">
          <q-btn color="primary" :disable="loading" label="添加歌手" @click="addRow"/>
          <q-btn class="q-ml-sm" color="primary" :disable="loading" label="删除" @click="removeRow"/>
          <q-checkbox size="xl" keep-color v-model="selectedAll" label="全选" color="teal" @click=""/>
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
          <q-card :class="props.selected ? 'bg-grey-2' : ''">

            <!-- 多选框 -->
            <q-card-section>
              <q-btn-group outline class="text-weight-light" style="display: flex;justify-content:center;height: 40px;">
                <!--                :label="props.row.id"-->
                <q-btn outline class="q-pa-sm" size="sm" color="brown" label="修改" @click="updateRow(props.row.id)"/>
                <q-btn outline class="q-pa-sm" size="sm" color="brown" label="删除" @click="delRow(props.row.id)"/>
                <q-btn class="q-pa-sm" size="sm" color="brown" label="歌手信息" @click="infoRow(props.row.id)"/>
                <q-checkbox style="margin-left: 20px" size="xl" color="brown" dense v-model="props.selected"
                            label="选中"/>
              </q-btn-group>
            </q-card-section>
            <q-separator/>

            <!-- 歌手内容 -->

            <q-card>
              <q-card-section class="text-center" @click="checkSingerInfo(props.row.id)">
                <q-avatar size="100px" font-size="52px" color="teal" text-color="white">
                  <img src="https://cdn.quasar.dev/img/avatar.png">
                </q-avatar>
                <br>
                <div class="q-ma-lg q-pa-sm-lg">
                  <strong>名字:{{ props.row.singerName }}</strong>
                  <strong>主唱类型:{{ props.row.singerType }}</strong>
                </div>

              </q-card-section>
              <q-separator/>
              <q-card-section class="flex flex-center" :style="{ fontSize: 20 + 'px' }">
                <div>简介:{{ props.row.singerDetails }}</div>
              </q-card-section>
            </q-card>
          </q-card>
        </div>
      </template>
    </q-table>

    <CreateDialog ref="isOpenCreateDialog"/>
    <UpdateDialog ref="isOpenUpdateDialog"/>
    <InfoDialog ref="isOpenInfoDialog"/>
  </div>
</template>

<script setup>
import {ref} from 'vue'
import CreateDialog from './CreateDialog.vue'
import UpdateDialog from "./UpdateDialog.vue"
import InfoDialog from "./InfoDialog.vue";
import {useDialog} from "src/composables/useDialog";

const props = defineProps({
  childHead: Boolean,
})
const {childHead} = props;
const isOpenCreateDialog = ref(null)
const isOpenUpdateDialog = ref(null)
const isOpenInfoDialog = ref(null);
// 添加歌手
const addRow = () => {
  isOpenCreateDialog.value.changeDialog()
}
const updateRow = (id) => {
  isOpenUpdateDialog.value.changeDialog()
}

const delRow = (id) => {
  useDialog().confirmDialog("确定删除吗?","消息").then(r=>{
    if(r){
      console.log("确定删除")
    }else{
      console.log("取消删除")
    }
  })
}
const infoRow = (id) => {
  isOpenInfoDialog.value.changeDialog(id);

}
// 删除所有

const removeRow = () => {

}

const checkSingerInfo=(id)=>{
  useDialog().confirmDialog("确定删除吗?","消息")

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

<style scoped lang="less">
@import "src/css/music.less";
</style>
