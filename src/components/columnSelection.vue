<template>
  <div class="row q-gutter-md">
    <div class="col-4">
      <!-- 已拥有的容器 -->
      <q-item>
        当前角色
      </q-item>
      <q-card class="q-ma-md">
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
      <q-item>
        分配角色
      </q-item>
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
  emits: ['update:ownedItems','update:availableItems'],
  watch: {
    _ownedItems(newValue) {
      this._ownedItems = newValue
      this.$emit('update:ownedItems', newValue);
    },
    _availableItems(newValue) {
      this._availableItems = newValue
      this.$emit('update:availableItems', newValue);
    }
  },
  data() {
    return {
      _ownedItems: this.ownedItems,
      _availableItems:this.availableItems

    };
  },
  mounted() {
  },
  methods: {
    // 添加到待提交list中
    addToOwnedItems(item) {
      // 将待点击的项添加到已拥有的项
      this.ownedItems.push(item);

      // 在待点击容器中移除已添加的项
      const index = this.availableItems.findIndex((i) => i.id === item.id);
      if (index !== -1) {
        this.availableItems.splice(index, 1);
      }
    },
    // 从待提交list 移除
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