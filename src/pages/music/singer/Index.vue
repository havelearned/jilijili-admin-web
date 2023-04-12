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
          <q-btn-group>
            <q-card-section>
              <q-btn color="primary" :disable="loading" label="添加歌手" @click="addRow"/>
            </q-card-section>
            <q-card-section>
              <q-btn class="q-ml-sm" color="deep-orange" :disable="loading" label="删除" @click="removeRow(selected)"/>
            </q-card-section>
          </q-btn-group>


        </div>
        <q-space/>
        <div class="">
          <q-form @submit="search" @reset="searchReset">
            <q-btn-group>


            <q-card-section class="row q-gutter-lg q-pa-lg-lg justify-center">
              <q-input
                filled
                v-model="searchFrom.id"
                label="id"
                lazy-rules
              />

              <q-input
                filled
                type="tel"
                v-model="searchFrom.singerName"
                label="歌手名称"
              />

              <q-select filled
                        clearable
                        transition-show="flip-up"
                        transition-hide="flip-down"
                        v-model="searchFrom.singerType"
                        label="歌手类型"
                        lazy-rules
                        emit-value
                        map-options
                        :options="singer_type_selection"></q-select>

              <q-input v-model="searchFrom.createdTime" filled type="date" hint="开始时间"/>
              <q-input v-model="searchFrom.specifyTime" filled type="date" hint="结束时间"

              />
<!--              :rules="[value => value && value>=searchFrom.createdTime || '结束时间不能小于开始时间'] "-->

              <div class="row justify-center">
                <q-btn flat type="submit">搜索</q-btn>
                <q-btn flat type="reset">重置</q-btn>
              </div>
            </q-card-section>
            </q-btn-group>
          </q-form>
        </div>
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
                <q-img
                  ratio="1"
                  :srcset="props.row.singerPhoto+' 300w'">
                  <div class="absolute-bottom text-body1 text-center">
                    <div class="q-ma-lg q-pa-sm-lg">
                      <strong>{{ props.row.singerName }}</strong>
                      <br>
                      <br>
                      <q-badge outline color="orange" :label="props.row.singerType"/>
                    </div>
                  </div>
                </q-img>

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
import {useSingerData} from "src/composables/music/useSingerData";
import {singer_type_selection} from "src/utils/dictionary";

const props = defineProps({
  childHead: Boolean,
})
const {childHead} = props;
const isOpenCreateDialog = ref(null)
const isOpenUpdateDialog = ref(null)
const isOpenInfoDialog = ref(null);

const {
  searchFrom,
  searchReset,
  search,
  tableDate,
  pagination,
  fetchData,
  pagesNumber,
  delRow,
  removeRow,
} = useSingerData()


const addRow = () => {
  isOpenCreateDialog.value.changeDialog()
}
const updateRow = (id) => {

  isOpenUpdateDialog.value.changeDialog(id)
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
