<template>
  <div>
    <q-page class="cc-admin">
      <div>
        <q-card class="my-card q-ma-sm">
          <q-card-section>
            <h5>评论审核</h5>
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
            row-key="commentId"
            v-model:pagination="pagination"
            :visible-columns="visibleColumns"
            @request="query"
            :rows-per-page-options="[10,20,50,100]"
            :loading="loading"
            selection="multiple"
            v-model:selected="selected">

          <template v-slot:top="table">
            <div class="row no-wrap full-width q-gutter-xs">
              <div class="col-1">
                <q-select dense map-options emit-value label="评论状态"
                          v-model="searchForm.commentStatus" filled
                          :options="status">
                </q-select>
              </div>

              <q-input clearable outlined dense placeholder="评论内容" class="on-left"
                       @input="query"
                       debounce="500"
                       v-model="searchForm.content">
                <template #append>
                  <q-btn flat round icon="search" color="primary" @click="query" :loading="loading">
                    <q-tooltip>搜索</q-tooltip>
                  </q-btn>
                </template>
              </q-input>
              <q-space/>
              <div class="q-gutter-xs">

                <!--                <q-btn no-wrap v-show="$q.screen.gt.sm" label="导入" icon="file_upload"
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
                                </q-btn>-->
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

                <q-btn :disable="this.selected.length<=0" no-wrap color="green" label="批量通过"       @click="batchPass"/>

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

          <template #body-cell-content="props">
            <q-td :props="props" style="width: 500px">
              <div>{{ ellipsis(props.row.content, 25) }}</div>
              <q-btn flat round color="blue">查看评论</q-btn>
            </q-td>
          </template>

          <template #body-cell-avatar="props">
            <q-td :props="props" auto-width>
              <q-img :src="props.row.avatar">
                <template v-slot:error>
                  头像连接过期
                  <q-tooltip anchor="top middle">头像连接过期</q-tooltip>
                </template>
              </q-img>
            </q-td>
          </template>

          <template #body-cell-commentStatus="props">
            <q-td :props="props" style="width: 100px">
              <q-btn-toggle
                  @click="editCommentStatus(props.row)"
                  v-model="props.row.commentStatus"
                  toggle-color="primary"
                  :options="status"
              />
            </q-td>
          </template>


          <template #body-cell-opt="props">
            <q-td :props="props" :auto-width="true">
              <q-btn flat round dense color="primary" icon="edit" @click="edit(props.row)">
                <q-tooltip>编辑</q-tooltip>
              </q-btn>
              <btn-del :label="`${props.row.nickname}的评论`" @confirm="delPlus(props.row.commentId)"/>
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
            {{ editType }}评论信息
            <q-btn dense outline round icon="clear" size="sm" v-close-popup/>
          </h5>
          <q-scroll-area class="column" style="height: 80%">
            <div class="row q-col-gutter-x-md dialog_form q-pa-md">
              <div class="col-6">
                <h5>用户昵称:</h5>
                <q-input disable outlined dense square clearable v-model="form.nickname"
                         type="tel" :rules="[requiredTest]"/>
              </div>

              <div class="col-6">
                <h5>用户头像:</h5>
                <div class="bg-grey-7">
                  <q-img :src="form.avatar" height="50px">
                    <template v-slot:error>
                      头像连接过期
                    </template>
                  </q-img>
                </div>
              </div>

              <div class="col-6">
                <h5>评论状态:</h5>
                <q-select map-options emit-value
                          v-model="form.commentStatus" filled
                          :options="status">
                </q-select>
              </div>
              <div class="col-12">
                <div>
                  <div>
                    <h5>评论内容:</h5>
                    <v-md-preview :text="form.content"></v-md-preview>
                  </div>
                </div>
              </div>
            </div>
          </q-scroll-area>
          <div class="row justify-center q-pa-md">
            <q-btn outline color="primary" icon="mdi-close-thick" label="关闭" v-close-popup/>
            <q-btn class="q-mx-sm" color="primary" icon="mdi-check-bold" :loading="loading" label="提交" type="submit"/>
          </div>
        </q-form>
      </q-dialog>
      <confirm ref="confirmDialog" :msg="confirmMsg" @confirm="m_deleteBatchPlus"/>
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
import vMdEditor from "@kangc/v-md-editor";
import {useNotify} from "@/boot/useNotify";

export default defineComponent({
  name: "tag",
  mixins: [IndexMixin],
  components: {vMdEditor, Confirm, BtnDel},
  data() {
    return {
      status: [
        {label: "正常", value: 1},
        {label: "禁止", value: 0},
        {label: "未审核", value: 2},

      ],
      visibleColumns: ['index', 'commentStatus', 'content',
        'nickname', 'avatar', 'gender', 'lastLoginIp', 'createdTime', 'opt'],
      columns: [
        {name: 'index', align: 'center', label: '序号', field: 'index',},
        {name: 'commentId', align: 'center', label: '评论id', field: 'commentId',},
        {name: 'content', align: 'center', label: '评论内容', field: 'content',},
        {name: 'articleId', align: 'center', label: '文章id', field: 'articleId',},
        {name: 'userId', align: 'center', label: '用户Id', field: 'userId',},
        {name: 'nickname', align: 'center', label: '用户昵称', field: 'nickname',},
        {name: 'avatar', align: 'center', label: '用户头像', field: 'avatar',},
        {name: 'gender', align: 'center', label: '用户性别', field: 'gender',},
        {name: 'lastLoginIp', align: 'center', label: '用户Ip', field: 'lastLoginIp',},
        {name: 'commentStatus', align: 'center', label: '评论状态', field: 'commentStatus',},
        {name: 'createdTime', align: 'center', label: '创建时间', field: 'createdTime',},
        {name: 'opt', align: 'center', label: '操作', field: 'opt',}],
      showQuery: true,
      // headers: [{name: 'Authorization', value: localStorage.Authorization}],
      // uploadUrl: `${import.meta.env.VITE_BASEURL}/upload/multiple/oss/image`,
      photoMode: null,
      imgUrl: `${process.env.BASE_URL}/sys/common/static`,
      url: {
        list: '/blog/comment/list',
        add: '/blog/comment',
        edit: '/blog/comment',
        uploadUrl: '/file/upload',
        delete: '/blog/comment',
        deleteBatch: '/blog/comment',
        exportXlsUrl: '/blog/comment/export',
        importExcelUrl: '/blog/comment/import',
        getImportTemplate: '/blog/comment/get/exportTemplate',
      },
    }
  },
  methods: {
    formatDate,
    ellipsis,
    getDictLabel,
    requiredTest,
    initDict() {
    },
    /**
     * 修改评论状态
     */
    editCommentStatus(row) {
      this.form = row;
      this.submit()
    },

    meExportExcel() {

    },
    m_deleteBatchPlus() {
      this.selected = this.selected.map(item => item.commentId)
      this.deleteBatchPlus()
    },
    batchPass() {
      useNotify().warningNotify("下个版本添加")
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