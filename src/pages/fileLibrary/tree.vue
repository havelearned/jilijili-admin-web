<template>
  <div class="q-pa-md bg-white shadow-1">
    <q-splitter v-model="splitterModel" unit="px" horizontal>
      <template v-slot:before>
        <div class="row no-wrap items-center">
          <div class="text-subtitle1" v-if="$q.screen.gt.md">文件管理</div>
          <q-space/>
<!--          <div class="col row q-gutter-sm justify-end">-->
<!--            <q-btn dense class="q-mx-xs" color="primary" icon="add" label="添加部门" @click="addCatalog()"/>-->
<!--            <q-btn dense class="q-mx-xs" color="primary" icon="add" label="添加下级" @click="addCatalog('son')"/>-->
<!--            <q-btn dense class="q-mx-xs" color="primary" icon="edit" label="修改" @click="updateCatalog()"/>-->
<!--            <q-btn dense class="q-mx-xs" color="negative" icon="delete" label="删除" :disable="selected ===''"-->
<!--                   @click="showConfirm()"/>-->
<!--          </div>-->
        </div>
      </template>
      <template v-slot:after>
        <q-tree
          ref="qTree"
          :nodes="allCatalogList"
          node-key="label"
          label-key="label"
          selected-color="primary"
          :selected="selected"
          @update:selected="select"
        />
      </template>
    </q-splitter>
  </div>
</template>

<script>


import {useNotify} from "src/composables/useNotify";

export default {
  name: 'SysDepart',
  components: {
    confirm,
  },
  props: {
    type: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      splitterModel: 30,
      columns: [
        {
          name: 'index',
          align: 'center',
          label: '序号',
          field: 'index',
        },
        {
          name: 'departName', align: 'left', label: '部门名称', field: 'departName',
        },
        {
          name: 'parentId', align: 'left', label: '上级编号', field: 'parentId',
        },
        {
          name: 'type', align: 'left', label: '类别', field: 'type',
        },
        {
          name: 'opt', align: 'center', label: '操作', field: 'id',
        },
      ],
      selected: '',
      allCatalogList: [

        {
          id: '11',
          label: '图片/image',
          icon: 'restaurant_menu',
          children: [
            {
              id: '111',
              label: '.png',
              icon: 'restaurant_menu',
            },
            {
              id: '112',
              label: '.jpg',
              icon: 'restaurant_menu',
            }

          ]
        },
        {
          id: '12',
          label: '音视频/audio',
          icon: 'room_service',
          children:[
            {
              id: '121',
              label: '.mp3',
              icon: 'room_service',
            }
          ]
        },
        {
          id: '13',
          label: '办公文件/office',
          icon: 'photo'
        }


      ]
    };
  },
  methods: {

    initDict() {
      console.log("得到字典")
    },
    select(n) {
      if (n) {
        this.selected = n;
        // 得到节点信息
        const selNode = this.$refs.qTree.getNodeByKey(n);
        console.log("选择了=>",selNode)
        this.$emit('select', selNode);
      }
    },
    showConfirm() {
      this.confirmMsg = '确认删除条记录吗？';
      this.$refs.confirmDialog.show();
    },
    queryCatalog() {

      this.$axios.get('/sys/depart/queryTreeList').then(({result}) => {
        this.catalogList = result;
        this.select(this.selected);
      }).finally(() => {
        this.loading = false;
      });
    },
    addCatalog(type) {
      this.addType = type;

      // this.editType = '新建';
      // this.$refs.dialogCatalog.show();
      // this.$nextTick(() => {
      //   this.$refs.popform.resetValidation();
      // });
    },
    updateCatalog() {

      // this.$refs.dialogCatalog.show();
      // this.editType = '修改';
      // this.$nextTick(() => {
      //   this.$refs.popform.resetValidation();
      // });
    },
    submitCatalog() {
      this.loading = true;
      let a;
      const param = {...this.form};
      if (this.editType === '修改') {
        a = this.$axios.put('/sys/depart/edit', param);
      } else {
        a = this.$axios.post('/sys/depart/add', param);
      }
      a.then((r) => {
        useNotify(r.message);
        this.$refs.dialogCatalog.hide();
      }).finally(() => {
        this.queryCatalog();
      });
    },
    delCatalog() {
      this.$axios.delete(`/sys/depart/delete?id=${this.selected}`).then((r) => {
        useNotify(r.message);
      }).finally(() => {
        this.queryCatalog();
        this.selected = '';
      });
    },
  },
  watch: {
    catalogList: {
      handler() {
        this.allCatalogList = this.catalogList;
        this.$nextTick(() => {
          // this.$refs.qTree.expandAll();
        });
      },
    },
  },
  mounted() {
    this.initDict();
    this.queryCatalog();
  },
};
</script>

<style lang="stylus"></style>
