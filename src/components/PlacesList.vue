<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const entries = ref([
  { city: 'Rome', country: 'Italy', date: '2024-05-10', snippet: 'Explored the ancient streets of Rome.', content: 'Full content goes here...' },
  { city: 'Tokyo', country: 'Japan', date: '2024-04-15', snippet: 'Cherry blossoms and tea ceremonies.', content: 'Full content goes here...' },
]);

const maxPreview = ref(5)
const displayedEntries = computed(() => entries.value.slice(0, maxPreview.value));
const router = useRouter();

const navigateToPost = (entry) => {
  const formattedCity = encodeURIComponent(entry.city.toLowerCase().replace(/ /g, '-'));
  const formattedCountry = encodeURIComponent(entry.country.toLowerCase().replace(/ /g, '-'));
  const formattedDate = entry.date;
  router.push({ name: 'PlaceDetails', params: { city: formattedCity, country: formattedCountry, date: formattedDate } });
};

const viewMore = () => {
  maxPreview.value += 5; // Increment to show more entries
};
</script>

<template>
  <div class="blog-list">
    <h2>Recent  Posts</h2>
    <div class="preview-container">
      <div v-for="(entry, index) in displayedEntries" :key="index" class="entry" @click="navigateToPost(entry)">
        <h3>{{ entry.city }}, {{ entry.country }}</h3>
        <p class="date">{{ entry.date }}</p>
        <p class="snippet">{{ entry.snippet }}...</p>
      </div>
    </div>
    <button class="view-more">View More</button>
  </div>
</template>

<style scoped>
.blog-list {
  width: 100%; /* Full width by default */
  margin: auto;
  padding: 20px;
}

.preview-container {
  max-height: 600px; /* Adjust based on preference */
  overflow-y: auto;
}

.entry {
  background-color: #f0f0f0;
  margin: 10px 0;
  padding: 10px;
  cursor: pointer;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.entry:hover {
  background-color: #e0e0e0;
}

.view-more {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.view-more:hover {
  background-color: #0056b3;
}

@media (min-width: 768px) {
  .blog-list {
    width: 80%; /* Full page on smaller screens, adjust for larger screens */
  }
}

@media (min-width: 1024px) {
  .blog-list.side-view {
    width: 30%; /* Side view for larger screens */
  }
}

</style>
