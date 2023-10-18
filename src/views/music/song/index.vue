<template>
  <q-page class="cc-admin">
    <div class="col bg-white shadow-2 q-pa-md q-ma-sm">
      <q-table
          flat
          color="primary"
          class="cross_table"
          separator="cell"
          :columns="columns"
          :rows="list"
          row-key="songId"
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
            <q-input clearable outlined dense placeholder="请输入关键字搜索" class="on-left" debounce="500"
                     @input="query"
                     v-model="searchForm.name">
              <template #append>
                <q-btn flat round icon="search" color="primary" @click="query" :loading="loading">
                  <q-tooltip>搜索</q-tooltip>
                </q-btn>
              </template>
            </q-input>
            <div class="row no-wrap">
              <q-select clearable outlined dense class="on-left" debounce="500" emit-value map-options
                        @input="query"
                        :options="songStatus"
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
                  @click="exportExcel('歌曲数据')">
                <q-list>
                  <q-item clickable v-close-popup>
                    <q-btn
                        no-wrap
                        v-show="$q.screen.gt.sm"
                        :loading="exporting"
                        label="下载导入模板"
                        icon="file_download"
                        color="primary"
                        @click="meExportExcel('歌曲数据')"
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


        <!--   歌曲名称     -->
        <template #body-cell-name="props">
          <q-td :props="props">
            <q-btn flat dense color="primary" :label="props.row.name"
                   @click="showDetail(props.row)">
              <q-tooltip>查看详情</q-tooltip>
            </q-btn>
          </q-td>
        </template>

        <!--   歌曲状态    -->
        <template #body-cell-status="props">
          <q-td :props="props" auto-width>
            <div style="width: 200px">
              <q-btn-toggle @click="setStatus(props.row)" no-caps rounded unelevated color="white"
                            toggle-color="primary" text-color="primary"
                            class="my-custom-toggle" v-model="props.row.status" :options=songStatus>

              </q-btn-toggle>
            </div>
            <q-tooltip>修改状态</q-tooltip>
          </q-td>
        </template>

        <!--    歌词     -->
        <template #body-cell-lyric="props">
          <q-td :props="props">
            <div v-if="props.row.lyric">{{ ellipsis(props.row.lyric) }}</div>
            <div v-else>暂无歌词</div>
          </q-td>
        </template>

        <!--    音频文件    -->
        <template #body-cell-sourceFile="props">
          <q-td :props="props" auto-width>
            <div v-if="props.row.sourceFile" class=" q-ma-md row">
              <q-btn-group class="row column" push outline>
                <q-btn icon="play_circle" @click="playSong(props.row)">播放</q-btn>
                <q-btn size="xs" label="复制连接" @click="copyText(props.row.sourceFile)" flat/>
              </q-btn-group>
            </div>
            <div v-else>暂无音频</div>
          </q-td>
        </template>
        <template #body-cell-createdTime="props">
          <q-td :props="props">
            <div> {{ formatDate(props.row.createdTime, "yyyy-MM-dd") }}</div>
          </q-td>
        </template>


        <template #body-cell-opt="props">
          <q-td :props="props" :auto-width="true">
            <q-btn flat round dense color="primary" icon="edit" @click="editBefored(props.row)">
              <q-tooltip>编辑</q-tooltip>
            </q-btn>
            <btn-del :label="props.row.name" @confirm="deleted(props.row)"/>
          </q-td>
        </template>
      </q-table>
    </div>

    <q-dialog maximized flat persistent ref="dialog">

      <q-form @submit="submit" class="dialog_card  q-ma-sm">

        <h5 class="view_title justify-between q-px-md">
          {{ editType }}歌曲信息
          <q-btn dense outline round icon="clear" size="sm" v-close-popup/>
        </h5>
        <q-scroll-area class="column" style="height: 80%">
          <div class="row q-col-gutter-x-md dialog_form q-pa-md">
            <div class="col-6">
              <div>

                <div class="row" ref="testRef">
                  <div class="col-6 q-pa-md">
                    <h5>选择歌手</h5>
                    <selected :add-url="url.singerAddUrl" :list-url="url.singerListUrl"
                              ref="singerSelect"
                              v-model:model-value="form.singerList"/>
                  </div>

                  <div class="col-6 q-pa-md">
                    <h5>选择专辑</h5>
                    <selected :add-url="url.albumAddUrl" :list-url="url.albumListUrl" :select-type="Number(2)"
                              ref="albumSelect"
                              v-model:model-value="form.album"/>
                  </div>
                </div>

                <div class="row">
                  <div class=" col-6">
                    <h5>歌曲源文件:</h5>
                    <q-btn class="q-ma-md">
                      <q-file clearable filled bottom-slots v-model="songMode"
                              :label="form.sourceFile?`${getFileName(form.sourceFile)}`:'上传音频'" counter
                              max-files="1">
                        <template v-slot:hint>
                        </template>
                        <template v-slot:after>
                          <div class="row column">
                            <q-btn round dense flat label="上传" color="primary" @click="uploadFile(1)"/>
                            <q-btn round dense flat label="置空" color="primary" @click="form.sourceFile=''"/>
                          </div>
                        </template>
                      </q-file>
                    </q-btn>
                  </div>
                  <div class=" col-6">
                    <h5>歌词文件:</h5>
                    <q-btn class="q-ma-md">
                      <q-file clearable filled bottom-slots v-model="songLyric"
                              :label="editType==='编辑'?`${getFileName(form.lyric)}`:'上传歌词'" counter max-files="1">
                        <template v-slot:hint>
                        </template>
                        <template v-slot:after>
                          <div class="row column">
                            <q-btn round dense flat label="上传" color="primary" @click="uploadFile(2)"/>
                            <q-btn round dense flat label="置空" color="primary" @click="form.lyric=''"/>
                          </div>
                        </template>
                      </q-file>
                    </q-btn>
                  </div>
                </div>

                <div>
                  <h5>歌曲名称:</h5>
                  <q-input outlined dense square clearable v-model="form.name"
                           type="tel" :rules="[requiredTest]"/>
                </div>
                <div>
                  <h5>状态:</h5>
                  <q-select outlined dense emit-value map-options
                            :options="songStatus" v-model="form.status"/>
                </div>
              </div>
            </div>

            <div class="col-6">
              <h5>文本歌词:</h5>
              <v-md-editor v-model="form.lyric" height="400px" mode="edit"></v-md-editor>

            </div>
          </div>


        </q-scroll-area>
        <div class="row justify-center q-pa-md">
          <q-btn outline color="primary" icon="mdi-close-thick" label="关闭" v-close-popup/>
          <q-btn class="q-mx-sm" color="primary" icon="mdi-check-bold" :loading="loading" label="提交" type="submit"/>
        </div>
      </q-form>

      <q-inner-loading :showing="visible">
        <q-spinner-gears size="50px" color="primary"/>
      </q-inner-loading>
    </q-dialog>

  </q-page>
  <confirm ref="confirmDialog" :msg="confirmMsg" @confirm="deleteBatchBef()"/>
</template>

<script>
import {IndexMixin} from "@/boot/mixins";
import {ellipsis, formatDate, getFileName} from "@/boot/datatype";
import {getDictLabel} from "@/boot/dictionary";
import {requiredTest} from "@/boot/inputTest";
import Confirm from "@/components/confirm.vue";
import BtnDel from "@/components/btndel.vue";
import vMdEditor from '@kangc/v-md-editor'
import {useNotify} from "@/boot/useNotify";
import Cookie from "@/boot/cookie";
import aplayer from "@/layout/aplayer/index.vue";
import selected from '@/components/selected.vue'
import {ref} from "vue";

export default {
  name: "song",
  mixins: [IndexMixin],
  components: {
    BtnDel,
    Confirm,
    vMdEditor,
    aplayer,
    selected

  },
  data() {
    return {
      tab: '1',
      text: "12312",
      columns: [
        {name: 'index', align: 'center', label: '序号', field: 'index',},
        // {name: 'songId', align: 'center', label: '歌曲id', field: 'songId',},
        // {name: 'albumId', align: 'center', label: '专辑id', field: 'albumId',},
        {name: 'name', align: 'center', label: '歌曲名称', field: 'name',},
        {name: 'status', align: 'center', label: '歌曲状态', field: 'status',},
        {name: 'lyric', align: 'center', label: '歌词', field: 'lyric',},
        {name: 'sourceFile', align: 'center', label: '歌曲源文件', field: 'sourceFile',},
        {name: 'createdTime', align: 'center', label: '创建时间', field: 'createdTime',},
        {name: 'opt', align: 'center', label: '操作', field: 'opt',},],
      showQuery: true,
      // headers: [{name: 'Authorization', value: localStorage.Authorization}],
      // uploadUrl: `${import.meta.env.VITE_BASEURL}/upload/multiple/oss/image`,
      songStatus: [
        {label: '下架', value: 0},
        {label: '上架', value: 1},
        {label: '草稿', value: 2},
      ],
      songMode: null,
      songLyric: null,
      visible: false,
      singerSelect: ref(),
      albumSelect: ref(),
      imgUrl: `${process.env.BASE_URL}/sys/common/static`,
      url: {
        selectAlbumUrl: '/alibum/list',
        selectSingerUrl: '/singer/list',
        list: '/song/list',
        one: '/song/get',
        add: '/song',
        edit: '/song',
        editStatus: '/song/putStatus',
        uploadUrl: '/file/upload',
        delete: '/song',
        deleteBatch: '/song',
        exportXlsUrl: '/song/export',
        importExcelUrl: '/song/import',
        getImportTemplate: '/song/get/exportTemplate',
        singerAddUrl: '/singer',
        singerListUrl: '/singer/list',
        albumAddUrl: '/album',
        albumListUrl: '/album/list'
      },
      headers: {
        'Cookie': Cookie.getCookies(Cookie.TOKENNAME),
        'Accept': '*/*',
        'Host': 'localhost:8080',
        'Connection': 'keep-alive',
        'Content-Type': `multipart/form-data; boundary=--------------------------${new Date().getTime()}`,

      },
      isMouseOver: false,

    }
  },
  methods: {
    getFileName,
    formatDate,
    ellipsis,
    getDictLabel,
    requiredTest,
    initDict() {

    },
    /***
     * 播放歌曲
     * */
    playSong(row) {
      let temp = row;
      temp.sourceFile = temp.sourceFile.split("?")[0];
      temp.lyric = temp.lyric.split("?")[0];
      this.$bus.emit('send-songData', temp)
    },
    change(html, txt) {
      this.form.content = html;
      this.form.txtContent = txt;
    },
    /**
     * 复制文本
     * */
    copyText(text) {

      navigator.clipboard.writeText(text)
          .then(() => {
            useNotify().infoNotify('成功复制到剪贴板')
          })
          .catch((error) => {
            useNotify().warningNotify('复制失败')
          });
    },
    /**
     * 删除行
     * */
    deleted(row) {
      this.del({id: row.songId})
    },
    /**
     * 修改前
     * */
    editBefored(row) {
      this.edit(row)
      setTimeout(() => {
        this.$axios.get(`${this.url.one}?songId=${row.songId}`).then(res => {
          console.log("单条数据信息=>", res)
          if (res.flag) {
            this.form = res.data

            console.log(this.singerSelect)

            res.data.singerList.forEach(item => {
              this.$refs.singerSelect.changeModelToggle({
                label: item.name,
                value: item.singerId
              })
            })

            let album = res.data.album
            this.$refs.albumSelect.changeModelToggle({
              label: album.albumName,
              value: album.albumId
            })


          }
        }).catch(error => {
          console.log(error)
        }).finally(() => {
        })
      }, 1000)


    },
    /**
     * 更改文件
     */
    uploadFile(type) {

      if ((type === 1 && !this.songMode) || (type === 2 && !this.songLyric)) {
        useNotify().warningNotify("请求先选择文件")
        return;
      }
      this.visible = true
      const formdata = new FormData();

      if (type === 1) {
        formdata.append("files", this.songMode);
        this.form.name = this.songMode.name
      } else {
        formdata.append("files", this.songLyric);
      }

      this.$axios.post(this.uploadUrl, formdata, {
        headers: { //头部参数
          'Content-Type': `multipart/form-data; boundary=--------------------------${new Date().getTime()}`
        }
      }).then(res => {
        if (res.code === 200) {
          if (type === 1) {
            this.form.sourceFile = res.data[0]
          } else {
            this.form.lyric = res.data[0]
          }
        }
      }).catch(error => {
        useNotify().negativeNotify(error)
      }).finally(() => {
        this.visible = false
      })

    },

    meExportExcel(filename) {
      let tempUrl = this.url.exportXlsUrl
      this.url.exportXlsUrl = this.url.getImportTemplate
      this.exportExcel(filename)
      this.url.exportXlsUrl = tempUrl;

    },
    /**
     * 更改状态
     * @param row
     */
    setStatus(row) {
      if (!row) {
        return
      }
      this.$axios.put(this.url.editStatus, row).then(res => {
        if (res.flag) {
          useNotify().infoNotify(res.message)
        }
      }).catch(error => {
        console.log(error)
      })
    },
    // 批量删除前
    deleteBatchBef() {
      this.selected = this.selected.map(item => item.songId)
      this.deleteBatch()

    }

  },
  mounted() {
    this.initDict();
    for (let i = 0; i < 1; i++) {
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

</style>
