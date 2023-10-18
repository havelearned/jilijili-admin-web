<template>
  <div>
    <q-page class="cc-admin">
      <div>
        <q-card class="my-card q-ma-sm">
          <q-card-section>
            <h5>文章列表</h5>
          </q-card-section>
        </q-card>
      </div>
      <div class="q-pa-md">
        <q-table
            virtual-scroll
            flat
            color="primary"
            class="cross_table"
            separator="cell"
            :columns="columns"
            :rows="list"
            row-key="articleId"
            v-model:pagination="pagination"
            :visible-columns="visibleColumns"
            @request="query"
            :rows-per-page-options="[10,20,50,100]"
            :loading="loading"
            selection="multiple"
            @rowClick="currentRow"
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
                  v-model="searchForm.title"
              >
                <template #append>
                  <q-btn flat round icon="search" color="primary" @click="query" :loading="loading">
                    <q-tooltip>搜索</q-tooltip>
                  </q-btn>
                </template>
              </q-input>


              <q-space/>
              <div class="q-gutter-xs">
                <q-btn icon="add" no-wrap color="primary" label="新建" @click="m_add"/>
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

          <template #body-cell-picture="props">
            <q-td :props="props" :auto-width="true">
              <div v-if="props.row.picture">
                <q-btn flat round dense color="primary" @click="imgFixed=!imgFixed">查看图片</q-btn>
              </div>
              <div v-else>
                暂无内容
              </div>
            </q-td>
          </template>

          <template #body-cell-content="props">
            <q-td :props="props" :auto-width="true">
              <q-btn flat round dense color="primary" @click="fixed=!fixed">
                查看内容
              </q-btn>
            </q-td>

          </template>

          <template #body-cell-opt="props">
            <q-td :props="props" :auto-width="true">
              <q-btn flat round dense color="primary" icon="edit" @click="m_edit(props.row)">
                <q-tooltip>编辑</q-tooltip>
              </q-btn>
              <btn-del :label="props.row.title" @confirm="delPlus(props.row.articleId)"/>
            </q-td>
          </template>

          <template #body-cell-createdTime="props">
            <q-td :props="props" :auto-width="true">
              <div v-if="props.row.createdTime">
                {{ formatDate(props.row.createdTime, "yyyy-MM-dd") }}
              </div>

            </q-td>
          </template>

        </q-table>
      </div>


      <!--   字典添加修改弹窗   -->
      <q-dialog maximized flat persistent ref="dialog">
        <q-form @submit="submit" class="dialog_card  q-ma-sm">
          <h5 class="view_title justify-between q-px-md">
            {{ editType }}文章信息
            <q-btn dense outline round icon="clear" size="sm" v-close-popup/>
          </h5>
          <q-scroll-area class="column" style="height: 80%">
            <div class="row">

              <div class="col-6 column q-col-gutter-x-md dialog_form q-pa-md">
                <div class="">
                  <div>
                    <h5>文章名称:</h5>
                    <q-input outlined dense square clearable v-model="form.title"
                             type="text" :rules="[requiredTest]"/>
                  </div>
                </div>
                <div class="">
                  <h5>选择一个分类:</h5>
                  <q-select filled map-options emit-value
                            :options="categoryList"
                            v-model="form.categoryId">
                  </q-select>
                  <div v-if="!form.categoryId" class="text-red">
                    分类不能为空
                  </div>
                </div>
                <div class="">
                  <h5>选择多个标签:</h5>
                  <q-select filled multiple map-options use-chips
                            :options="tagList"
                            v-model="form.tagId"></q-select>
                </div>
                <div>
                  <div class="">
                    <h5>文章封面:</h5>
<!--                    <CustomFileUploadComponent @update:urls="updateUrls" :urls="form.picture" :multiple="false"-->
<!--                                               :max-files="1"/>-->
<!--                    <q-input disable v-model="form.picture"></q-input>-->
                  </div>
                </div>
              </div>

              <div class="col-6 q-col-gutter-x-md dialog_form q-pa-md">
                <div class="col-6">
                  <h5>内容:</h5>
                  <v-md-editor v-model="form.content" height="700px"></v-md-editor>
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


      <!--   文章内容弹窗    -->
      <q-dialog v-model="fixed" full-width>
        <q-card>
          <q-card-section>
            <div class="text-h2">
              {{ activeRow.title }}
            </div>
          </q-card-section>
          <q-separator/>
          <q-card-section style="max-height: 80%" class="scroll">
            <q-scroll-area style="height: 800px">
              <v-md-preview :text="activeRow.content" height="100%" ref="vMdPre"></v-md-preview>
            </q-scroll-area>
          </q-card-section>
          <q-separator/>
          <q-card-actions align="center">
            <q-btn flat label="关闭" color="primary" v-close-popup/>
          </q-card-actions>
        </q-card>
      </q-dialog>

      <!--   查看图片弹窗    -->
      <q-dialog v-model="imgFixed" full-width>
        <q-card>
          <q-card-section>
            <div class="text-h2">
              {{ activeRow.title }}

            </div>
          </q-card-section>
          <q-separator/>
          <q-card-section style="max-height: 80%" class="scroll">
            <q-img :src="activeRow.picture" height="800px"></q-img>
          </q-card-section>
          <q-separator/>
          <q-card-actions align="center">
            <q-btn flat label="关闭" color="primary" v-close-popup/>
          </q-card-actions>
        </q-card>
      </q-dialog>

      <confirm ref="confirmDialog" :msg="confirmMsg" @confirm="m_deleteBatch"/>
    </q-page>
  </div>
</template>


<script>
import {defineComponent} from 'vue'
import {ellipsis, formatDate} from "@/boot/datatype";
import blogApi from "@/boot/api/blog/article";
import {getDictLabel} from "@/boot/dictionary";
import {requiredTest} from "@/boot/inputTest";
import {IndexMixin} from "@/boot/mixins/indexV2";
import BtnDel from "@/components/btndel.vue";
import Confirm from "@/components/confirm.vue";
import vMdEditor from '@kangc/v-md-editor';
import selected from "@/components/selected.vue"
import CustomFileUploadComponent from "@/components/customFileUploadComponent.vue";

export default defineComponent({
  name: "tag",
  mixins: [IndexMixin],
  components: {
    CustomFileUploadComponent,
    Confirm, BtnDel,
    vMdEditor,
    selected
  },
  data() {
    return {
      categoryList: [],
      tagList: [],
      fixed: false,
      activeRow: {},
      imgFixed: false,
      visibleColumns: ['index', 'picture', 'title', 'content', 'viewCount', 'commentCount', 'createdTime', 'opt'],
      columns: [
        {name: 'index', align: 'center', label: '序号', field: 'index',},
        {name: 'articleId', align: 'center', label: '文章Id', field: 'articleId',},
        {name: 'userId', align: 'center', label: '用户Id', field: 'userId',},
        {name: 'nickname', align: 'center', label: '用户昵称', field: 'nickname',},
        {name: 'picture', align: 'center', label: '图片', field: 'picture',},
        {name: 'title', align: 'center', label: '文章名称', field: 'title',},
        {name: 'content', align: 'center', label: '文章内容', field: 'content',},
        {name: 'viewCount', align: 'center', label: '浏览量', field: 'viewCount',},
        {name: 'commentCount', align: 'center', label: '评论量', field: 'commentCount',},
        {name: 'createdTime', align: 'center', label: '创建时间', field: 'createdTime',},
        {name: 'opt', align: 'center', label: '操作', field: 'opt',}],
      showQuery: true,
      imgUrl: `${process.env.BASE_URL}/sys/common/static`,
      url: {
        list: '/blog/article/list',
        add: '/blog/article',
        edit: '/blog/article',
        uploadUrl: '/file/article',
        delete: '/blog/article',
        deleteBatch: '/blog/article',
        exportXlsUrl: '/blog/article/export',
        importExcelUrl: '/blog/article/import',
        getImportTemplate: '/blog/article/get/exportTemplate',
      },
    }
  },
  created() {
    this.initDict()
  },
  methods: {
    formatDate,
    ellipsis,
    getDictLabel,
    requiredTest,
    initDict() {
      this.getCategoryList()
      this.getTagList()
    },
    /**
     * 添加弹框前操作
     */
    m_add() {
      this.add();
    },
    /**
     * 文件上传回调
     * @param value
     */
    updateUrls(value) {
      this.form.picture = value
    },
    /**
     * 导出操作
     */
    meExportExcel() {

    },
    /**
     * 批量删除前操作
     */
    m_deleteBatch() {
      this.selected = this.selected.map(item => item.articleId)
      this.deleteBatchPlus()

    },
    /**
     * 初始化获取标签列表
     */
    getTagList() {
      this.$axiosPlus.get("/blog/tag/list?size=999").then(res => {
        let records = res.data.records
        if (res.data.records) {
          for (let item in records) {
            this.tagList.push({
              label: records[item].tagTitle,
              value: records[item].tagId,
            })
          }
        }
      }).catch(error => {
        console.log(error)
      })
    },
    /**
     * 初始化获取分类列表
     */
    getCategoryList() {
      this.$axiosPlus.get("/blog/category/list?size=999").then(res => {
        let records = res.data.records
        if (res.data.records) {
          for (let item in records) {
            this.categoryList.push({
              label: records[item].title,
              value: records[item].categoryId,
            })
          }
        }
      }).catch(error => {
        console.log(error)
      })
    },
    /**
     * 修改前获取服务器数据
     * @param row
     */
    m_edit(row) {
      blogApi.getArticleById(row.articleId).then(res => {
        this.edit(res.data)
      }).catch(error => {
        console.log(error)
      })
    },

    /**
     * 当前列内容
     */
    currentRow(evn, row, index) {
      console.log(this.$refs.vMdPre)
      this.activeRow = row;

    },
  },

})
</script>


<style scoped>

</style>