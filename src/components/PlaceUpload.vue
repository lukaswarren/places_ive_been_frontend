<script setup>
import { ref } from 'vue';
import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers';
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';

const props = defineProps({
  show: Boolean
});

const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;
const region = import.meta.env.VITE_REGION;
const identityPoolId = import.meta.env.VITE_IDENTITY_POOL;

const files = ref([]);
const previewImages = ref([]);
const city = ref('');
const country = ref('');
const date = ref('');
const content = ref('');

const s3Client = new S3Client({
  region: region,
  credentials: fromCognitoIdentityPool({
    client: new CognitoIdentityClient({ region: region }),
    identityPoolId: identityPoolId,
  }),
});

function handleFileUpload(event) {
  files.value = Array.from(event.target.files);
  previewImages.value = files.value.map(file => {
    return URL.createObjectURL(file);
  });
};

async function uploadFile(file) {
  const formattedDate = date.value.split('-').join('/');
  const keyPrefix = `${city.value}/${country.value}/${formattedDate}`;
  const fileName = `${Date.now()}-${file.name}`;
  const key = `${keyPrefix}/${fileName}`;
  const upload = new Upload({
    client: s3Client,
    params: {
      Bucket: bucketName,
      Key: key,
      Body: file,
    },
  });

  await upload.done();
  return `https://${bucketName}.s3.amazonaws.com/${key}`;
}

async function uploadPlace() {
  if (!files.value.length) {
    console.error("No file selected");
    return;
  }
  try {
    const urls = await Promise.all(files.value.map(file => uploadFile(file)));
    console.log(`Files uploaded:`, urls);
    // Resetting form after successful upload
    files.value = [];
    previewImages.value = [];
    city.value = '';
    country.value = '';
    date.value = '';
    content.value = '';
  } catch (error) {
    console.error('Error uploading files:', error);
  }
}

function removeImage(index) {
  files.value.splice(index, 1);
  previewImages.value.splice(index, 1);
}

</script>

<template>
  <div v-if="show" class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-content">
        <h2>Create Blog Entry</h2>
        <input type="file" accept="image/*" @change="handleFileUpload" multiple/>
        <div class="preview-container" v-if="previewImages.length">
          <div v-for="(preview, index) in previewImages" :key="index" class="preview">
            <img :src="preview" :alt="'Preview ' + index" class="preview-image">
            <button @click="removeImage(index)">Remove</button>
          </div>
        </div>
        <input type="text" v-model="city" placeholder="City" />
        <input type="text" v-model="country" placeholder="Country" />
        <input type="date" v-model="date" />
        <textarea v-model="content" placeholder="Content"></textarea>
        <button @click="uploadPlace">Create</button>
        <button @click="$emit('close')">Close</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-wrapper {
  width: 90%;
  max-width: 600px;
  padding: 20px;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
}

.modal-content {
  display: flex;
  flex-direction: column;
}

.preview-container {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 10px;
}

.preview {
  width: 100px;
  margin-right: 10px;
  position: relative;
}

.preview-image {
  width: 100%;
  height: auto;
  border-radius: 4px;
}

button {
  margin-top: 10px;
}

input[type="file"],
input[type="text"],
input[type="date"],
textarea {
  padding: 8px;
  margin-top: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
</style>
