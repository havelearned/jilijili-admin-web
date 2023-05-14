<template>
  <q-expansion-item
    :header-inset-level="calcLevel"
    v-for="(menu,index) in menuList"
    :icon="menu.meta.icon || 'toc'"
    :label="menu.meta.title"
    :model-value="openMenu(menu)"
    :hide-expand-icon="!menu.children"
    :to="menu.meta.path"
  >
    <menus v-if="menu.children" :menuList="menu.children" :level="level+1"/>
  </q-expansion-item>
</template>

<script>

export default {
  name: "menus",
  components: {},
  props: {
    menuList: Object,
    level: Number,
  },
  data() {
    return {}

  },
  computed: {
    calcLevel() {
      if (this.level === 1) {
        return 0;
      }
      return (this.level - 1) * 0.4;
    },
  },
  methods: {
    headerStyleActive(item) {
      return this.match(item) ? {backgroundColor: '#1890ff'} : {};
    },
    matchOpen(item, result) {
      if (this.match(item)) {
        result.open = true;
      }
      if (!result.open && item.children && item.children.length > 0) {
        item.children.forEach((child) => {
          this.matchOpen(child, result);
        });
      }
    },
    openMenu(item) {
      const result = {open: false};
      this.matchOpen(item, result);
      return result.open;
    },
    match(item) {
      if (this.$route.path === item.path) {
        if (this.$route.query && item.query) {
          if (this.$route.query.id === item.query.id) {
            return true;
          }
        } else {
          return true;
        }
      }
      return false;
    },
  },

  mounted() {


  }
}


</script>

<style lang="less" scoped>


</style>
