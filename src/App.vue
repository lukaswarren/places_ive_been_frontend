<script setup>
import { ref } from "vue";
import PlacesMap from "./components/PlacesMap.vue"
import PlacesUpload from "./components/PlaceUpload.vue"

const showModal = ref(false)
</script>

<template>
  <button id="show-modal" @click="showModal = true">Upload</button>
  <Teleport to="body">
    <!-- use the modal component, pass in the prop -->
    <PlacesUpload :show="showModal" @close="showModal = false">
      <template #header>
        <h3>Upload</h3>
      </template>
    </PlacesUpload>
  </Teleport>
  <PlacesMap/> 
</template>
<style scoped>
  button {
  width: 100%;
  padding: 10px 0;
  border: none;
  border-radius: 4px;
  background-color: #2171b5;
  color: white;
  cursor: pointer;
}

button:hover {
  background-color: #1a508b;
}

</style>

