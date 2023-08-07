<template>
  <q-list bordered class="rounded-borders">
    <!--    <button @click="testclick">测试</button>-->
    <!--    <q-expansion-item-->
    <!--        expand-separator-->
    <!--        icon="home"-->
    <!--        label="首页"-->
    <!--        default-opened>-->

    <!--      <q-expansion-item-->
    <!--          :header-inset-level="1"-->
    <!--          expand-separator-->
    <!--          icon="receipt"-->
    <!--          label="Receipts"-->
    <!--          default-opened>-->
    <!--        <q-expansion-item switch-toggle-side dense-toggle label="Today"-->
    <!--                          :header-inset-level="1"-->
    <!--                          :content-inset-level="2">-->
    <!--          <q-card>-->
    <!--            <q-card-section>-->
    <!--              1-->
    <!--            </q-card-section>-->
    <!--          </q-card>-->
    <!--        </q-expansion-item>-->

    <!--        <q-expansion-item switch-toggle-side dense-toggle label="Yesterday" :header-inset-level="1"-->
    <!--                          :content-inset-level="2">-->
    <!--          <q-card>-->
    <!--            <q-card-section>-->
    <!--              2-->
    <!--            </q-card-section>-->
    <!--          </q-card>-->
    <!--        </q-expansion-item>-->
    <!--      </q-expansion-item>-->
    <!--    </q-expansion-item>-->


    <q-expansion-item
        dense-toggle
        v-for="(item,index) in menuData"
        :hide-expand-icon="!item.children"
        expand-separator
        :key="item.menuId"
        :icon="item.icon"
        :label="item.menuName"
        :default-opened="item.parentId === 0"
        :header-inset-level="level"
        :to="item.menuType === 'C' ? item.path: '' "
    >

      <menus v-if="item.children" :menu-data="item.children" :level="level+1"/>


    </q-expansion-item>
  </q-list>

</template>
<script>

export default {
  name: "menus",
  props: {
    "menuData": {
      type: Array,
      default: [],
    },
    "level": {
      type: Number,
      default: 0
    }
  },
  data() {
    return {}
  },
  methods: {
    testclick() {
      // this.$axios.get('/api/test')
      console.log("得到的菜单列表=>", this.$props.menuData)
    }
  },
  mounted() {

  }
}
</script>

<style scoped>

</style>