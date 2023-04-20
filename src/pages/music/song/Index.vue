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
        row-key="id"
        :pagination="pagination"
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
        <template #body-cell-index="props">
          <q-td :props="props" :auto-width="true">
            <div>{{ ellipsis(props.row.index) }}</div>
          </q-td>
        </template>
        <template #body-cell-name="props">
          <q-td :props="props">
            <div>{{ ellipsis(props.row.name) }}</div>
          </q-td>
        </template>
        <template #body-cell-description="props">
          <q-td :props="props">
            <div>{{ ellipsis(props.row.description, 20) }}</div>
          </q-td>
        </template>
        <template #body-cell-musicFilepath="props">
          <q-td :props="props">
            <div>{{ ellipsis(props.row.musicFilepath, 20) }}</div>
            <q-btn>试听</q-btn>
          </q-td>
        </template>
        <template #body-cell-createdTime="props">
          <q-td :props="props">
            <div>{{ ellipsis(props.row.createdTime) }}</div>
          </q-td>
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
      <q-form @submit="musicSubmit" class="dialog_card column bg-white">
        <h5 class="view_title justify-between q-px-md">
          {{ editType }}歌曲信息
          <q-btn dense outline round icon="clear" size="sm" v-close-popup/>
        </h5>
        <q-scroll-area class="col">
          <div class="row q-col-gutter-x-md dialog_form q-pa-md">
            <div class="col-6">
              <h5>歌手选择：</h5>
              <SingerSearch multiple
                            :rules="requiredTest"
                            :url="url.selectSingerUrl"
                            ref="refSinger"></SingerSearch>
            </div>
            <div class="col-6">
              <h5>选择专辑</h5>
              <SingerSearch
                :url="url.selectAlbumUrl"
                :multiple="false" ref="refAlbum"></SingerSearch>
            </div>
            <div class="col-6">
              <h5>歌曲名称:</h5>
              <q-input outlined dense square clearable v-model="form.name"
                       type="tel" :rules="[requiredTest]"/>
            </div>
            <div class="col-6">
              <h5>状态：</h5>
              <q-select
                outlined
                dense
                emit-value
                v-model="form.status"
                map-options
                :options="musicStatus"
              />
            </div>
            <div class="col-6">
              <h5>歌词信息:</h5>
              <q-input outlined dense square clearable
                       v-model="form.description" type="textarea"/>
            </div>
            <div class="col-6">
              <h5>歌曲源文件:</h5>
              <FileUpload max-file="1"
                          ref="refFileUrl"
                          label="歌曲源文件"
                          accept="audio/*"
                          :verify="false"></FileUpload>

            </div>
          </div>
        </q-scroll-area>
        <div class="row justify-center q-pa-md">
          <q-btn outline color="primary" icon="mdi-close-thick" label="关闭" v-close-popup/>
          <q-btn class="q-mx-sm" color="primary" icon="mdi-check-bold" :loading="loading" label="提交" type="submit"/>
        </div>
      </q-form>
    </q-dialog>
    <confirm ref="confirmDialog" :msg="confirmMsg" @confirm="deleteBatch()"/>
  </q-page>

</template>

<script>
import {ellipsis} from 'boot/datatype';
import {requiredTest} from 'boot/inputTest';
import {getDictLabel} from 'boot/dictionary';
import {IndexMixin} from "boot/mixins";
import Confirm from "src/composables/confirm.vue";
import BtnDel from "src/composables/btndel.vue";
import SingerSearch from "src/composables/music/SingerSearch.vue";
import FileUpload from "src/composables/upload/FileUpload.vue";


export default {
  mixins: [IndexMixin],
  components: {
    FileUpload,
    SingerSearch,
    BtnDel,
    Confirm,


  },
  data() {

    return {
      columns: [
        {
          name: 'index',
          align: 'center',
          label: '序号',
          field: 'index',
        },
        {
          name: 'name', align: 'center', label: '歌曲名称', field: 'name',
        },
        {
          name: 'status', align: 'center', label: '歌曲状态', field: 'status',
        },
        {
          name: 'description', align: 'center', label: '歌词', field: 'description',
        },
        {
          name: 'musicFilepath', align: 'center', label: '歌曲源文件', field: 'musicFilepath',
        },

        {
          name: 'createdTime', align: 'center', label: '创建时间', field: 'createdTime',
        },
        {
          name: 'opt', align: 'center', label: '操作', field: 'opt',
        },
      ],
      audio: [
        {
          name: '东西（Cover：林俊呈）',
          artist: '纳豆',
          url: 'https://cdn.moefe.org/music/mp3/thing.mp3',
          cover: 'https://p1.music.126.net/5zs7IvmLv7KahY3BFzUmrg==/109951163635241613.jpg?param=300y300', // prettier-ignore
          lrc: 'https://cdn.moefe.org/music/lrc/thing.lrc',
        },
      ],

      showQuery: true,
      musicStatus: [{value: 2, label: '上架'}, {value: 0, label: '下架'}, {value: 1, label: '草稿'}],
      headers: [{name: 'Authorization', value: localStorage.Authorization}],
      uploadUrl: `${import.meta.env.VITE_BASEURL}/upload/multiple/oss/image`,
      imgUrl: `${process.env.BASE_URL}/sys/common/static`,
      url: {
        selectAlbumUrl: '/alibum/list',
        selectSingerUrl: '/singer/list',
        list: '/music/list',
        add: '/music/',
        edit: '/music/',
        delete: '/music/idList',
        deleteBatch: '/music/idList',
        exportXlsUrl: '/sys/news/exportXls',
        importExcelUrl: '/sys/news/importExcel',
      },
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
    musicSubmit() {
      this.form.singerId = this.$refs.refSinger.getFinalValues()
      if (this.$refs.refAlbum.getArrayObject()) {
        this.form.albumId = this.$refs.refAlbum.getArrayObject().value
      }
      this.loading = true
      this.$refs.refFileUrl.executeUploadFile().then(res => {
        this.form.musicFilepath = res[0]
        // TODO 添加修改
        setTimeout(() => {
          this.loading = false
          this.submit()
        }, 3000)
      })
    },
    deleted(row) {
      console.log("删除的内容=>", row)
      this.del(row)
    },
    editBefored(row) {


      this.localApi.get(`/music/queryMusicInfoById/${row.id}`).then(res => {
        console.log(res.data.musicFilepath)
        if (res.code === 200) {
          // 回填歌曲数据
          let time = new Date().getTime()
          this.$refs.refFileUrl.setMode({
            _key: time,
            name: res.data.musicFilepath,
            lastModified: time,
            lastModifiedDate: new Date(),
            size: 0,
            type: '*/*',
            webkitRelativePath: "",
          })

          // 回填专辑数据
          let fillData;
          let album = res.data.alibumVo
          if (album.id) {
            fillData = {label: album.albumName, value: album.id}
            this.$refs.refAlbum.fileInDataPlus(fillData)
          }

          // 回填歌手数据
          let singers = res.data.singerVos
          this.$refs.refSinger.fillInData(singers)
        }
      })

      this.edit(row);
    }
  },
  mounted() {
    this.initDict();
  },


}


</script>

<style lang="stylus">

</style>
