<script setup>
import { ref , onMounted} from "vue";
import axios from "axios";
import PlacesMap from "../components/PlacesMap.vue"
import PlacesUpload from "../components/PlaceUpload.vue"
import LoginComponent from "../components/LoginComponent.vue"

const showModal = ref(false)

const isAuthenticated = ref(false);

const getSession = async () => {
  try {
    const response = await axios.get("http://localhost:8000/places-api/session/", { withCredentials: true });
    isAuthenticated.value = response.data.isAuthenticated;
  } catch (err) {
    console.log(err);
  }
};

const handleLoginSuccess = () => {
  isAuthenticated.value = true;
};

const logout = async () => {
  try {
    await axios.get("http://localhost:8000/places-api/logout/", { withCredentials: true });
    isAuthenticated.value = false;
  } catch (err) {
    console.log(err);
  }
};

onMounted(() => {
  getSession();
});
</script>

<template>
  <LoginComponent v-if="!isAuthenticated" @loginSuccess="handleLoginSuccess" />
  <div v-else>
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
  </div>
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