<template>
  <div>chat</div>

</template>

<script>

export default {
  name: "chat",
  data() {
    return {}
  },
  methods: {}

}
</script>

<style scoped lang="less">
.fab-flex {
  position: fixed;
  right: 50px;
  bottom: 50px;

  .card-flex {
    position: absolute;
    right: 1px;
    bottom: 1px;
  }
}

.btn-flex {
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: nowrap;
  background-color: darkgrey;

  q-input {
    background-color: #1D1D1D;
    order: 2;
    flex-grow: 1;
  }

  q-btn {
    order: 1;
    flex-grow: 0;
  }
}

</style>
