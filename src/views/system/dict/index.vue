<template>
  <div>
    <q-splitter v-model="splitterModel"
                style="height: 100vmin">
      <!--      字典-->
      <template v-slot:before>
        <div class="q-pa-md">
          <q-table
              virtual-scroll
              flat
              color="primary"
              class="cross_table"
              separator="cell"
              :columns="columns"
              :rows="list"
              row-key="dictItemId"
              v-model:pagination="pagination"
              :visible-columns="group"
              @row-click="currentRow"
              @request="query"
              :rows-per-page-options="[10,20,50,100]"
              :loading="loading"
              selection="multiple"
              v-model:selected="selected">

            <template v-slot:top="table">
              <div class="row q-gutter-xs full-width">
                <q-input
                    clearable
                    outlined
                    dense
                    placeholder="请输入关键字搜索"
                    class="on-left"
                    @input="query"
                    debounce="500"
                    v-model="searchForm.roleName"
                >
                  <template #append>
                    <q-btn flat round icon="search" color="primary" @click="query" :loading="loading">
                      <q-tooltip>搜索</q-tooltip>
                    </q-btn>
                  </template>
                </q-input>


                <q-space/>
                <div class="q-gutter-xs">
                  <q-btn icon="add" no-wrap color="primary" label="新建" @click="add"/>

                  <q-btn

                      disable
                      no-wrap
                      v-show="$q.screen.gt.md"
                      color="negative"
                      label="批量删除"
                      @click="showConfirm()"
                      icon="delete_sweep">
                    <q-tooltip>系统内部数据,不能删除</q-tooltip>

                  </q-btn>
                  <q-btn
                      color="primary"
                      label="切换全屏"
                      no-wrap
                      v-show="$q.screen.gt.md"
                      @click="table.toggleFullscreen"
                      :icon="table.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
                  />
                  <q-btn-dropdown
                      color="primary"
                      label="自选列"
                      icon="view_list"
                      no-wrap
                      v-if="false"
                      v-show="$q.screen.gt.md">
                    <q-list>
                      <q-item tag="label" v-for="item in columns" :key="item.name">
                        <q-item-section avatar>
                          <q-checkbox v-model="group" :val="item.name"/>
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>{{ item.label }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-btn-dropdown>
                </div>
              </div>
            </template>

            <template #body-cell-status="props">
              <q-td :props="props" :auto-width="true">
                <q-toggle size="lg" v-model="props.row.status" :false-value="0"
                          :label="props.row.status === 1 ?'正常':'禁用'"
                          :true-value="1"/>
              </q-td>

            </template>
            <template #body-cell-opt="props">
              <q-td :props="props" :auto-width="true">
                <q-btn flat round dense color="primary" icon="edit" @click="edit(props.row)">
                  <q-tooltip>编辑</q-tooltip>
                </q-btn>
<!--                <btn-del :label="props.row.dictionaryItemName" @confirm="delPlus(props.row.dictionaryId)"/>-->
              </q-td>
            </template>

            <template #body-cell-createdTime="props">
              <q-td :props="props" :auto-width="true">
                {{ formatDate(props.row.createdTime, "yyyy-MM-dd") }}
              </q-td>
            </template>

          </q-table>
        </div>
        <!--   字典添加修改弹窗   -->
        <q-dialog maximized flat persistent ref="dialog">
          <q-form @submit="submit" class="dialog_card  q-ma-sm">
            <h5 class="view_title justify-between q-px-md">
              {{ editType }}字典信息
              <q-btn dense outline round icon="clear" size="sm" v-close-popup/>
            </h5>
            <q-scroll-area class="column" style="height: 80%">
              <div class="row q-col-gutter-x-md dialog_form q-pa-md">
                <div class="col-6">
                  <div>
                    <div>
                      <h5>字典名称:</h5>
                      <q-input outlined dense square clearable v-model="form.dictionaryItemName"
                               type="tel" :rules="[requiredTest]"/>
                    </div>
                  </div>
                </div>
                <div class="col-6">
                  <h5>字典类型:</h5>
                  <q-input outlined dense square clearable v-model="form.dictionaryType"
                           type="tel" :rules="[requiredTest]"/>
                </div>
                <div class="col-6">
                  <h5>字典状态:</h5>
                  <q-select map-options emit-value
                            v-model="form.status" filled
                            :options="[{label:'正常',value:1},{label:'禁用',value:0}]">
                  </q-select>
                </div>
                <div class="col-6">
                  <h5>排序:</h5>
                  <q-input outlined dense square clearable v-model="form.dictionaryItemOrder"
                           type="tel" :rules="[requiredTest]"/>
                </div>
                <div class="col-12">
                  <h5>备注:</h5>
                  <v-md-editor v-model="form.dictionaryItemValue" height="400px" :disabled-menus="[]"></v-md-editor>

                </div>
              </div>
            </q-scroll-area>
            <div class="row justify-center q-pa-md">
              <q-btn outline color="primary" icon="mdi-close-thick" label="关闭" v-close-popup/>
              <q-btn class="q-mx-sm" color="primary" icon="mdi-check-bold" :loading="loading" label="提交"
                     type="submit"/>
            </div>
          </q-form>
        </q-dialog>
        <confirm ref="confirmDialog" :msg="confirmMsg" @confirm="deleteBatchPlus"/>
      </template>

      <template v-slot:separator>
        <q-avatar color="primary" text-color="white" size="40px" icon="drag_indicator"/>
      </template>

      <!--    字典项  -->
      <template v-slot:after>
        <div class="q-pa-md">
          <Item :dict-item="dictItem"/>
        </div>
      </template>
    </q-splitter>

  </div>
</template>


<script>
import {defineComponent} from 'vue'
import {ellipsis, formatDate} from "@/boot/datatype";
import {getDictLabel} from "@/boot/dictionary";
import {requiredTest} from "@/boot/inputTest";
import {IndexMixin} from "@/boot/mixins";
import BtnDel from "@/components/btndel.vue";
import Confirm from "@/components/confirm.vue";
import Item from "@/views/system/dict/item.vue";

export default defineComponent({
  name: "index",
  mixins: [IndexMixin],
  components: {Item, Confirm, BtnDel},
  data() {
    return {
      dictItem: {},
      splitterModel: 40, // start at 50%,
      columns: [
        {name: 'index', align: 'center', label: '序号', field: 'index',},
        {name: 'dictionaryId', align: 'center', label: '字典id', field: 'dictionaryId',},
        {name: 'dictionaryType', align: 'center', label: '字典类型', field: 'dictionaryType',},
        {name: 'dictionaryCode', align: 'center', label: '字典代码', field: 'dictionaryCode',},
        {name: 'dictionaryItemName', align: 'center', label: '字典名称', field: 'dictionaryItemName',},
        {name: 'dictionaryItemValue', align: 'center', label: '字典值', field: 'dictionaryItemValue',},
        {name: 'dictionaryItemOrder', align: 'center', label: '字典排序', field: 'dictionaryItemOrder',},
        {name: 'status', align: 'center', label: '字典是否可用', field: 'status',},
        {name: 'createdTime', align: 'center', label: '创建时间', field: 'createdTime',},
        {name: 'opt', align: 'center', label: '操作', field: 'opt',},],
      showQuery: true,
      // headers: [{name: 'Authorization', value: localStorage.Authorization}],
      // uploadUrl: `${import.meta.env.VITE_BASEURL}/upload/multiple/oss/image`,
      photoMode: null,
      imgUrl: `${process.env.BASE_URL}/sys/common/static`,
      url: {
        list: '/sysTool/dict/list',
        add: '/sysTool/dict',
        edit: '/sysTool/dict',
        uploadUrl: '/file/upload',
        delete: '/sysTool/dict',
        deleteBatch: '/sysTool/dict',
        exportXlsUrl: '/sysTool/dict/export',
        importExcelUrl: '/sysTool/dict/import',
        getImportTemplate: '/sysTool/dict/get/exportTemplate',
      },
    }
  },
  created() {
    this.pagination.rowsPerPage = 100
    this.pagination.size = 100
    this.initDict()
  },
  methods: {
    formatDate,
    ellipsis,
    getDictLabel,
    requiredTest,
    initDict() {
      this.group =['index', 'dictionaryType', 'dictionaryItemName', 'opt']
    },

    meExportExcel() {
    },

    /**
     * 当前列内容
     */
    currentRow(evn, row, index) {
      this.dictItem = row;
    },


  },

})
</script>


<style scoped>

</style>