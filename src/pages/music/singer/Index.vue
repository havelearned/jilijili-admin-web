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
      flat
      grid
      separator="cell"
      color="primary"
      row-key="id"
      class="q-pa-md-sm"
      selection="multiple"
      virtual-scroll
      @request="query"
      :rows="list"
      rows="id"
      :rows-per-page-options="[10,20,50,100]"
      :columns="columns"
      :loading="loading"
      v-model:selected="selected"
      :visible-columns="group"
      v-model:pagination="pagination"
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
            v-model="searchForm.singerName"
          >
            <template #append>
              <q-btn flat round icon="search" color="primary" @click="query" :loading="loading">
                <q-tooltip>搜索</q-tooltip>
              </q-btn>
            </template>
          </q-input>
          <q-space/>
          <div class="q-gutter-xs">
            <q-btn icon="add" no-wrap color="primary" label="新建" @click="openAdd"/>
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
          </div>
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
                <q-btn outline class="q-pa-sm" size="sm" color="brown" label="修改" @click="edit(props.row)"/>

                <q-btn class="q-pa-sm" size="sm" color="brown" label="歌手信息" @click="infoRow(props.row)"/>
                <btn-del :label="props.row.singerName" @confirm="del(props.row)"/>
                <q-checkbox style="margin-left: 20px" size="xl" color="brown" dense v-model="props.selected"
                            label="选中"/>
              </q-btn-group>
            </q-card-section>
            <q-separator/>

            <!-- 歌手内容 -->
            <q-card>
              <q-card-section class="text-center" @click="infoRow(props.row)">
                <q-img
                  ratio="1"
                  :srcset="props.row.singerPhoto+' 300w'">
                  <div class="absolute-bottom text-body1 text-center">
                    <div class="q-ma-lg q-pa-sm-lg">
                      <strong>{{ props.row.singerName }}</strong>
                    </div>
                  </div>
                  <template v-slot:error>
                    <div class="absolute-full flex flex-center grey-5 text-white">
                      <strong>{{ props.row.singerName }}</strong>
                      <strong>{{ ellipsis(props.row.singerDetails, 10) }}</strong>
                    </div>
                  </template>
                </q-img>
              </q-card-section>
              <q-separator/>
              <q-card-section class="flex flex-center" :style="{ fontSize: 13 + 'px' }">
                <div class="singer-profile-card">{{ ellipsis(props.row.singerDetails, 30) }}</div>
              </q-card-section>
            </q-card>
          </q-card>
        </div>
      </template>
    </q-table>

    <q-dialog maximized flat persistent v-model="isOpenAddDialog">
      <q-form @submit="submitBefore" class="dialog_card column bg-white">
        <h5 class="view_title justify-between q-px-md">
          {{ editType }}歌手
          <q-btn dense outline round icon="clear" size="sm" v-close-popup/>
        </h5>
        <q-scroll-area class="col">
          <div class="row q-col-gutter-x-md dialog_form q-pa-md">
            <div class="col-12">
              <h5>
                <q-icon name="star" color="red"/>
                歌手名称：
              </h5>
              <q-input
                clearable
                filled
                v-model="form.singerName"
                lazy-rules
                :rules="[ val => val && val.length > 0 || '歌手名称不能为空']"
              />
            </div>



            <br>
            <div class="col-12">
              <h5>歌手图片:</h5>
              <q-input type="url"
                       @click="selectFiles"
                       v-model="form.singerPhoto">
                <q-uploader
                  auto-upload
                  :headers="headers"
                  :url="uploadAttUrl"
                  :max-files="1"
                  field-name="files"
                  ref="fileUploader"
                  color="teal"
                  class="hidden"
                  flat
                  bordered
                  style="max-width: 300px"
                  @uploaded="uploadedFiles"
                />
              </q-input>
            </div>
            <div class="col-12">
              <h5>歌手介绍:</h5>
              <v-md-editor v-model="form.singerDetails" height="400px"></v-md-editor>
            </div>
          </div>
          <div class="col-12">
            <q-img
              v-for="(f,index) in attachments"
              :key="index"
              transition="fade"
              :src="f"
              style="width: 150px"
              ratio="1"
              spinner-color="white"
              class="rounded-borders"
            >
              <q-btn class="absolute-top text-right" dense round @click="deleteImage()"
                     icon="close"/>
              <div class="absolute-bottom text-center text-body2">{{ f }}</div>
            </q-img>
          </div>
        </q-scroll-area>

        <div class="row justify-center q-pa-md">
          <q-btn outline color="primary" icon="mdi-close-thick" label="关闭" v-close-popup/>
          <q-btn class="q-mx-sm" color="primary" icon="mdi-check-bold" label="提交" type="submit"/>
        </div>
      </q-form>
    </q-dialog>
    <q-dialog maximized flat persistent ref="dialog">
      <q-form @submit="submit" class="dialog_card column bg-white">
        <h5 class="view_title justify-between q-px-md">
          {{ editType }}歌手
          <q-btn dense outline round icon="clear" size="sm" v-close-popup/>
        </h5>
        <q-scroll-area class="col">
          <div class="row q-col-gutter-x-md dialog_form q-pa-md">
            <div class="col-12">
              <h5>
                <q-icon name="star" color="red"/>
                歌手名称：
              </h5>
              <q-input
                clearable
                filled
                v-model="form.singerName"
                lazy-rules
                :rules="[ val => val && val.length > 0 || '歌手名称不能为空']"
              />
            </div>


            <div class="col-12">
              <br>
              <q-icon name="star" color="red"/>
              <q-input type="url"
                       label="上传图片"
                       @click="selectFiles"
                       v-model="form.singerPhoto">
                <q-uploader
                  auto-upload
                  :headers="headers"
                  :url="uploadAttUrl"
                  :max-files="1"
                  field-name="files"
                  ref="fileUploader"
                  color="teal"
                  class="hidden"
                  flat
                  bordered
                  style="max-width: 300px"
                  @uploaded="uploadedFiles"
                />
              </q-input>
            </div>
            <div class="col-12">
              <h5>歌手介绍:</h5>
              <v-md-editor v-model="form.singerDetails" height="400px"></v-md-editor>
            </div>
            <br>
          </div>
          <div class="col-12">
            <q-img
              v-for="(f,index) in attachments"
              :key="index"
              transition="fade"
              :src="f"
              style="width: 150px"
              ratio="1"
              spinner-color="white"
              class="rounded-borders"
            >
              <q-btn class="absolute-top text-right" dense round @click="deleteImage()"
                     icon="close"/>
              <div class="absolute-bottom text-center text-body2">{{ f }}</div>
            </q-img>
          </div>
        </q-scroll-area>

        <div class="row justify-center q-pa-md">
          <q-btn outline color="primary" icon="mdi-close-thick" label="关闭" v-close-popup/>
          <q-btn class="q-mx-sm" color="primary" icon="mdi-check-bold" label="提交" type="submit"/>
        </div>
      </q-form>
    </q-dialog>
    <confirm ref="confirmDialog" :msg="confirmMsg" @confirm="deleteBatch()"/>
    <q-dialog v-model="isOpenInfoDialog" maximized flat persistent>
      <div class="dialog_card column bg-white">
        <h5 class="view_title justify-between q-px-md">
          {{ form.name }}
          <q-btn dense outline round icon="clear" size="sm" v-close-popup/>
        </h5>
        <q-scroll-area class="col">
          <div class="row q-col-gutter-x-md dialog_form q-pa-md">
            <div class="col-6">
              <q-img :src="form.singerPhoto"
                     spinner-color="white"
                     :ratio="1"
                     img-class="my-custom-image"
                     class="rounded-borders">
              </q-img>
            </div>
            <div class="col-6">
              <v-md-preview v-if="form.singerDetails" :text="form.singerDetails"></v-md-preview>
            </div>
          </div>
        </q-scroll-area>
        <div class="row justify-center q-pa-md">
          <q-btn outline color="primary" icon="mdi-close-thick" label="关闭" v-close-popup/>
        </div>
      </div>
    </q-dialog>
  </div>
</template>

<script>
import {IndexMixin} from "boot/mixins";
import Confirm from "src/composables/confirm.vue";
import {singer_type_selection} from "src/utils/dictionary";
import BtnDel from "src/composables/btndel.vue";
import {useNotify} from "src/composables/useNotify";

export default {
  mixins: [IndexMixin],
  components: {
    BtnDel, Confirm
  },
  props: {
    childHead: Boolean,
  },
  data() {
    return {
      columns: [
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
        {
          name: 'createdTime', align: 'center', label: '创建时间', field: row => row.createdTime,
          format: val => `${val}`, sortable: true
        },
      ],
      isOpenInfoDialog: false,
      isOpenAddDialog: false,
      loading: false,
      headers: [{name: 'Authorization', value: `Bearer ${this.$store.state.user.token}`}],
      uploadAttUrl: `${import.meta.env.VITE_BASEURL}/upload/multiple/minio`,
      attachments: [],
      markdownOption: {
        bold: true, // 粗体
      },
      url: {
        list: '/singer/list',
        add: '/singer/',
        edit: '/singer/',
        delete: '/singer/idList',
        deleteBatch: '/singer/idList',
        exportXlsUrl: '/sys/news/exportXls',
        importExcelUrl: '/sys/news/importExcel',
      },
    }
  },
  methods: {
    singer_type_selection() {
      return singer_type_selection
    },
    initDict() {
    },
    selectFiles() {
      this.$refs.fileUploader.pickFiles();
    },
    uploadedFiles({xhr}) {
      const response = JSON.parse(xhr.responseText);
      console.log("response=>", response)
      if (response.data) {
        useNotify().infoNotify("上传成功")
        this.attachments = response.data
        this.form.singerPhoto = this.attachments[0]
      } else {
        useNotify().negativeNotify("上传失败")
      }
      this.$refs.fileUploader.removeUploadedFiles();
    },
    deleteImage() {
      this.attachments.pop();
    },
    infoRow(row) {
      this.form = row;
      this.isOpenInfoDialog = true
    },
    openAdd() {
      this.form = {}
      this.editType = "新建"
      this.isOpenAddDialog = true
    },
    submitBefore() {
      this.submit()
      this.isOpenAddDialog = false;
    },
    initDcit() {
      // this.$api.get("/sys/dect/type","singer_type")
    }
  },
  mounted() {
    this.initDcit()

  }
}
</script>

<style scoped lang="less">
@import "src/css/music.less";
</style>
