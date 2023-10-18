<template>
  <div>
    <q-page class="cc-admin">
      <div>
        <q-card class="my-card q-ma-sm">
          <q-card-section>
            <h5>标签列表</h5>
          </q-card-section>
        </q-card>
      </div>
      <div class="q-pa-md">
        <q-table
            @row-click="currentRow"
            virtual-scroll
            flat
            color="primary"
            class="cross_table"
            separator="cell"
            :columns="columns"
            :rows="list"
            row-key="tagId"
            v-model:pagination="pagination"
            :visible-columns="visibleColumns"
            @request="query"
            :rows-per-page-options="[10,20,50,100]"
            :loading="loading"
            selection="multiple"
            v-model:selected="selected">

          <template v-slot:top="table">
            <div class="row no-wrap full-width">
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
                <q-btn no-wrap v-show="$q.screen.gt.sm" label="导入" icon="file_upload"
                       :loading="importing"
                       color="primary"
                       @click="importExcel"
                >
                  <q-tooltip>请选择Excel文件</q-tooltip>
                  <q-uploader
                      auto-upload
                      ref="excelUploader"
                      :max-files="1"
                      class="hidden"
                      :url="url.importExcelUrl"
                      field-name="file"

                      accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                      @uploaded="importedExcel"
                  />
                </q-btn>
                <q-btn-dropdown
                    split
                    no-wrap
                    v-show="$q.screen.gt.sm"
                    :loading="exporting"
                    label="导出"
                    icon="file_download"
                    color="primary"
                    @click="exportExcel('专辑数据')">
                  <q-list>

                    <q-item clickable v-close-popup>
                      <q-btn
                          no-wrap
                          v-show="$q.screen.gt.sm"
                          :loading="exporting"
                          label="下载导入模板"
                          icon="file_download"
                          color="primary"
                          @click="meExportExcel('专辑数据导入模板')"
                      />
                    </q-item>
                  </q-list>
                </q-btn-dropdown>


                <q-btn
                    :disable="selected.length === 0"
                    no-wrap
                    v-show="$q.screen.gt.md"
                    color="negative"
                    label="批量删除"
                    @click="showConfirm()"
                    icon="delete_sweep"
                />
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

          <template #body-cell-childId="props">
            <q-td :props="props" :auto-width="true">
              <q-btn flat round dense color="primary"  >
                查看子标签
              </q-btn>
            </q-td>
          </template>

          <template #body-cell-opt="props">
            <q-td :props="props" :auto-width="true">
              <q-btn flat round dense color="primary" icon="edit" @click="edit(props.row)">
                <q-tooltip>编辑</q-tooltip>
              </q-btn>
              <btn-del :label="props.row.tagTitle" @confirm="delPlus(props.row.tagId)"/>
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
            {{ editType }}标签信息
            <q-btn dense outline round icon="clear" size="sm" v-close-popup/>
          </h5>
          <q-scroll-area class="column" style="height: 80%">
            <div class="row q-col-gutter-x-md dialog_form q-pa-md">
              <div class="col-6">
                <div>
                  <div>
                    <h5>标签名称:</h5>
                    <q-input outlined dense square clearable v-model="form.tagTitle"
                             type="tel" :rules="[requiredTest]"/>
                  </div>
                </div>
              </div>
              <div class="col-6">
                <h5>标签颜色:</h5>
                <q-input outlined dense square clearable v-model="form.tagColor"
                         type="tel" />
              </div>
            </div>
          </q-scroll-area>
          <div class="row justify-center q-pa-md">
            <q-btn outline color="primary" icon="mdi-close-thick" label="关闭" v-close-popup/>
            <q-btn class="q-mx-sm" color="primary" icon="mdi-check-bold" :loading="loading" label="提交" type="submit"/>
          </div>
        </q-form>
      </q-dialog>
      <confirm ref="confirmDialog" :msg="confirmMsg" @confirm="m_deleteBatch"/>
    </q-page>
  </div>
</template>


<script>
import {defineComponent} from 'vue'
import {ellipsis, formatDate} from "@/boot/datatype";
import {getDictLabel} from "@/boot/dictionary";
import {requiredTest} from "@/boot/inputTest";
import {IndexMixin} from "@/boot/mixins/indexV2";
import BtnDel from "@/components/btndel.vue";
import Confirm from "@/components/confirm.vue";

export default defineComponent({
  name: "tag",
  mixins: [IndexMixin],
  components: {Confirm, BtnDel},
  data() {
    return {
      dictItemValue: '',
      splitterModel: 50, // start at 50%,
      visibleColumns: ['index','childId',  'tagTitle', 'status', 'createdTime', 'opt'],
      columns: [
        {name: 'index', align: 'center', label: '序号', field: 'index',},
        {name: 'tagTitle', align: 'center', label: '标签名称', field: 'tagTitle',},
        {name: 'tagId', align: 'center', label: '标签id', field: 'tagId',},
        {name: 'childId', align: 'center', label: '子标签Id', field: 'childId',},
        {name: 'createdTime', align: 'center', label: '创建时间', field: 'createdTime',},
        {name: 'opt', align: 'center', label: '操作', field: 'opt',}],
      showQuery: true,
      // headers: [{name: 'Authorization', value: localStorage.Authorization}],
      // uploadUrl: `${import.meta.env.VITE_BASEURL}/upload/multiple/oss/image`,
      photoMode: null,
      imgUrl: `${process.env.BASE_URL}/sys/common/static`,
      url: {
        list: '/blog/tag/list',
        add: '/blog/tag',
        edit: '/blog/tag',
        uploadUrl: '/file/upload',
        delete: '/blog/tag',
        deleteBatch: '/blog/tag',
        exportXlsUrl: '/blog/tag/export',
        importExcelUrl: '/blog/tag/import',
        getImportTemplate: '/blog/tag/get/exportTemplate',
      },
    }
  },
  mounted() {

  },
  methods: {
    formatDate,
    ellipsis,
    getDictLabel,
    requiredTest,
    initDict() {
    },

    meExportExcel() {

    },
    m_deleteBatch(){
      this.selected = this.selected.map(item=>item.tagId)
      this.deleteBatchPlus()

    },

    /**
     * 当前列内容
     */
    currentRow(evn, row, index) {


    },


  },

})
</script>


<style scoped>

</style>