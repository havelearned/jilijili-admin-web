<template>
  <q-page class="cc-admin">

    <div class="col bg-white shadow-2 q-pa-md q-ma-sm">
      <q-table
          title="用户管理"
          flat
          color="primary"
          separator="cell"
          :columns="columns"
          :rows="list"
          row-key="userId"
          v-model:pagination="pagination"
          :visible-columns="group"
          @request="query"
          :rows-per-page-options="[10,20,50,100]"
          :loading="loading"
          selection="multiple"
          v-model:selected="selected">
        <template v-slot:top="table">
          <div class="row no-wrap full-width">
            <q-input clearable outlined dense placeholder="请输入关键字搜索" class="on-left" debounce="500"
                     @input="query"
                     v-model="searchForm.username">
              <template #append>
                <q-btn flat round icon="search" color="primary" @click="query" :loading="loading">
                  <q-tooltip>搜索</q-tooltip>
                </q-btn>
              </template>
            </q-input>
            <div class="row no-wrap">
              <q-select clearable outlined dense class="on-left" debounce="500" emit-value map-options
                        @input="query"
                        :options="userStatus"
                        v-model="searchForm.enabled">
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
                  @click="exportExcel('用户数据')">
                <q-list>
                  <q-item clickable v-close-popup>
                    <q-btn
                        no-wrap
                        v-show="$q.screen.gt.sm"
                        :loading="exporting"
                        label="下载导入模板"
                        icon="file_download"
                        color="primary"
                        @click="meExportExcel('用户数据')"
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


        <template #body-cell-userId="props">
          <q-td :props="props" v-show="false">
            {{ props.row.userId }}
          </q-td>
        </template>

        <template #body-cell-username="props">
          <q-td :props="props">
            <q-btn flat dense color="primary" :label="props.row.username"
                   @click="showDetail(props.row)">
              <q-tooltip>查看详情</q-tooltip>
            </q-btn>
          </q-td>
        </template>


        <template #body-cell-avatar="props">
          <q-td :props="props">
            <q-avatar size="70px">
              <img :src="props.row.avatar">
            </q-avatar>
          </q-td>
        </template>

        <template #body-cell-userType="props">
          <q-td :props="props">
            {{ findLoginType(props.row.userType) }}
          </q-td>
        </template>

        <template #body-cell-gender="props">
          <q-td :props="props">
            {{ findUserGender(props.row.gender) }}
          </q-td>
        </template>

        <template #body-cell-enabled="props">
          <q-td :props="props">
            {{ findUserStatus(props.row.enabled) }}
          </q-td>
        </template>

        <template #body-cell-opt="props">
          <q-td :props="props" :auto-width="true">

            <q-btn flat round dense color="amber" icon="admin_panel_settings" @click="editRole(props.row)">
              <q-tooltip>更改角色</q-tooltip>
            </q-btn>
            <q-btn flat round dense color="primary" icon="edit" @click="editBefored(props.row)">
              <q-tooltip>编辑</q-tooltip>
            </q-btn>
            <btn-del :label="props.row.username" @confirm="deleted(props.row)"/>
          </q-td>
        </template>
      </q-table>
    </div>

    <q-dialog maximized flat persistent ref="dialog">

      <q-form @submit="submit" class="dialog_card  q-ma-sm">

        <h5 class="view_title justify-between q-px-md">
          {{ editType }}用户信息
          <q-btn dense outline round icon="clear" size="sm" v-close-popup/>
        </h5>
        <q-scroll-area class="column" style="height: 80%">
          <div class="row q-col-gutter-x-md dialog_form q-pa-md">

            <div class="col-6 q-pa-md">
              <h5>用户名称:</h5>
              <q-input outlined dense square clearable v-model="form.username" :rules="[requiredTest]"></q-input>
            </div>
            <div class="col-6 q-pa-md">
              <h5>昵称名称:</h5>
              <q-input outlined dense square clearable v-model="form.nickname"/>
            </div>

            <div class="col-6 q-pa-md">
              <h5>用户登录类型:</h5>
              <q-select outlined dense emit-value map-options v-model="form.loginType" :options="longType"
                        :rules="[requiredTest]"/>
            </div>

            <div class="col-6 q-pa-md">
              <h5>性别:</h5>
              <q-select outlined dense emit-value map-options v-model="form.gender" :options="userGender"/>
            </div>

            <div class="col-6 q-pa-md">
              <h5>邮箱:</h5>
              <q-input outlined dense square clearable v-model="form.email" type="email"/>
            </div>
            <div class="col-6 q-pa-md">
              <h5>手机号:</h5>
              <q-input outlined dense square clearable v-model="form.phonenumber" type="number"/>
            </div>
            <div class="col-6 q-pa-md">
              <h5>状态:</h5>
              <q-select outlined dense emit-value map-options v-model="form.enabled" :options="userStatus"/>
            </div>
            <div class="col-12 q-pa-md">
              <h5>头像:</h5>
              <CustomFileUploadComponent v-model:urls="form.avatar" accept="image/*" :multiple="false"/>
            </div>


          </div>
        </q-scroll-area>
        <div class="row justify-center q-pa-md">
          <q-btn outline color="primary" icon="close" label="关闭" v-close-popup/>
          <q-btn class="q-mx-sm" color="primary" icon="done" :loading="loading" label="提交" type="submit"/>
        </div>
      </q-form>

      <q-inner-loading :showing="visible">
        <q-spinner-gears size="50px" color="primary"/>
      </q-inner-loading>
    </q-dialog>

    <q-dialog maximized flat persistent ref="roleDialog">
      <q-form @submit="submitRole" class="dialog_card  q-ma-sm">
        <h5 class="view_title justify-between q-px-md">
          更改权限
          <q-btn dense outline round icon="clear" size="sm" v-close-popup/>
        </h5>
        <q-scroll-area class="column" style="height: 80%">
          <div class="q-ma-md flex-center dialog_form ">
            <ColumnSelection :available-items="availableItems" :owned-items="this.form.ownedItems"/>
          </div>

        </q-scroll-area>
        <div class="row justify-center q-pa-md">
          <q-btn outline color="primary" icon="mdi-close-thick" label="关闭" v-close-popup/>
          <q-btn class="q-mx-sm" color="primary" icon="mdi-check-bold" :loading="loading" label="提交" type="submit"/>
        </div>
      </q-form>

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
import selected from '@/components/selected.vue';
import ColumnSelection from "@/components/columnSelection.vue";
import {ref} from "vue";
import CustomFileUploadComponent from "@/components/customFileUploadComponent.vue";

export default {
  name: "sysUser",
  mixins: [IndexMixin],
  components: {
    CustomFileUploadComponent,
    BtnDel,
    Confirm,
    vMdEditor,
    aplayer,
    selected,
    ColumnSelection,
  },
  computed: {},
  data() {
    return {
      tab: '1',
      text: "12312",
      columns: [
        {name: 'index', align: 'center', label: '序号', field: 'index',},
        // {name: 'userId', align: 'center', label: '用户id', field: 'userId',},
        {name: 'username', align: 'center', label: '用户名称', field: 'username',},
        {name: 'nickname', align: 'center', label: '昵称', field: 'nickname',},
        {name: 'userType', align: 'center', label: '用户类型', field: 'userType',},
        {name: 'avatar', align: 'center', label: '头像', field: 'avatar',},
        {name: 'gender', align: 'center', label: '性别', field: 'gender',},
        {name: 'email', align: 'center', label: '邮箱', field: 'email',},
        {name: 'phonenumber', align: 'center', label: '手机号', field: 'phonenumber',},
        {name: 'enabled', align: 'center', label: '状态', field: 'enabled',},
        {name: 'lastLoginIp', align: 'center', label: '最后登录ip', field: 'lastLoginIp',},
        {name: 'createdTime', align: 'center', label: '创建时间', field: 'createdTime',},
        {name: 'opt', align: 'center', label: '操作', field: 'opt',},],
      showQuery: true,
      // headers: [{name: 'Authorization', value: localStorage.Authorization}],
      // uploadUrl: `${import.meta.env.VITE_BASEURL}/upload/multiple/oss/image`,
      //     user_type       varchar(2)
      //     default '00' null comment '用户类型（00 游客、01 普通登录(系统)、02 qq、03 微信登录、04 gitee登录、05 github ）',
      userLongType: [
        {label: '普通用户', value: 'DEFAULT'},
        {label: 'qq用户', value: 'QQ'},
        {label: '微信用户', value: 'WX'},
        {label: 'gitee用户', value: 'GITEE'},
        {label: 'github用户', value: 'GITHUB'},
      ],
      longType: [
        {label: 'DEFAULT', value: 1},
        {label: 'QQ', value: 2},
        {label: 'WX', value: 3},
        {label: 'GITEE', value: 4},
        {label: 'GITHUB', value: 5},
      ],
      userStatus: [
        {label: '正常', value: 1},
        {label: '禁用', value: 0},
      ],
      userGender: [
        {label: '男', value: 1},
        {label: '女', value: 0},
      ],
      availableItems: [],
      songMode: null,
      visible: false,
      singerSelect: ref(),
      albumSelect: ref(),
      url: {
        list: '/sysUser/list',
        one: '/sysUser/get',
        add: '/sysUser',
        edit: '/sysUser',
        editStatus: '/sysUser/putStatus',
        uploadUrl: '/file/upload',
        delete: '/sysUser',
        deleteBatch: '/sysUser',
        exportXlsUrl: '/sysUser/export',
        importExcelUrl: '/sysUser/import',
        getImportTemplate: '/sysUser/get/exportTemplate',
        role: {
          list: '/sysUser/role/list',
          one: '/sysUser/get/role',
          updateUserRole: '/sysUser/role/update'
        }
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

    // 角色表单
    submitRole() {
      console.log("提交的表单", this.form)
      this.form.ownedItems = this.form.ownedItems.map(item => {
        return {
          roleId: item.id,
          title: item.text,
          roleName: item.icon
        }
      })
      this.$axios.put(`${this.url.role.updateUserRole}/${this.form.userId}`, this.form.ownedItems).then(res => {
        if (res.flag) {
          useNotify().positiveNotify(res.message)
        } else {
          useNotify().negativeNotify(res.message)
        }
      }).catch(error => {
        console.log(error)
      }).finally(() => {
        this.$refs.roleDialog.hide();
        this.query();

      })

    },
    // 修改角色前制操作
    editRole(row) {
      this.form = {}
      // 当前角色信息
      this.$axios.get(`${this.url.role.one}?id=${row.userId}`).then(res => {
        if (res.flag) {
          this.form.ownedItems = res.data.map(item => {
            return {
              id: item.roleId,
              text: item.title,
              icon: item.roleName
            }
          })
        }
      }).catch(error => {
        console.log(error)
      }).finally(() => {
        // 请求角色列表
        this.$axios.get(`${this.url.role.list}?size=1000`).then(res => {
          if (res.flag) {
            this.availableItems = res.data.records.map(item => {
              return {
                id: item.roleId,
                text: item.title,
                icon: item.roleName
              }
            })
          }
        }).catch(error => {
          console.log(error)
        }).finally(() => {
          // 去重
          this.availableItems = this.availableItems.filter(item => !this.form.ownedItems.some(ownedItem => ownedItem.id === item.id));
          this.form.userId = row.userId
          // 做角色交换
          this.$refs.roleDialog.show();
        })
      })
    },
    /**
     * 删除行
     * */
    deleted(row) {
      this.del({id: row.userId})
    },
    /**
     * 修改前
     * */
    editBefored(row) {
      this.form.loginType = row.userType
      console.log(this.form.loginType)

      this.edit(row)
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
    },
    findUserLoginType(type) {
      let user = this.userLongType.find((user) => user.value === type);
      return user ? user.label : '';
    },
    findLoginType(userType) {
      let user = this.longType.find((user) => user.value === userType);
      return user ? user.label : '';
    },
    findUserGender(gender) {
      let sex = this.userGender.find((user) => user.value === gender);
      return sex ? sex.label : '';
    },
    findUserStatus(status) {
      let stat = this.userStatus.find((s) => s.value === status);
      return stat ? stat.label : '';
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
