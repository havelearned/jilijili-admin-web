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
      hide-pagination
      v-model:pagination="pagination"
      :loading="loading"
      virtual-scroll
    >


      <template v-slot:top>
        <div class="q-gutter-md">
          <q-btn color="primary" :disable="loading" label="添加歌手" @click="addRow"/>
          <q-btn class="q-ml-sm" color="primary" :disable="loading" label="删除" @click="removeRow(selected)"/>
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
                <q-btn outline class="q-pa-sm" size="sm" color="brown" label="删除" @click="delRow(props.row)"/>
                <q-btn class="q-pa-sm" size="sm" color="brown" label="歌手信息" @click="infoRow(props.row.id)"/>
                <q-checkbox style="margin-left: 20px" size="xl" color="brown" dense v-model="props.selected"
                            label="选中"/>
              </q-btn-group>
            </q-card-section>
            <q-separator/>

            <!-- 歌手内容 -->

            <q-card>
              <q-card-section class="text-center" @click="checkSingerInfo(props.row.id)">
                <q-avatar size="200px" font-size="52px" color="teal" text-color="white">
                  <q-img :src="props.row.singerPhoto"
                         :srcset="props.row.singerPhoto+' 300w'">
                    <div class="absolute-bottom text-body1 text-center">
                      <div class="q-ma-lg q-pa-sm-lg">
                        <strong>{{ props.row.singerName }}</strong>
                        <br>
                        <br>
                        <q-badge outline color="orange" :label="props.row.singerType >=2 ? '原唱':'翻唱'"/>
                      </div>
                    </div>
                  </q-img>
                </q-avatar>
                <br>


              </q-card-section>
              <q-separator/>
              <q-card-section class="flex flex-center" :style="{ fontSize: 13 + 'px' }">
                <div class="singer-profile-card">{{ props.row.singerDetails }}</div>
              </q-card-section>
            </q-card>
          </q-card>
        </div>
      </template>


    </q-table>
    <!--   分页    -->
    <div class="page-bar row justify-center q-mt-md ">
      <q-pagination
        direction-links
        unelevated
        color="black"
        active-color="purple"
        @update:modelValue="fetchData"
        v-model="pagination.current"
        row-key="id"
        :max="pagesNumber"
        :max-pages="pagination.rowsPerPage"
        :boundary-numbers="false"
        input
        boundary-links
      >
      </q-pagination>


    </div>

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
import {useMusicData} from "src/composables/music/useMusicData";

const props = defineProps({
  childHead: Boolean,
})
const {childHead} = props;
const isOpenCreateDialog = ref(null)
const isOpenUpdateDialog = ref(null)
const isOpenInfoDialog = ref(null);

const {
  tableDate,
  pagination,
  fetchData,
  pagesNumber,
  delRow,
  removeRow,
} = useMusicData()


const addRow = () => {
  // TODO[1] 添加歌手操作
  isOpenCreateDialog.value.changeDialog()
}
const updateRow = (id) => {
  // TODO[1] 修改歌手操作
  isOpenUpdateDialog.value.changeDialog()
}

const infoRow = (id) => {
  // TODO[1] 查询歌手信息,专辑信息,歌曲信息
  isOpenInfoDialog.value.changeDialog(id);

}


const checkSingerInfo = (id) => {
  alert("歌手信息")

}
const filter = ref('')
const selected = ref([])
const selectedAll = ref(true);
const loading = ref(false)

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
