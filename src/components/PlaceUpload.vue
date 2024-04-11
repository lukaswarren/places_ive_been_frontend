<script setup>
  import { ref } from 'vue';
  import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
  import { Upload } from '@aws-sdk/lib-storage';
  import { fromCognitoIdentityPool} from '@aws-sdk/credential-providers';
  import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
  
  const props = defineProps({
    show: Boolean
  })

  const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;
  const region = import.meta.env.VITE_REGION;
  const identityPoolId = import.meta.env.VITE_IDENTITY_POOL;

  const files = ref(null);
  const previewImage = ref(null);
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
    files.value = event.target.files
 
  };

  async function uploadFile(file) {
    const formattedDate = date.value.split('-').join('/');
  
  // Construct the key with city, country, and date as folders
  const keyPrefix = `${city.value}/${country.value}/${formattedDate}`;
  const fileName = `${Date.now()}-${file.name}`; // Unique file name
  const key = `${keyPrefix}/${fileName}`; // Full key with dynamic folders
    const upload = new Upload({
      client: s3Client,
      params: {
        Bucket: bucketName,
        Key: key,
        Body: file,
      },
    });

  await upload.done();
  return `https://${bucketName}.s3.us-west-2.amazonaws.com/${fileName}`;
  }
  
  async function uploadPlace() {
    if (!files.value || files.value.length === 0) {
      console.error("No file selected");
      return;
    }
    try {
      for (const file of files.value) {
        const result = await uploadFile(file);
        console.log(`File uploaded: ${result}`);
      }
      files.value = null;
      city.value = '';
      country.value = '';
      date.value = '';
      content.value = '';
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  }


</script>


<template>
    <Transition name="modal">
      <div v-if="show" class="modal-mask">
        <div class="modal-content">
          <h2>Create Blog Entry</h2>
          <input type="file" accept="image/*" @change="handleFileUpload" multiple/>
          <input type="text" v-model="city" placeholder="City" />
          <input type="text" v-model="country" placeholder="Country" />
          <input type="date" v-model="date" />
          <textarea v-model="content" placeholder="Content"></textarea>
          <button @click="uploadPlace">Create</button>
          <button class="close" @click="$emit('close')">Close</button>
        </div>
      </div>
    </Transition>
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
  transition: opacity 0.3s ease;
}

.modal-content {
  width: 300px;
  margin: auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
}


h2 {
  margin-bottom: 20px;
}

input[type="file"],
input[type="text"],
input[type="date"],
textarea {
  width: 100%;
  margin-bottom: 10px;
  padding: 8px;
  border: none;
  border-radius: 4px;
  background-color: #f5f5f5;
}

button {
  width: 100%;
  padding: 10px 0;
  border: none;
  border-radius: 4px;
  background-color: #2171b5;
  color: white;
  cursor: pointer;
}

button:hover {
  background-color: #1a508b;
}
</style>