<template>
  <div class="page">
    <q-list bordered class="rounded-borders">
      <q-expansion-item
        group="semigroup"
        v-for="(menu,index) in menus" :key="index" :to="menu.meta.path">
        <template v-slot:header>
          <q-item-section avatar>
            <q-icon :name="menu.meta.icon"></q-icon>
          </q-item-section>
          <q-item-section>
            {{ menu.meta.title }}
          </q-item-section>
        </template>
        <q-separator/>

        <q-expansion-item
          group="semigroup-children"
          v-if="menu.children"
          v-for="(item,index) in menu.children"
          :key="index"
          :to="item.meta.path"
          :header-inset-level="1"
          expand-separator
        >
          <template v-slot:header>
            <q-item-section avatar>
              <q-icon :name="item.meta.icon"></q-icon>
            </q-item-section>
            <q-item-section>
              {{ item.meta.title }}
            </q-item-section>
          </template>
        </q-expansion-item>


          <q-card v-else>
            <q-card-section>
              {{menu.meta.title}}
            </q-card-section>
          </q-card>
        <q-separator/>
      </q-expansion-item>

    </q-list>

  </div>
</template>

<script>
import {useRouter} from "vue-router";


export default {

  setup() {
    let router = useRouter()

    const route = router.options.routes;

    const menus = route.at(0).children


    return {
      menus,
    }
  }
}


</script>

<style lang="less" scoped>
.page {
  width: 100%;
  height: 100%;
  //background-color: #9C27B0;
}


</style>
