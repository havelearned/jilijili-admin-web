<template>
  <div class="row q-gutter-md">
    <div class="col-4">
      <!-- 已拥有的容器 -->
      <h5>当前角色</h5>
      <q-card class="q-mb-md">
        <q-card-section>
          <q-item v-for="item in ownedItems" :key="item.id" clickable @click="removeFromOwnedItems(item)">
            <q-item-section>
              <q-icon :name="item.icon" size="lg"></q-icon>
            </q-item-section>
            <q-item-label>
              <div class="text">{{ item.text }}</div>
            </q-item-label>
          </q-item>
        </q-card-section>
      </q-card>
    </div>

    <div class="col-6">
      <!-- 待点击后加入已拥有容器的容器 -->
      <h5>分配角色</h5>
      <q-card>
        <q-card-section v-if="availableItems.length === 0">
          <p style="text-align: center">暂无内容</p>
        </q-card-section>
        <q-card-section v-else>
          <q-item v-for="item in availableItems" :key="item.id" clickable @click="addToOwnedItems(item)">
            <q-item-section>
              <q-icon :name="item.icon" size="lg"></q-icon>
            </q-item-section>
            <q-item-label>
              <div class="text">{{ item.text }}</div>
            </q-item-label>
          </q-item>
        </q-card-section>
      </q-card>
    </div>


  </div>
</template>
<script>
import {useNotify} from "@/boot/useNotify";

export default {
  props: {
    ownedItems: {
      type: Array,
      required: true,
    },
    availableItems: {
      type: Array,
      required: true,
    },
  },
  emits: ['update:ownedItems'],
  watch: {
    _ownedItems(newValue) {
      this._ownedItems = newValue
      this.$emit('update:ownedItems', newValue);
    }
  },
  data() {
    return {
      _ownedItems: this.ownedItems

    };
  },
  mounted() {
    // if (!this.ownedItems) {
    //   this.ownedItems.push(
    //       {id: 1, icon: 'path/to/icon1.png', text: 'Item 1'},
    //       {id: 2, icon: 'path/to/icon2.png', text: 'Item 2'},)
    // }
    // if (!this.availableItems) {
    //   this.availableItems.push({id: 3, icon: 'path/to/icon3.png', text: 'Item 3'},
    //       {id: 4, icon: 'path/to/icon4.png', text: 'Item 4'},)
    // }

    console.log(this.ownedItems)


  },
  methods: {
    addToOwnedItems(item) {
      // 将待点击的项添加到已拥有的项
      this.value = item;
      this.ownedItems.push(item);

      // 在待点击容器中移除已添加的项
      const index = this.availableItems.findIndex((i) => i.id === item.id);
      if (index !== -1) {
        this.availableItems.splice(index, 1);
      }
    },
    removeFromOwnedItems(item) {
      // 至少保留一个项目，如果已拥有的容器中只有一个项目，则显示提示弹窗
      if (this.ownedItems.length === 1) {
        useNotify().warningNotify("至少保留一个项目")
        return;
      }
      // 将已拥有的项移回到待点击容器
      this._ownedItems = this.ownedItems.splice(this.ownedItems.indexOf(item), 1);
      this.availableItems.push(item);
    },
  },
};
</script>

<style>

</style>