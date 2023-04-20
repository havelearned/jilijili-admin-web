<template>
  <q-dialog
    v-model="isOpen"
  >
    <q-card style="width: 700px; max-width: 80vw;">
      <q-card-section>
        <div class="text-h6">info</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        Click/Tap on the backdrop.
      </q-card-section>

      <q-card-actions align="right" class="bg-white text-teal">
        <q-btn flat label="OK" v-close-popup/>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>

import {ref} from "vue";

let isOpen = ref(false);
const changeDialog = (id) => {
  isOpen.value = !isOpen.value;
}
defineExpose({
  changeDialog
})

const addData = {
  singerName: undefined,
  singerPhoto: undefined,
  singerDetails: undefined,
  singerType: undefined
}

</script>

<style scoped>

</style>
