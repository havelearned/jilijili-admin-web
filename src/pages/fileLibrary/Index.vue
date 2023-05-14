<template>
  <q-page class="cc-admin row">
    <tree
      class="q-mt-sm q-mb-sm q-ml-sm"
      style="width:200px;"
      type="SysDepart"
      @select="selectCatalog"
    />
    <div class="col bg-white shadow-2 q-pa-md q-ma-sm">
      <q-table
        flat
        color="primary"
        class="cross_table"
        separator="cell"
        :columns="columns"
        :rows="list"
        row-key="id"
        v-model:pagination="pagination"
        :visible-columns="group"
        @request="query"
        :rows-per-page-options="[10,20,50,100]"
        :loading="loading"
        selection="multiple"
        v-model:selected="selected"
      >
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
              v-model="key"
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
              <!--              <q-btn
                              no-wrap
                              v-show="$q.screen.gt.sm"
                              label="导入"
                              icon="mdi-cloud-upload-outline"
                              :loading="importing"
                              color="primary"
                              @click="importExcel"
                            >
                              <q-uploader
                                auto-upload
                                ref="excelUploader"
                                :max-files="1"
                                class="hidden"
                                :url="importExcelUrlFull"
                                field-name="file"
                                :headers="headers"
                                @uploaded="importedExcel"
                              />
                            </q-btn>
                            <q-btn
                              no-wrap
                              v-show="$q.screen.gt.sm"
                              :loading="exporting"
                              label="导出"
                              icon="mdi-cloud-download-outline"
                              color="primary"
                              @click="exportExcel('音乐文件')"
                            />-->
              <q-btn
                :disable="selected.length === 0"
                no-wrap
                v-show="$q.screen.gt.md"
                color="negative"
                label="批量删除"
                @click="showConfirm()"
                icon="mdi-delete-variant"
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
                v-show="$q.screen.gt.md"
              >
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

        <template #body-cell-filepath="props">
          <q-td :props="props" :auto-width="true">
            <div>{{ ellipsis(props.row.filepath, 20) }}</div>
          </q-td>
        </template>
        <template #body-cell-filesize="props">
          <q-td :props="props" :auto-width="true">
            <div>{{ byteToMegaByte(props.row.filesize) }}</div>
          </q-td>
        </template>
        <template #body-cell-locked="props">
          <q-td :props="props" :auto-width="true">
            <q-btn-toggle
              v-model="props.row.locked"
              push
              glossy
              toggle-color="primary"
              :options="[{label: '可用', value: 0},{label: '不可用', value: 1},]"
            />
          </q-td>
        </template>
        <template #body-cell-opt="props">
          <q-td :props="props" :auto-width="true">
            <q-btn flat round dense color="primary" icon="edit" @click="editBefored(props.row)">
              <q-tooltip>编辑</q-tooltip>
            </q-btn>
            <btn-del :label="props.row.filename" @confirm="deleted(props.row)"/>
          </q-td>
        </template>


      </q-table>
    </div>

  </q-page>

</template>

<script>
import {IndexMixin} from "boot/mixins";
import BtnDel from "src/composables/btndel.vue";
import tree from "pages/fileLibrary/tree.vue";

export default {
  name:"fileLibrary",
  mixins: [IndexMixin],
  components: {
    BtnDel,
    tree
  },
  data() {
    return {
      columns: [
        {name: 'index', align: 'center', label: '序号', field: 'index',},
        {name: 'filename', align: 'center', label: '文件名称', field: 'filename',},
        {name: 'filepath', align: 'center', label: '源文件', field: 'filepath',},
        {name: 'type', align: 'center', label: '文件类型', field: 'type',},
        {name: 'filesize', align: 'center', label: '大小', field: 'filesize',},
        {name: 'locked', align: 'center', label: '是否可用', field: 'locked',},
        // {name: 'accessTime', align: 'center', label: '访问时间', field: 'accessTime',},
        {name: 'createdTime', align: 'center', label: '创建时间', field: 'createdTime',},
        {name: 'opt', align: 'center', label: '操作', field: 'opt',},
      ],
      url: {
        list: '/fileManage/list',
        add: '/fileManage/',
        edit: '/fileManage/',
        delete: '/fileManage/idList',
        deleteBatch: '/fileManage/idList',
        exportXlsUrl: '/sys/news/exportXls',
        importExcelUrl: '/sys/news/importExcel',
      },
    }
  },
  methods: {
    initDict(){

    },
    selectCatalog(n) {
      // this.form = { ...n };
      // this.form = {}
      this.searchForm.type = n.label;
      this.query(null);

      //
      // this.lock();
    },
  },
  mounted() {
    this.initDict();
  }
}


</script>
