<template>
  <div class="modal">
    <div class="content">
      <form class="modal-dialog box" v-on:submit.prevent="save">
        <div class="form">
          <label>Title</label>
          <input type="text" class="input" :class="{ 'error': validation.title }" placeholder="Title" v-model="body.title">
        </div>
        <div class="form">
          <label>Date</label>
          <input type="date" class="input" :class="{ 'error': validation.date }" placeholder="Date" v-model="body.date">
        </div>
        <div class="action">
          <button class="button save" >Save</button>
          <button class="button" type="button" v-on:click="close">Close</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import useMetadata from '../metadata.js'

const { get: getMetadata, store: storeMetadata } = useMetadata()
const emit = defineEmits(['close', 'save'])
const body = reactive({
  title: '',
  date: '',
})
const initValidation = {
  title: '',
  date: ''
}
const validation = ref({ ...initValidation })

const close = () => {
  emit('close')
}

const validate = data => {
  return new Promise((resolve, reject) => {
    const errors = []

    if (data.title === '') {
      errors.push({
        key: 'title',
        message: 'Title is empty'
      })
    }

    if (data.date === '') {
      errors.push({
        key: 'date',
        message: 'Date is empty'
      })
    }

    if (errors.length) {
      reject(errors)
    }

    resolve(data)
  })
}

const resetValidation = () => {
  validation.value = {...initValidation}
}

const save = () => {
  resetValidation()

  validate(body).then(data => {
    storeMetadata(data)
    emit('save')
  }).catch(errors => {
    errors.forEach(error => {
      validation.value[error.key] = error.message
    })
  })
}

onMounted(() => {
  getMetadata().then(({ title, date }) => {
    body.title = title
    body.date = date.toISOString().split('T')[0]
  }).catch(err => {})
})
</script>

<style>
.modal {
  @apply fixed inset-0 py-20 px-4 bg-gray-300 bg-opacity-50;
}
.modal .content {
  @apply sm:max-w-screen-md;
}
.form {
  @apply mb-4;
}
.input {
  @apply block w-full px-3 py-2 border rounded-md mt-2 focus:outline-none focus:border-gray-800;
}
.input.error {
  @apply border-red-400 focus:border-red-400;
}
.action {
  @apply mt-6;
}
.button {
  @apply px-3 py-2 border rounded-md hover:bg-gray-100 focus:outline-none focus:border-gray-800;
}
.save {
  @apply bg-gray-800 border-gray-800 text-white mr-2 hover:bg-gray-900 hover:border-gray-900 focus:outline-none focus:border-gray-900;
}
</style>