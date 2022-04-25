<template>
  <div class="wrapper">
    <div class="content">
      <div class="box" v-if="!isLoading">
        <header class="header">
          <div class="header-item">
            <h1 class="title">{{ metadata.title }}</h1>
            <button v-on:click="openEditing">
              <edit-icon class="edit-icon" />
            </button>
          </div>
          <div class="header-item">
            <p class="subtitle">{{ metadata.date.toDateString() }}</p>
            <button v-on:click="openEditing">
              <edit-icon class="edit-icon" />
            </button>
          </div>
        </header>
        <hr class="separator">
        <div class="countdown">
          <div class="time">
            <span class="number">{{ countdown.days }}</span>
            <span class="text">Days</span>
          </div>
          <div class="time">
            <span class="number">{{ countdown.hours }}</span>
            <span class="text">Hours</span>
          </div>
          <div class="time">
            <span class="number">{{ countdown.minutes }}</span>
            <span class="text">Minutes</span>
          </div>
          <div class="time">
            <span class="number">{{ countdown.seconds }}</span>
            <span class="text">Seconds</span>
          </div>
        </div>
      </div>
      <footer class="footer">
        <a href="https://github.com/ibrahimalanshor/countdown-vue" target="_blank">Source Code</a>
      </footer>
    </div>
  </div>

  <modal v-if="isEditing" v-on:save="refresh" v-on:close="closeEditing" />
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import EditIcon from './components/EditIcon.vue'
import Modal from './components/Modal.vue'
import useMetadata from './metadata.js'

const { metadata, set: setMetadata } = useMetadata()

const countdown = reactive({
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0
})
const isLoading = ref(true)
const isEditing = ref(false)

const start = () => {
  const timer = setInterval(() => {
    const now = Date.now()
    const diff = metadata.date.getTime() - now

    if (diff < 0) {
      countdown.days = 0
      countdown.hours = 0
      countdown.minutes = 0
      countdown.seconds = 0
      clearInterval(timer)
    } else {
      countdown.days = Math.floor(diff / (1000 * 60 * 60 * 24))
      countdown.hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      countdown.minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      countdown.seconds = Math.floor((diff % (1000 * 60)) / (1000))
    }

  }, 1000)
}

const initMetadata = () => {
  setMetadata().then(() => {
    stopLoading()
    start()
  }).catch(() => {})
}

const openEditing = () => {
  isEditing.value = true
}

const closeEditing = () => {
  isEditing.value = false
}

const stopLoading = () => {
  isLoading.value = false
}

const refresh = () => {
  initMetadata()
  closeEditing()
}

onMounted(() => {
  initMetadata()
})
</script>

<style>
.wrapper {
  @apply w-full min-h-screen py-20 px-4 overflow-auto flex justify-center bg-gray-100 text-gray-700;
  font-family: 'Plus Jakarta Sans', sans-serif;
}
.content {
  @apply w-full sm:max-w-screen-md mx-auto;
}
.box {
  @apply bg-white w-full py-8 px-5 rounded-md;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 10px 50px;
}
.header {
  @apply text-center;
}
.header-item {
  @apply flex items-center justify-center text-center;
}
.title {
  @apply font-bold text-2xl mb-1;
}
.subtitle {
  @apply text-gray-400;
}
.edit-icon {
  @apply hidden ml-2;
}
.header-item:hover .edit-icon {
  @apply block;
}
.separator {
  @apply mt-6 mb-4;
}
.countdown {
  @apply flex flex-wrap items-center;
}
.time {
  @apply w-full sm:w-1/4 py-4 text-center;
}
.number {
  @apply block mb-4 text-6xl font-bold;
}
.footer {
  @apply py-4 text-right text-sm text-gray-500;
}
</style>