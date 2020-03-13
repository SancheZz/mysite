<template>
  <header class="auth-header">
    <load-button
      type="button"
      :loading="isLoading"
    >
      <template slot="default-content">
        <div class="default-content">
          Подсчитаться во Вконтакте
        </div>
      </template>
      <template slot="loading-content">
        <div class="loading-content"></div>
      </template>
    </load-button>
  </header>
</template>

<script>
import LoadButton from '@/components/LoadButton';

export default {
  name: 'AuthHeader',

  data() {
    return {
      isLoading: false,
    };
  },

  components: {
    LoadButton,
  },

  mounted() {
    this.toggleLoad();
  },

  methods: {
    toggleLoad() {
      this.isLoading = !this.isLoading;
      setTimeout(this.toggleLoad, 2000);
    },
  },
};
</script>

<style lang="scss" scoped>
.auth-header {
  text-align: center;
  margin: 1rem 0;
}

.default-content {
  white-space: nowrap;
}

.loading-content {
  animation-name: loading-content;
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
  border: 1px solid blue;
  border-color: blue transparent blue transparent;
  border-radius: 50%;
  width: 20px;
  height: 20px;
}

@keyframes loading-content {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
