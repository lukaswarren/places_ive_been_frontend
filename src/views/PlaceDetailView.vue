<template>
    <div class="places-detail-view">
      <PlacesEntry class="places-entry"/>
      <PlacesList class="places-list"/>
    </div>
  </template>
  
  <script setup>
  import PlacesEntry from "../components/PlaceEntry.vue";
  import PlacesList from "../components/PlacesList.vue";
  </script>
  
  <style scoped>
  .places-detail-view {
    display: flex;
    justify-content: space-between;
  }
  
  .places-entry {
    width: 50%;
  }
  
  .places-list {
    width: 50%;
  }
  </style>