<template>
  <div id="app">
    <header>
      <nav>
        <ul>
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/view/all">Places</router-link></li>
        </ul>
      </nav>
    </header>
    <main>
      <router-view />
    </main>
    <footer>
      <p>© 2024 Places I've Been | Lukas Warren</p>
    </footer>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
// import { usePlacesStore } from '@/stores/places'; 

// const placesStore = usePlacesStore();

// onMounted(() => {
//   placesStore.loadPlaces();
// });
</script>

<style>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh; 
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

header, footer {
  flex-shrink: 0; /* Prevents shrinking */
}

main {
  flex-grow: 1; /* Allows the main content to grow and fill available space */
  margin-top: 20px;
  overflow-y: auto; /* Adds scroll to main if content overflows */
}

nav ul {
  padding: 0;
  list-style-type: none;
  display: flex;
  justify-content: center;
}

nav ul li {
  margin: 0 10px;
}

nav ul li a {
  color: #4242b9;
  text-decoration: none;
}

footer {
  margin-top: 20px;
  color: #424242;
  height: 50px; /* Ensures footer has a set height */
}
</style>
