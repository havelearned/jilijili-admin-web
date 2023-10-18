<template>
  <q-page class="cc-admin">
    <div class="flex justify-center items-start  q-pa-md">
      <div class="bg-black text-white" style="width: 20vmin">
        <q-list dark bordered separator>
          <div class="row">
            <div class="text-h6 q-ma-md">目录</div>
            <q-space/>
            <div></div>
            <q-btn color="green" dense size="xs" @click="addDir">添加目录</q-btn>
          </div>

          <q-item clickable v-ripple
                  active-class="text-orange"
                  v-for="(dir,index) in fileTree" :active="activeName === dir.objectName">
            <div style="margin-left: 20px">
              <q-item-section @click="queryByFileDirPath(dir.objectName)">
                {{ dir.objectName }}
                <q-item-label>{{ dir.lastModified }}</q-item-label>
                <q-item-label v-show="dir.size !== 0">{{ dir.size }}</q-item-label>
              </q-item-section>

            </div>
          </q-item>
        </q-list>
      </div>
      <div class=" q-pa-md shadow-2 " style="width: 120vmin">
        <q-scroll-area style="height: 600px">
          <q-table
              separator="vertical"
              table-header-class="bg-black"
              @row-click="rowClick"
              :columns="columns"
              :rows="list"
              row-key="id"
              v-model:pagination="pagination"
              :visible-columns="group"
              @request="query"
              :rows-per-page-options="[10,20,50,100]"
              :loading="loading"

              v-model:selected="selected"
          >
            <template v-slot:top="table">
              <div class="row no-wrap full-width q-gutter-xs">

                <q-input clearable outlined dense placeholder="请输入文件类型"
                         class="on-left bg-white"
                         @input="query"
                         debounce="500"
                         v-model="searchForm.fileType">
                </q-input>
                <q-input clearable outlined dense placeholder="请输入文件名称搜索"
                         class="on-left bg-white"
                         @input="query"
                         debounce="500"
                         v-model="searchForm.fileName"
                >
                  <template #append>
                    <q-btn flat round icon="search" color="primary" @click="query" :loading="loading">
                      <q-tooltip>搜索</q-tooltip>
                    </q-btn>
                  </template>
                </q-input>

                <q-space/>
              </div>
            </template>

            <template #body-cell-fileName="props">
              <q-td :props="props" :auto-width="true">
                {{ ellipsis(props.row.fileName, 25) }}
              </q-td>
            </template>


            <template #body-cell-createdTime="props">
              <q-td :props="props" :auto-width="true">
                {{ formatDate(props.row.createdTime, 'yyyy-MM-dd') }}
              </q-td>
            </template>

            <template #body-cell-opt="props">
              <q-td :props="props" :auto-width="true">
                <q-btn flat round dense color="primary" icon="menu" @click="my_EditBefore(props.row)">
                  <q-tooltip>绑定菜单</q-tooltip>
                </q-btn>
                <q-btn flat round dense color="primary" icon="edit" @click="my_EditBefore(props.row)">
                  <q-tooltip>编辑</q-tooltip>
                </q-btn>
                <btn-del :label="props.row.title" @confirm="deleted(props.row)"/>
              </q-td>
            </template>
          </q-table>
        </q-scroll-area>

      </div>
      <filePreview v-show="currentRow" style="width: 200px" :file="currentRow" @show="showFilePreview" @query="query"/>
    </div>


    <!--  添加修改模态框   -->
    <q-dialog maximized flat persistent ref="dialog">
      <q-form @submit="mySubmit" class="dialog_card  q-ma-sm">
        <h5 class="view_title justify-between q-px-md">
          {{ editType }} 目录
          <q-btn dense outline round icon="clear" size="sm" v-close-popup/>
        </h5>
        <q-scroll-area class="column" style="height: 80%">
          <div class="row q-col-gutter-x-md dialog_form q-pa-md">

            <div class="col-12">
              <h5>目录名称:</h5>
              <q-input outlined dense square clearable v-model="form.filePath"
                       type="text" :rules="[dirRegEx]"/>
            </div>
          </div>


        </q-scroll-area>
        <div class="row justify-center q-pa-md">
          <q-btn outline color="primary" icon="mdi-close-thick" label="关闭" v-close-popup/>
          <q-btn class="q-mx-sm" color="primary" icon="mdi-check-bold" :loading="loading" label="提交" type="submit"/>
        </div>
      </q-form>
    </q-dialog>

  </q-page>
  <confirm ref="confirmDialog" :msg="confirmMsg" @confirm="deleteBatch()"/>
</template>

<script>


import {IndexMixin} from "@/boot/mixins";
import {ellipsis, formatDate} from "@/boot/datatype";
import {getDictLabel} from "@/boot/dictionary";
import {dirRegEx, requiredTest} from "@/boot/inputTest";
import Confirm from "@/components/confirm.vue";
import BtnDel from "@/components/btndel.vue";
import selected from "@/components/selected.vue";
import FilePreview from "@/views/source/filehub/filePreview.vue";
import Source from "@/boot/api/sys/source"
import {useNotify} from "@/boot/useNotify";

export default {
  name: "song",
  mixins: [IndexMixin],
  components: {
    FilePreview,
    selected,
    BtnDel,
    Confirm,


  },
  data() {
    return {
      currentRow: undefined,
      columns: [
        {name: 'index', align: 'center', label: '序号', field: 'index',},
        {name: 'fileId', align: 'center', label: '文件id', field: 'fileId',},
        {name: 'fileName', align: 'center', label: '文件名称', field: 'fileName',},
        {name: 'filePath', align: 'center', label: '文件路径', field: 'filePath',},
        {name: 'fileType', align: 'center', label: '文件类型', field: 'fileType',},
        {name: 'size', align: 'center', label: 'size', field: 'size',},
        {name: 'version', align: 'center', label: '文件版本', field: 'version',},
        {name: 'createdTime', align: 'center', label: '创建时间', field: 'createdTime',},
      ],
      fileTree: [
        {
          etag: '', objectName: '', lastModified: '', owner: '', size: 0, storageClass: '',
          versionId: '', userMetadata: {}, isDir: false, encodingType: '', latest: false
        },
      ],
      activeName: false,
      showQuery: true,
      // headers: [{name: 'Authorization', value: localStorage.Authorization}],
      // uploadUrl: `${import.meta.env.VITE_BASEURL}/upload/multiple/oss/image`,
      photoMode: null,
      imgUrl: `${process.env.BASE_URL}/sys/common/static`,
      url: {
        list: '/file/list',
        add: '/file/role',
        uploadUrl: '/file/upload',
        deleteBatch: '/file/role',
      },

    }
  },
  methods: {
    dirRegEx,
    formatDate,
    ellipsis,
    getDictLabel,
    requiredTest,
    initDict() {
      this.getFileTopDir();
      this.group = ['index', 'fileName', 'filePath', 'fileType',];
    },
    // 点击的当前列
    rowClick(index, row) {
      this.currentRow = row;


    },
    // 显示文件信息
    showFilePreview() {

    },
    change(html, txt) {
      this.form.content = html;
      this.form.txtContent = txt;
    },

    deleted(row) {
      console.log("删除的内容=>", row)
      this.del(row)
    },
    my_EditBefore(row) {
      this.edit(row)
    },
    /**
     * 顶级目录
     * @param filename
     */
    meExportExcel(filename) {
      let tempUrl = this.url.exportXlsUrl
      this.url.exportXlsUrl = this.url.getImportTemplate
      this.exportExcel(filename)
      this.url.exportXlsUrl = tempUrl;
    },
    /**
     * 获取顶级目录
     */
    getFileTopDir() {
      Source.getTopLevelDir().then(res => {
        this.fileTree = res.data;
      }).finally(() => {

      })
    },

    /**
     * 查询目录下的内容
     * */
    queryByFileDirPath(param) {
      this.activeName = param;
      this.searchForm.filePath = param;
      this.query()
      this.currentRow = undefined;
    },

    /**
     * 添加目录
     */
    addDir() {
      this.add();
    },
    mySubmit() {
      this.loading = true
      let param = [];
      param.push(this.form)
      Source.addFileDir(param).then(res => {
        if (res.flag) {
          useNotify().infoNotify(res.message)
        } else {
          useNotify().negativeNotify(res.message)
        }
        this.$refs.dialog.hide();
      }).finally(() => {
        this.loading = false;
        this.getFileTopDir()
      })
    }
  },
  mounted() {
    this.initDict();
  },


}


</script>

<style scoped lang="css">

</style>
