<template>
    <div class="login-container">
      <h2>Login</h2>
      <form @submit.prevent="login">
        <div class="form-group">
          <label for="username">Username</label>
          <input
            type="text"
            class="form-control"
            id="username"
            v-model="username"
          />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
            type="password"
            class="form-control"
            id="password"
            v-model="password"
          />
          <div>
            <small v-if="error" class="text-danger">{{ error }}</small>
          </div>
        </div>
        <button type="submit" class="btn btn-primary">Login</button>
      </form>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, defineEmits} from 'vue';
  import axios from 'axios';

  const emit = defineEmits(['loginSuccess']);

  
  const csrf = ref("");
  const username = ref("");
  const password = ref("");
  const error = ref("");
  
  const login = async () => {
    try {
      const response = await axios.post("http://localhost:8000/places-api/login/", {
        username: username.value,
        password: password.value
      }, {
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrf.value
        },
        withCredentials: true
      });
  
      username.value = "";
      password.value = "";
      error.value = "";
      // Emit an event to inform parent component about the login status
      emit('loginSuccess');
    } catch (err) {
      console.log(err);
      error.value = "Wrong username or password.";
    }
  };
  
  // Fetch the CSRF token when the component is mounted
  onMounted(async () => {
    try {
      const response = await axios.get("http://localhost:8000/places-api/csrf/", { withCredentials: true });
      csrf.value = response.headers["x-csrftoken"];
    } catch (err) {
      console.log(err);
    }
  });
  </script>
  
  <style scoped>
  .login-container {
    max-width: 500px;
    margin: auto;
    padding: 20px;
  }
  
  .form-group {
    margin-bottom: 1rem;
  }
  
  .btn {
    margin-top: 1rem;
  }
  </style>
  