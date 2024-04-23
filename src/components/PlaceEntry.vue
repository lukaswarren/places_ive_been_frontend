<script setup>
import { ref, onMounted } from 'vue';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { fromCognitoIdentityPool} from '@aws-sdk/credential-providers';
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// import { defineProps } from 'vue';

// const props = defineProps({
//   country: String,
//   city: String,
//   visit: Object
// });

const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;
const region = import.meta.env.VITE_REGION;
const identityPoolId = import.meta.env.VITE_IDENTITY_POOL;
const selectedImageUrl = ref('');

const country = ref('Italy');
const city = ref('Rome');
const visit = ref(
    {
      date: '2024-05-10',
      visitNumber: 1,
      author: 'Maria',
      title: 'Spring in Rome',
      content: "Visited the ancient ruins and experienced the beautiful spring bloom in Rome. The city's vibrant culture and historical architecture were mesmerizing.",
      imgIDs: [
        'Boise/United States/2024/04/10/1712778602057-jfj5mmqsqf351.jpeg',  // New image key
        '1712778127443-pexels-te-lensfix-1371360.jpg',  // New image key
        'Rome/Italy/2024/04/12/1712968763060-1712778127443-pexels-te-lensfix-1371360.jpg'

      ],
      imgURLS: []
    });

const s3Client = new S3Client({
    region: region,
    credentials: fromCognitoIdentityPool({
      client: new CognitoIdentityClient({ region: region }),
      identityPoolId: identityPoolId,
    }),
  });

onMounted(async () => {
  visit.value.imgURLs = await Promise.all(visit.value.imgIDs.map(key => 
    getSignedUrl(s3Client, new GetObjectCommand({ Bucket: bucketName, Key: key }), { expiresIn: 3600 })
  ));
});

const openModal = (url) => {
    selectedImageUrl.value = url;
};

const closeModal = () => {
    selectedImageUrl.value = '';
};

</script>

<template>
  <div class="visit-entry">
    <h2 v-if="visit.title">{{ visit.title }}</h2>
    <h2 v-else>{{ city }}, {{ country }}</h2>
    <h3 v-if="visit.title">{{ city }}, {{ country }}</h3>
    <p>Date: {{ visit.date }}</p>
    <p v-if="visit.author">By: {{ visit.author }}</p>
    <p>{{ visit.content }}</p>
    <div class="gallery">
      <img v-for="(url, index) in visit.imgURLs" :key="index" :src="url" alt="Photo from visit" @click="openModal(url)">
    </div>
    <div v-if="selectedImageUrl" class="modal" @click="closeModal">
      <img :src="selectedImageUrl" alt="Selected photo">
    </div>
  </div>
</template>

<style scoped>
.visit-entry {
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  max-width: 800px;
  background: #f9f9f9;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.gallery {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
}

.gallery img {
  max-width: 100%;
  max-height: 200px;
  transition: transform 0.3s ease;
}

.gallery img:hover {
  transform: scale(1.1);
  cursor: pointer;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,0.8);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal img {
  max-width: 90%;
  max-height: 80%;
}

@media (max-width: 768px) {
  .visit-entry {
    padding: 10px;
    font-size: 14px;
  }

  h1, h2, h3 {
    font-size: 1.2em;
  }
}
</style>
