import { createRouter, createWebHistory } from 'vue-router';
import HomeView from './views/HomeView.vue';
import PlaceDetailView from './views/PlaceDetailView.vue';
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
      {
        path: '/places/:country/:city/:date', 
        name: 'PlaceDetails',
        component: PlaceDetailView,
        props: true 
      },
    ]
});

export default router; 
