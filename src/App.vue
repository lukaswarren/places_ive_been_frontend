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
        <p>© 2024 Your Company or Name</p>
      </footer>
    </div>
  </template>
  
  <script>
  export default {
    name: 'App'
  }
  </script>
  
  <style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
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
    color: #42b983;
    text-decoration: none;
  }
  
  main {
    margin-top: 20px;
  }
  
  footer {
    margin-top: 20px;
    color: #424242;
  }
  </style>
  