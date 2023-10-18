<template>
  <q-page class="cc-admin">
    <div class="col bg-white shadow-2 q-pa-md q-ma-sm">
      <q-table
          grid
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
                v-model="searchForm.name"
            >
              <template #append>
                <q-btn flat round icon="search" color="primary" @click="query" :loading="loading">
                  <q-tooltip>搜索</q-tooltip>
                </q-btn>
              </template>
            </q-input>
            <div class="row no-wrap">
              <q-select clearable outlined dense class="on-left" debounce="500"
                        @input="query"
                        :options="singerStatus"
                        emit-value
                        map-options
                        v-model="searchForm.status">
                <template #before><h6>状态</h6></template>
              </q-select>
            </div>

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
                  @click="exportExcel('歌手数据')">
                <q-list>

                  <q-item clickable v-close-popup>
                    <q-btn
                        no-wrap
                        v-show="$q.screen.gt.sm"
                        :loading="exporting"
                        label="下载导入模板"
                        icon="file_download"
                        color="primary"
                        @click="meExportExcel('歌手数据')"
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
                  icon="delete"
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

        <template v-slot:item="props">
          <div class="q-ma-xs" @mouseover="showBtnGroup(props.row.index)"
               @mouseleave="hideBtnGroup(props.row.index)">
            <q-card style="width: 292px">
              <q-separator/>

              <q-img :srcset="props.row.photo" :src="props.row.photo" height="200px" ratio="2" type="image/webp"
                     no-native-menu>
<!--                <q-icon class="absolute all-pointer-events" size="32px" name="info" color="white"-->
<!--                        style="top: 8px; left: 8px">-->
<!--                  <q-tooltip>-->
<!--                    Tooltip-->
<!--                  </q-tooltip>-->
<!--                </q-icon>-->
                <div class="absolute-bottom-right text-subtitle2">
                  <strong>{{ props.row.name }}</strong>
                </div>

                <template v-slot:error>
                  <div class="absolute-full flex flex-center bg-white text-white">
                    <q-img src="@/assets/images/error-default.png" no-native-menu></q-img>
                  </div>
                </template>
              </q-img>
              <q-btn-group push class="q-pa-lg-md" :id="`btnGroup-`+props.row.index" v-show="isMouseOver">
                <q-btn color="grey-7" size="ms">
                  <q-tooltip>选中</q-tooltip>
                  <div>{{ ellipsis(props.row.index) }}</div>
                  <q-checkbox v-model="selected" :val="props.row.singerId"/>
                </q-btn>
                <q-btn color="yellow-10" icon="updated" @click="edit(props.row)">
                  <q-tooltip>修改</q-tooltip>
                </q-btn>
                <q-btn color="negative" icon="deleted" @click="del({id:props.row.singerId})">
                  <q-tooltip>删除</q-tooltip>
                </q-btn>
                <q-btn color="info" @click="editStatus(props.row)">
                  <q-tooltip>修改状态</q-tooltip>
                  <q-toggle color="red" dark v-model="props.row.status" :val="props.row.status" size="xm"/>
                </q-btn>
              </q-btn-group>
              <q-card-section class="flex flex-center">
                <div>{{ ellipsis(props.row.desc) }}</div>
              </q-card-section>
            </q-card>

          </div>
        </template>
        <template #body-cell-opt="props">
          <q-td :props="props" :auto-width="true">
            <!--            <q-btn flat round dense color="primary" icon="edit" @click="editBefored(props.row)">
                          <q-tooltip>编辑</q-tooltip>
                        </q-btn>-->
            <btn-del label="新闻信息" @confirm="deleted(props.row)"/>
          </q-td>
        </template>
      </q-table>
    </div>

    <q-dialog maximized flat persistent ref="dialog">

      <q-form @submit="submit" class="dialog_card  q-ma-sm">

        <h5 class="view_title justify-between q-px-md">
          {{ editType }}歌手信息
          <q-btn dense outline round icon="clear" size="sm" v-close-popup/>
        </h5>
        <q-scroll-area class="column" style="height: 80%">
          <div class="row q-col-gutter-x-md dialog_form q-pa-md">
            <div class="col-6">
              <div>
                <div>
                  <q-inner-loading :showing="visible">
                    <q-spinner-gears size="50px" color="primary"/>
                  </q-inner-loading>

                  <div>
                    <q-btn>
                      <q-file clearable filled bottom-slots v-model="photoMode"
                              :label="editType==='编辑'?'点击修改':'上传'" counter max-files="1">
                        <template v-slot:hint>
                          歌手头像
                        </template>
                        <template v-slot:after>
                          <q-btn round dense flat label="上传" color="primary" @click="uploadPhoto"/>
                        </template>
                      </q-file>
                    </q-btn>
                    <q-avatar class="q-pa-md" size="150px">
                      <img :src="form.photo">
                    </q-avatar>
                  </div>

                  <h5>歌手名称:</h5>
                  <q-input outlined dense square clearable v-model="form.name"
                           type="tel" :rules="[requiredTest]"/>
                </div>
                <div>
                  <h5>状态:</h5>
                  <q-select outlined dense emit-value
                            :options="singerStatus" v-model="form.status" map-options/>
                </div>
              </div>
            </div>
            <div class="col-6">
              <h5>歌手介绍:</h5>
              <v-md-editor v-model="form.desc" height="400px" mode="edit"></v-md-editor>

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
import {ellipsis} from "@/boot/datatype";
import {getDictLabel} from "@/boot/dictionary";
import {requiredTest} from "@/boot/inputTest";
import Confirm from "@/components/confirm.vue";
import BtnDel from "@/components/btndel.vue";
import vMdEditor from '@kangc/v-md-editor'
import {useNotify} from "@/boot/useNotify";
import Cookie from "@/boot/cookie";

export default {
  name: "song",
  mixins: [IndexMixin],
  components: {
    BtnDel,
    Confirm,
    vMdEditor

  },
  data() {
    return {
      tab: '1',
      text: "12312",
      columns: [
        {name: 'index', align: 'center', label: '序号', field: 'index',},
        {name: 'singerId', align: 'center', label: 'id', field: 'singerId',},
        {name: 'name', align: 'center', label: '歌手', field: 'name',}, {
          name: 'desc', align: 'center', label: '简介', field: 'desc',
        }, {
          name: 'photo', align: 'center', label: '头像', field: 'photo',
        }, {
          name: 'status', align: 'center', label: '状态', field: 'status',
        }, {
          name: 'type', align: 'center', label: '类型', field: 'type',
        }, {
          name: 'createdTime', align: 'center', label: '创建时间', field: 'createdTime',
        }, {
          name: 'opt', align: 'center', label: '操作', field: 'opt',
        },],
      showQuery: true,
      // headers: [{name: 'Authorization', value: localStorage.Authorization}],
      // uploadUrl: `${import.meta.env.VITE_BASEURL}/upload/multiple/oss/image`,
      singerStatus: [
        {label: undefined, value: undefined},
        {label: '正常', value: '1'},
        {label: '停用', value: '0'},
      ],
      photoMode: null,
      imgUrl: `${process.env.BASE_URL}/sys/common/static`,
      url: {
        selectAlbumUrl: '/alibum/list',
        selectSingerUrl: '/singer/list',
        list: '/singer/list',
        add: '/singer',
        edit: '/singer',
        uploadUrl: '/file/upload',
        delete: '/singer',
        deleteBatch: '/singer',
        exportXlsUrl: '/singer/export',
        importExcelUrl: '/singer/import',
        getImportTemplate: '/singer/get/exportTemplate',
      },
      headers: {
        'Cookie': Cookie.getCookies(Cookie.TOKENNAME),
        'Accept': '*/*',
        'Host': 'localhost:8080',
        'Connection': 'keep-alive',
        'Content-Type': `multipart/form-data; boundary=--------------------------${new Date().getTime()}`,

      },
      isMouseOver: false,
      visible: false,
    }
  },
  methods: {
    ellipsis,
    getDictLabel,
    requiredTest,
    initDict() {

    },
    change(html, txt) {
      this.form.content = html;
      this.form.txtContent = txt;
    },
    singerSubmit() {

    },
    deleted(row) {
      console.log("删除的内容=>", row)
      this.del(row)
    },
    editBefored(row) {

    },
    uploadPhoto() {
      this.visible = true
      const formdata = new FormData();
      formdata.append("files", this.photoMode);

      this.$axios.post(this.uploadUrl, formdata, {
        headers: { //头部参数
          'Content-Type': `multipart/form-data; boundary=--------------------------${new Date().getTime()}`
        }
      }).then(res => {
        console.log(res)
        if (res.code === 200) {
          this.form.photo = res.data[0]
        }
      }).catch(error => {
        useNotify().negativeNotify(error)
      })
      this.visible = false
    },
    showBtnGroup(index) {
      let btnGroup = document.getElementById(`btnGroup-` + index)
      if (btnGroup) {
        btnGroup.style.display = "flex";
      }

    }, hideBtnGroup(index) {
      let btnGroup = document.getElementById(`btnGroup-` + index)
      if (btnGroup) {
        btnGroup.style.display = "none";
      }
    },
    meExportExcel(filename) {
      let tempUrl = this.url.exportXlsUrl
      this.url.exportXlsUrl = this.url.getImportTemplate
      this.exportExcel(filename)
      this.url.exportXlsUrl = tempUrl;

    }

  },
  mounted() {
    this.initDict();
    for (let i = 0; i < 20; i++) {
      this.list.push({
        id: i,
        name: "name" + i,
        status: 0,
        description: "des" + i,
        filepath: "url:" + i,
        createTime: new Date(),

      })
    }
  },


}


</script>

<style scoped lang="css">
.visible {

}
</style>
