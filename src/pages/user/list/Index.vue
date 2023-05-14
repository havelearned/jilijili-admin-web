<template>
  <q-page class="cc-admin q-pa-sm">
    <div class="col bg-white shadow-2 q-pa-md">
      <div class="row">
        <q-item class="col-xl-2 col-md-3 col-sm-6 col-xs-12 items-center">
          <q-item-label>账号：</q-item-label>
          <q-item-section>
            <q-input dense outlined v-model="searchForm.username"></q-input>
          </q-item-section>
        </q-item>
        <q-item class="col-xl-2 col-md-3 col-sm-6 col-xs-12 items-center">
          <q-item-label>昵称：</q-item-label>
          <q-item-section>
            <q-input dense outlined v-model="searchForm.nickname"></q-input>
          </q-item-section>
        </q-item>

        <q-item
          class="col-xl-2 col-md-3 col-sm-6 col-xs-12 items-center"
          v-show="showQuery"
          v-if="$q.screen.gt.md"
        >
          <q-item-label>性别：</q-item-label>
          <q-item-section>
            <q-select
              clearable
              outlined
              dense
              emit-value
              v-model="searchForm.gender"
              map-options
              :options="sex"
            />
          </q-item-section>
        </q-item>

        <q-item
          class="col-xl-2 col-md-3 col-sm-6 col-xs-12 items-center"
          v-show="showQuery"
          v-if="$q.screen.gt.md"
        >
          <q-item-label>状态：</q-item-label>
          <q-item-section>
            <q-select
              clearable
              outlined
              dense
              emit-value
              v-model="searchForm.unseal"
              map-options
              :options="userStatus"
            />
          </q-item-section>
        </q-item>


        <q-item class="col-xl-3 col-md-3 col-sm-6 col-xs-12 items-center">
          <q-item-section>
            <div class="row no-wrap justify-center">
              <q-btn
                unelevated
                class="q-mr-sm no-border-radius"
                color="primary"
                icon="search"
                label="查询"
                :loading="loading"
                @click="query()"
              />
              <q-btn
                no-wrap
                outline
                unelevated
                class="q-mr-sm no-border-radius"
                color="secondary"
                icon="refresh"
                label="重置"
                @click="searchReset"
              />
              <q-btn-dropdown
                v-model="showQuery"
                persistent
                dense
                flat
                color="primary"
                :label="tableLabel"
                @before-show="show"
                @before-hide="hide"
                v-if="$q.screen.gt.md"
              ></q-btn-dropdown>
            </div>
          </q-item-section>
        </q-item>
      </div>
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
        <template #top-right="table">
          <div class="q-gutter-xs">
            <q-btn icon="add" no-wrap color="primary" label="新建" @click="add"/>
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
        </template>

        <template #body-cell-index="props">
          <q-td :props="props" :data-label="props.col.label">{{ props.value }}</q-td>
        </template>
        <template #body-cell-username="props">
          <q-td :props="props" :data-label="props.col.label">{{ props.value }}</q-td>
        </template>
        <template #body-cell-nickname="props">
          <q-td :props="props" :data-label="props.col.label">{{ props.value }}</q-td>
        </template>
        <template #body-cell-lastLoginIp="props">
          <q-td :props="props" :data-label="props.col.label">{{ props.value }}</q-td>
        </template>
        <template #body-cell-lastLoginTime="props">
          <q-td :props="props" :data-label="props.col.label">{{ props.value }}</q-td>
        </template>
        <!--        <template #body-cell-avatar="props">
                  <q-td key="avatar" :props="props" :data-label="props.col.label">
                    <q-avatar v-if="props.row.avatar">
                      <img style="width: 30px;height: 30px;" :src="imagePath(props.row.avatar)"/>
                    </q-avatar>
                  </q-td>
                </template>-->
        <template #body-cell-gender="props">
          <q-td
            key="gender"
            :props="props"
            :data-label="props.col.label"
          >{{ getDictLabel(sex, props.row.gender) }}
          </q-td>
        </template>
        <template #body-cell-unseal="props">
          <q-td
            key="unseal"
            :props="props"
            :data-label="props.col.label"
          >{{ getDictLabel(userStatus, props.row.unseal) }}
          </q-td>
        </template>
        <template #body-cell-opt="props">
          <q-td :props="props" :auto-width="true" :data-label="props.col.label">
            <q-btn flat round dense color="primary" icon="mdi-key" @click="change(props.row)">
              <q-tooltip>重置密码</q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              dense
              color="primary"
              icon="engineering"
              @click="editUserRole(props.row)"
            >
              <q-tooltip>分配角色</q-tooltip>
            </q-btn>
            <q-btn flat round dense color="primary" icon="edit" @click="edit(props.row)">
              <q-tooltip>编辑</q-tooltip>
            </q-btn>
            <btn-del label="用户表" @confirm="del(props.row)"/>
          </q-td>
        </template>
      </q-table>
    </div>
    <q-dialog ref="changePassWord" maximized flat persistent>
      <q-form @submit="changePassWord" class="dialog_card column bg-white">
        <div class="view_title justify-between q-px-md">
          修改密码
          <q-btn dense outline round size="sm" icon="clear" v-close-popup/>
        </div>
        <q-scroll-area class="col">
          <div class="col row q-col-gutter-x-md dialog_form q-pa-md">
            <div class="col-12">
              <h5>用户账号：</h5>
              <q-input outlined readonly dense v-model="selectUser.username"/>
            </div>
            <div class="col-12">
              <h5>用户姓名：</h5>
              <q-input outlined readonly dense v-model="selectUser.nickname"/>
            </div>

            <div class="col-6">
              <h5>
                <q-icon name="star" color="red"/>
                密码：
              </h5>
              <q-input
                outlined
                dense
                type="password"
                v-model="password"
                :rules="[v => !!v || '不可以为空']"
              />
            </div>
            <div class="col-6">
              <h5>
                <q-icon name="star" color="red"/>
                确认密码：
              </h5>
              <q-input
                outlined
                dense
                type="password"
                v-model="confirmpassword"
                :rules="[v => !!v || '不可以为空']"
                :error="!isValid"
              >
                <template v-slot:error>两次输入密码不一致！</template>
              </q-input>
            </div>
          </div>
        </q-scroll-area>
        <div class="row justify-center q-pa-md">
          <q-btn outline color="primary" icon="mdi-close-thick" label="关闭" v-close-popup/>
          <q-btn class="q-mx-sm" color="primary" icon="mdi-check-bold" label="提交" type="submit"/>
        </div>
      </q-form>
    </q-dialog>
    <q-dialog maximized flat persistent ref="dialog">
      <q-form @submit="submit" :class="dialogSize" class="bg-white">
        <h5 class="view_title justify-between q-px-md">
          {{ editType }}用户
          <q-btn dense outline round icon="clear" size="sm" v-close-popup/>
        </h5>
        <q-scroll-area class="col">
          <div class="row q-col-gutter-x-md dialog_form q-pa-md">
            <div class="col-6">
              <h5>
                <q-icon name="star" color="red"/>
                登录账号：
              </h5>
              <q-input
                outlined
                dense
                square
                clearable
                v-model="form.username"
                type="text"
                :rules="[usernameTest]"
              />
            </div>
            <div class="col-6">
              <h5>
                昵称：
              </h5>
              <q-input
                outlined
                dense
                square
                clearable
                v-model="form.nickname"
                type="text"
              />
            </div>
            <div v-if="editType==='新建'" class="col-6">
              <h5>
                <q-icon name="star" color="red"/>
                密码：
              </h5>
              <q-input
                outlined
                dense
                v-model="form.password"
                type="password"
                :rules="[passwordTest]"
              />
            </div>
            <div class="col-6">
              <h5>性别：</h5>
              <q-select outlined dense emit-value v-model="form.gender" map-options :options="sex"/>
            </div>
            <div class="col-6">
              <h5>状态：</h5>
              <q-select
                outlined
                dense
                emit-value
                v-model="form.unseal"
                map-options
                :options="userStatus"
              />
            </div>
          </div>
        </q-scroll-area>
        <div class="row justify-center q-pa-md">
          <q-btn outline color="primary" icon="mdi-close-thick" label="关闭" v-close-popup/>
          <q-btn class="q-mx-sm" color="primary" icon="mdi-check-bold" label="提交" type="submit"/>
        </div>
      </q-form>
    </q-dialog>


    <listselect
      ref="listselectDialog"
      :unselectedList="unselectedRoleList"
      :selectList="selectedRoleList"
      :msg="selectTitle"
      @saveSelect="setRoles"
    />
    <confirm ref="confirmDialog" :msg="confirmMsg" @confirm="deleteBatch()"/>
  </q-page>
</template>

<script>
import Confirm from "src/composables/confirm.vue";
import {IndexMixin} from "boot/mixins";
import {getDictLabel} from "boot/dictionary";
import BtnDel from "src/composables/btndel.vue";
import {passwordTest, requiredTest, usernameTest} from "boot/inputTest";
import listselect from "src/composables/listselect.vue";

export default {
  name: "list",
  mixins: [IndexMixin],
  components: {
    BtnDel,
    Confirm,
    listselect,
  },
  data() {
    return {
      showQuery: true,
      tableLabel: '展开',
      columns: [{name: 'index', align: 'center', label: '序号', field: 'index',},
        {name: 'username', align: 'left', label: '账号', field: 'username',},
        {name: 'nickname', align: 'left', label: '昵称', field: 'nickname',},
        {name: 'gender', align: 'left', label: '性别', field: 'gender',},
        {name: 'unseal', align: 'left', label: '是否可用', field: 'unseal',},
        {name: 'lastLoginIp', align: 'left', label: '登录ip', field: 'lastLoginIp',},
        {name: 'lastLoginTime', align: 'left', label: '登录时间', field: 'lastLoginTime',},
        {name: 'opt', align: 'center', label: '操作', field: 'id',},
      ],
      sex: [{value: 'UNKNOWN', label: '未知'}, {value: 'ALL', label: '男女皆可'}, {
        value: 'MALE',
        label: '男'
      }, {value: 'FEMALE', label: '女'},],
      userStatus: [{value: 1, label: '正常'}, {value: 0, label: '冻结'}],
      selectUser: {},
      password: '',
      confirmpassword: '',
      selectTitle: '',
      roleList: [],
      unselectedRoleList: [],
      selectedRoleList: [],
      url: {
        list: '/users/list',
        add: '/users/',
        edit: '/users/',
        delete: '/users',
        deleteBatch: '/users'
      },
    }
  },
  computed: {
    isValid() {
      return this.confirmpassword === this.password;
    },
  },
  methods: {
    usernameTest,
    passwordTest,
    requiredTest,

    getDictLabel,
    change(row) {
      this.password = '';
      this.confirmpassword = '';
      this.selectUser = row;
      this.$refs.changePassWord.show();
    },
    editUserRole(row) {
      this.selectUser = row
      const {userRoleIdList} = row
      this.unselectedRoleList = [];
      this.selectedRoleList = [];
      this.selectTitle = `用户[${row.nickname}]分配角色`;
      this.roleList.forEach((role) => {
        if (userRoleIdList.includes(role.value)) {
          this.selectedRoleList.push(role);
        } else {
          this.unselectedRoleList.push(role);
        }
      });
      this.$refs.listselectDialog.show();

    },
    // 重置密码
    changePassWord() {
      // this.$axios.put('/sys/user/changePassword', {
      //   confirmpassword: this.confirmpassword,
      //   password: this.password,
      //   username: this.selectUser.username,
      // }).then((r) => {
      //   useNotify(r.message);
      //   this.$refs.changePassWord.hide();
      // });
    },
    setRoles(roleList) {
      const selectedRoles = [];
      if (roleList && roleList.length > 0) {
        roleList.forEach((role) => {
          selectedRoles.push(role.value);
        });
      }
      /* this.$axios.put(`${this.url.setUserRoles}?userId=${this.selectUser.id}&selectedRoles=${selectedRoles.join(',')}`)
         .then((r) => {
           if (r.success) {
             this.$refs.listselectDialog.hide();
             this.query();
           }
           this.$info(r.message);
         });*/

      console.log("selectedRoles=>", selectedRoles)
      this.$refs.listselectDialog.hide();
    }
  }
}
</script>

<style scoped>

</style>
