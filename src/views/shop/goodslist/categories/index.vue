<template>
  <div class="q-col-gutter-sm">
    <q-markup-table flat bordered>
      <thead class="bg-gray">
      <tr>
        <td>
          <div class="q-gutter-sm">
            <q-btn :disable="!selected" size="sm" color="primary" @click="add" label="添加分类"/>
            <q-btn :disable="!selected" size="sm" color="primary" @click="edit" label="修改分类"/>
            <q-btn :disable="!selected" v-if="selected" size="sm" color="red" @click="remove" label="删除分类"/>
          </div>
          <q-tree class="col-12 col-sm-6" ref="tree"
                  :nodes="list"
                  v-model:selected="selected"
                  v-model:expanded="expanded"
                  node-key="categoryId"
                  label-key="categoryName"
                  selected-color="primary"
                  default-expand-all
                  no-connectors/>
        </td>
        <td>
          <div class="col-12 col-sm-6">
            <div class="text-h6">Selected</div>
            <div>{{ selected }}</div>
            <div class="text-h6 q-mt-md">Ticked</div>
            <div>
              <div v-for="tick in ticked" :key="`ticked-${tick}`">
                {{ tick }}
              </div>
            </div>

          </div>
        </td>
      </tr>
      </thead>
    </q-markup-table>


    <q-dialog maximized flat persistent ref="dialog">
      <q-form @submit="submit" class="dialog_card  q-ma-sm">
        <h5 class="view_title justify-between q-px-md">
          {{ editType }} 分类
          <q-btn dense outline round icon="clear" size="sm" v-close-popup/>
        </h5>
        <q-scroll-area class="column" style="height: 80%">
          <div class="row q-col-gutter-x-md dialog_form q-pa-md">
            <div class="col-6">
              <h5>分类名称</h5>
              <q-input dense v-model="form.categoryName"/>
            </div>
          </div>
        </q-scroll-area>
        <div class="row justify-center q-pa-md">
          <q-btn outline color="primary" icon="mdi-close-thick" label="关闭" v-close-popup/>
          <q-btn class="q-mx-sm" color="primary" icon="mdi-check-bold" :loading="loading" label="提交" type="submit"/>
        </div>
      </q-form>
    </q-dialog>

  </div>

</template>

<script>
import {IndexMixin} from "@/boot/mixins/indexV2";
import {defineComponent, ref} from 'vue'
import {useNotify} from "@/boot/useNotify";

export default defineComponent({
  name: "categories",
  mixins: [IndexMixin],
  data() {
    return {
      columns: [
        {name: 'index', align: 'center', label: '序号', field: 'index',},
      ],
      url: {
        list: '/shop/products/categories/list',
        add: '/shop/products/categories',
        edit: '/shop/products/categories',
        delete: '/shop/products/categories',
        deleteBatch: '/shop/products/categories',
      },
      selected: '',
      ticked: [],
      expanded: ['1'],
      simple: [],
    }
  },
  methods: {
    add() {
      this.form.parentId = this.selected
      this.editType = "添加"
      this.$refs.dialog.show()

    },
    edit() {
      if(this.selected === "1"){
        useNotify().negativeNotify("顶级分类不能修改")
        return
      }
      this.form = this.$refs.tree.getNodeByKey(this.selected)
      this.editType = "修改"
      this.$refs.dialog.show()

    },
    reset(){

    },
    remove() {
      console.log(this.selected)
      if (this.selected === "1") {
        useNotify().negativeNotify("顶级分类不能删除")
        return
      }
      this.del(this.selected)

    }
  },
  created() {
    // this.$axiosPlus.get(this.url.list).then(res => {
    //   this.simple = res.data.records;
    // })


  },
  mounted() {

  },
})
</script>


<style scoped>

</style>