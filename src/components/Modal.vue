<template>
  <div v-show="modalVisible" class="modala">
    <div class="content">
      <p class="titleModal">{{ title }}</p>
      <div class="act">
        <button @click="handleClose()">Não</button>
        <button @click="handleClick()">Sim</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Modal',
  props: {
    // Define a prop chamada "title"
    title: {
      type: String, // Tipo esperado (String)
      required: false, // Define como obrigatório
    },
    modalVisible: {
      type: Boolean, // Tipo esperado (String)
      required: true, // Define como obrigatório
    },
    onUpdateStatus: {
      type: Function, // Tipo esperado (String)
      required: false, // Define como obrigatório
    },
    onClose: {
      type: Function, // Tipo esperado (String)
      required: false, // Define como obrigatório
    },
  },
  methods: {
    handleClick() {
      // Emitindo um evento para o componente pai
      this.onUpdateStatus()
    },
    handleClose() {
      // Emitindo um evento para o componente pai
      this.onClose()
    },
  },
}
</script>

<style>
.modala {
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.486);
  z-index: 99988;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
.content {
  width: clamp(100px, 90%, 400px);
  height: 125px;
  border-radius: 10px;
  padding: 10px;
  background-color: #fff;
}
.titleModal {
  text-align: center;
}
.act {
  display: flex;
  align-items: center;
  justify-content: center;
}

.act button {
  margin: 15px;
  font-size: 20px;
  color: #fff;
  background-color: green;
  padding: 5px 25px;
  border-radius: 5px;
  cursor: pointer !important;
  transition: all 0.3s;
}
.act button:hover {
  background-color: rgb(9, 175, 9);
  cursor: pointer !important;
}

.act button:first-child {
  background-color: red !important;
  cursor: pointer !important;
}

.act button:first-child:hover {
  background-color: rgb(247, 45, 45) !important;
}
</style>
