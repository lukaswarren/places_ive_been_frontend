import { createRouter, createWebHistory } from 'vue-router';
import HomeView from './views/HomeView.vue';
import PlacesView from './views/PlacesView.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
      {
        path: '/',
        name: 'Home', 
        component: HomeView
      },
      {
        path: '/view/all',
        name: 'Places', 
        component: PlacesView
      },
    ]
});

export default router; // Ensure the router is exported correctly
