<script setup>
import { defineProps } from 'vue';

defineProps['title', 'content', 'pictures']

</script>


<template>
    <div class="places-entry">
      <h2>{{ title }}</h2>
      <div v-html="content"></div>
      <div class="pictures">
        <img v-for="(picture, index) in pictures" :key="index" :src="picture.src" :alt="picture.alt">
      </div>
    </div>
  </template>
  

  
  <style scoped>
  .places-entry {
    margin-bottom: 20px;
  }
  
  .places-entry h2 {
    font-size: 24px;
    margin-bottom: 10px;
  }
  
  .places-entry .pictures img {
    max-width: 100%;
    margin-bottom: 10px;
  }
  </style>
  