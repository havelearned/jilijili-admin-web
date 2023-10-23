<template>
  <q-page class="cc-admin">

    <div class="col bg-white shadow-2 q-pa-md q-ma-sm">
      <q-table
          title="通知记录"
          flat
          color="primary"
          class="cross_table"
          separator="cell"
          :columns="columns"
          :rows="list"
          row-key="notifyId"
          v-model:pagination="pagination"
          :visible-columns="group"
          @request="query"
          :rows-per-page-options="[10,20,50,100]"
          :loading="loading"
          selection="multiple"
          v-model:selected="selected"
      >
        <template v-slot:top="table">
          <div class="row no-wrap full-width q-gutter-md">
            <q-select dense v-model="searchForm.notifyType" :options="dictNotifyType" filled outlined emit-value
                      map-options>
              <template v-slot:before>
                <h5>通知类型:</h5>
              </template>
            </q-select>
            <q-select dense v-model="searchForm.notifyStatus" :options="dictNotifyStatus" filled outlined emit-value
                      map-options>
              <template v-slot:before>
                <h5>通知状态:</h5>
              </template>
            </q-select>
            <q-input clearable outlined dense placeholder="请输入用户名称搜索" class="on-left"
                     @input="query" debounce="500" v-model="searchForm.username">
              <template v-slot:before>
                <h5>用户搜索:</h5>
              </template>
            </q-input>
            <q-input clearable outlined dense placeholder="请输入通知内容搜索" class="on-left"
                     @input="query" debounce="500" v-model="searchForm.notifyContent">
              <template v-slot:before>
                <h5>通知内容:</h5>
              </template>

            </q-input>

            <div>
              <q-btn label="搜索" @click="query" :loading="loading"></q-btn>
              <q-btn label="重置" @click="searchForm={};query();"></q-btn>
            </div>


            <q-space/>
            <div class="q-gutter-xs">
              <q-btn icon="add" no-wrap color="primary" label="发布通知" @click="add"/>

              <q-btn no-wrap color="negative" label="批量删除" icon="delete"
                     :disable="selected.length === 0" v-show="$q.screen.gt.md"
                     @click="showConfirm()"
              />
              <q-btn color="primary" label="切换全屏" no-wrap v-show="$q.screen.gt.md"
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


        <template #body-cell-notifyContent="props">
          <q-td :props="props">
            {{ ellipsis(props.row.notifyContent, 24) }}
          </q-td>
        </template>

        <template #body-cell-createdTime="props">
          <q-td :props="props">
            {{ formatDate(props.row.createdTime, "yyyy-MM-dd") }}
          </q-td>
        </template>

        <template #body-cell-notifyType="props">
          <q-td :props="props">
            {{ getDictLabel(dictNotifyType, props.row.notifyType) }}
          </q-td>
        </template>

        <template #body-cell-notifyStatus="props">
          <q-td :props="props">
            <q-btn-toggle disable no-caps rounded unelevated toggle-color="primary" color="white"
                          class="my-custom-toggle"
                          text-color="primary"
                          v-model="props.row.notifyStatus"
                          :options="dictNotifyStatus"/>
          </q-td>
        </template>


        <template #body-cell-opt="props">
          <q-td :props="props">
            <q-btn v-if="props.row.notifyStatus === 2" flat round dense color="primary"
                   icon="publish "
                   @click="republish(props.row)">
              <q-tooltip>发布</q-tooltip>
            </q-btn>
            <q-btn flat round dense color="primary" icon="visibility " @click="detailsDialogShow(props.row)">
              <q-tooltip>查看详情</q-tooltip>
            </q-btn>
            <!--            <q-btn flat round dense color="primary" icon="edit" @click="my_EditBefore(props.row)">-->
            <!--              <q-tooltip>编辑</q-tooltip>-->
            <!--            </q-btn>-->
            <btn-del :label="props.row.title" @confirm="deleted(props.row)"/>
          </q-td>
        </template>
      </q-table>
    </div>

    <!--  添加修改弹出框   -->
    <q-dialog maximized flat persistent ref="dialog">
      <q-form @submit="_submit" class="dialog_card  q-ma-sm">
        <h5 class="view_title justify-between q-px-md">
          {{ editType }}通知
          <q-btn dense outline round icon="clear" size="sm" v-close-popup/>
        </h5>
        <q-scroll-area class="column" style="height: 80%">
          <div class="row q-col-gutter-x-md dialog_form q-pa-md">
            <div class="col-6">
              <div class="column">
                <div>
                  <h5>
                    <q-icon name="check_circle" color="red"></q-icon>
                    通知类型:
                  </h5>
                  <div class="q-gutter-sm">
                    <q-select dense v-model="form.notifyType" map-options emit-value
                              :rules="[requiredTest]" clearable
                              :options="dictNotifyType" outlined/>
                  </div>
                </div>
                <div>
                  <h5>
                    <q-icon name="check_circle" color="red"></q-icon>
                    设置状态:
                  </h5>
                  <div class="q-gutter-sm">
                    <q-select dense v-model="form.notifyStatus" map-options emit-value
                              :rules="[requiredTest]" clearable
                              :options="dictNotifyStatus" outlined/>
                  </div>

                </div>
              </div>

            </div>
            <div class="col-6">
              <div class="column">
                <div class="col-6">
                  <h5>
                    <q-icon name="check_circle" color="red"></q-icon>
                    发布方式:
                  </h5>
                  <div>
                    <q-radio v-model="form.publish" v-for="(mode,index) in dictSendMode" :key="index"
                             :val="mode.value" :label="mode.label"></q-radio>
                  </div>
                  <q-input v-if="form.publish === '3'" v-model="form.comparisonTime" filled type="date"

                           hint="不能小于当前时间两小时,小于等于15天"/>
                </div>
                <div class="col-6" v-if="form.notifyType === '2' ">
                  <h5>
                    <q-icon name="check_circle" color="red"></q-icon>
                    接收用户:
                  </h5>
                  <q-select
                      map-options clearable
                      filled multiple :options="[]" use-chips stack-label v-if="form.receiverId !== 1"
                      v-model="form.receiverIds">
                    <template v-slot:after>
                      <q-btn label="选择" @click="showUseDialog" color="blue"></q-btn>
                    </template>
                  </q-select>
                </div>
              </div>
            </div>


            <div class="col-12">
              <h5>
                <q-icon name="check_circle" color="red"></q-icon>
                内容:
              </h5>
              <v-md-editor v-model="form.notifyContent" height="400px"></v-md-editor>
            </div>
          </div>

        </q-scroll-area>
        <div class="row justify-center q-pa-md">
          <q-btn outline color="primary" icon="mdi-close-thick" label="关闭" v-close-popup/>
          <q-btn class="q-mx-sm" color="primary" icon="mdi-check-bold"
                 :loading="loading" label="提交" type="submit"/>
        </div>
      </q-form>
    </q-dialog>

    <q-dialog ref="detailsDialog" position="right">
      <q-card>
        <q-card-section>
          <q-list>
            <q-item>
              通知时间: {{ form.createdTime }}
            </q-item>
            <q-item>
              发布内容:
              <q-editor v-model="form.notifyContent" disable>
              </q-editor>
            </q-item>
          </q-list>
        </q-card-section>
        <q-card-section>
          <q-list>
            <q-item>
              发送者:
              <q-avatar>
                <q-img :src="form.senderUser.avatar"></q-img>
              </q-avatar>
              {{ form.senderUser.username }}
            </q-item>
            <q-item>
              接收者:
              <q-avatar>
                <q-img :src="form.senderUser.avatar"></q-img>
              </q-avatar>
              {{ form.receiverUser.username }}
            </q-item>
          </q-list>

        </q-card-section>


        <q-card-actions>
          <q-btn v-close-popup label="确定"></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
  <UserDialog ref="ud" @selectedUser="selectedUser"/>
  <confirm ref="confirmDialog" :msg="confirmMsg" @confirm="deleted"/>
</template>

<script>


import {IndexMixin} from "@/boot/mixins";
import {ellipsis, formatDate} from "@/boot/datatype";
import {getDictLabel} from "@/boot/dictionary";
import {requiredTest} from "@/boot/inputTest";
import Confirm from "@/components/confirm.vue";
import BtnDel from "@/components/btndel.vue";
import vMdEditor from '@kangc/v-md-editor'
import selected from "@/components/selected.vue";
import {addOrUpdateNotify, getDictItem, notifyPublishById} from "@/boot/api/sys/tool";
import UserDialog from "@/components/dialog/userDialog.vue"
import {useNotify} from "@/boot/useNotify";

export default {
  name: "record",
  mixins: [IndexMixin],
  components: {
    UserDialog,
    selected,
    BtnDel,
    Confirm,
    vMdEditor

  },
  data() {
    return {
      columns: [
        {name: 'index', align: 'center', label: '序号', field: 'index',},
        {name: "notifyId", align: 'center', label: '通知id', field: "notifyId",},
        {name: "senderId", align: 'center', label: '发送者id', field: "senderId",},
        {name: "receiverId", align: 'center', label: '响应者id', field: "receiverId",},
        {name: "notifyType", align: 'center', label: '通知类型', field: "notifyType",},
        {name: "notifyContent", align: 'center', label: '内容', field: "notifyContent",},
        {name: "notifyStatus", align: 'center', label: '状态', field: "notifyStatus",},
        {name: "createdTime", align: 'center', label: '通知时间', field: "createdTime",},
        {name: 'opt', align: 'center', label: '操作', field: 'opt',},],
      url: {
        list: '/sysTool/notify/list',
        add: '/sysTool/notify',
        edit: '/sysUser/role',
        deleteBatch: '/sysTool/notify',
      },
      dictNotifyStatus: [],
      dictNotifyType: [],
      dictSendMode: [],
      currentUser: {},
    }
  },
  methods: {
    formatDate,
    ellipsis,
    getDictLabel,
    requiredTest,
    initDict() {
      this.currentUser = this.$store.getters['user/getUserInfo'];
      this.group = [
        'index',
        // "notifyId","senderId","receiverId",
        "notifyType", "notifyContent",
        "notifyStatus", "createdTime", 'opt',]

      getDictItem("sys_notify_status").then(res => {
        this.dictNotifyStatus = res.data.map(item => {
          return {label: item.label, value: parseInt(item.value)}
        })
      })
      getDictItem("sys_notify_type").then(res => {
        this.dictNotifyType = res.data
      })
      getDictItem("sys_notify_send").then(res => {
        this.dictSendMode = res.data
      })

      console.log(this.dictNotifyStatus, this.dictNotifyType)
    },
    /**
     * 重新发布
     * @param row
     */
    republish(row) {
      notifyPublishById(row.notifyId).then(res => {
        if (res.flag) {
          useNotify().infoNotify(res.message)
        } else {
          useNotify().negativeNotify(res.message)
        }
      }).finally(() => {
        this.query()
      })


    },
    /**
     * 添加或者修改表单
     * @private
     */
    _submit() {
      this.loading = true
      if (this.form.receiverIds) {
        this.form.receiverIds = this.form.receiverIds.map(item => item.value)
      }
      // this.form.userId=this.currentUser.userId
      this.form.senderId = this.currentUser.userId

      console.log("提交的表单=>", this.form)
      addOrUpdateNotify(this.form).then(res => {
        if (res.flag) {
          useNotify().infoNotify(res.message)
        } else {
          useNotify().negativeNotify(res.message)
        }
      }).catch(error => {
        console.log(error)
      }).finally(() => {
        this.$refs.dialog.hide();
        this.loading = false
        this.searchForm.senderId = this.currentUser.userId
        this.query()

      })
    },
    selectedUser(dataReceived) {
      this.form.receiverIds = dataReceived
    },
    change(html, txt) {
      this.form.content = html;
      this.form.txtContent = txt;
    },
    showUseDialog() {
      this.$refs.ud.show();

    },
    deleted(row) {
      if (row) {
        this.selected.push(row)
      }
      this.showConfirm()
      this.selected = this.selected.map(item => item.notifyId)
      this.deleteBatchPlus()
      this.selected = []
    },
    my_EditBefore(row) {
      this.edit(row)
    },
    meExportExcel(filename) {
      let tempUrl = this.url.exportXlsUrl
      this.url.exportXlsUrl = this.url.getImportTemplate
      this.exportExcel(filename)
      this.url.exportXlsUrl = tempUrl;
    },
    detailsDialogShow(row) {
      this.$refs.detailsDialog.show()
      this.form = row;

    }
  },
  mounted() {
    this.initDict();
  },


}


</script>

<style scoped lang="css">

</style>
