<template>
  <div :class="classes">
    <!-- photo -->
    <img
      class="stat-item__photo"
      :src="user.photo50"
      width="50"
      height="50"
    />

    <!-- name -->
    <a
      class="stat-item__name"
      :href="link"
      target="_blank"
    >
      <div>
        {{ user.firstName }}
      </div>
      <div>
        {{ user.lastName }}
      </div>
    </a>

    <!-- photos likes count -->
    <div class="stat-item__photos">
      <div class="stat-item__photos-count">
        {{ user.photosLikesCount }}
      </div>
    </div>

    <!-- posts likes count -->
    <div class="stat-item__posts">
      <div class="stat-item__posts-count">
        {{ user.postsLikesCount }}
      </div>
    </div>
  </div>
</template>

<script>
import { makeMods } from '@/utils';

export default {
  name: 'UserStatItem',

  props: {
    mods: {
      type: Array,
      default() {
        return [];
      },
    },
    user: {
      type: Object,
      default() {
        return {};
      },
    },
  },

  computed: {
    classes() {
      return makeMods('stat-item', this.mods);
    },
    link() {
      const { id } = this.user;
      return `https://vk.com/id${id}`;
    },
  },
};
</script>

<style lang="scss" scoped>
$link-color: #1a0dab;

.stat-item {
  border: 1px solid var(--light-grey-color);
  grid-column: auto / span 4;
  margin: .5rem;
  padding: .5rem 0;
  display: flex;
  align-items: center;
  transition: transform .3s;
  will-change: transform;

  &__photo {
    flex: 0 0 50px;
    border-radius: 50%;
    margin: 0 1rem;
  }

  &__name {
    flex: 1 1 100%;
    color: $link-color;
    margin: 0 1rem;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
      text-decoration-style: solid;
    }
  }

  &__photos,
  &__posts {
    font-size: 1.2rem;
    margin: 0 1rem;
    min-width: 15%;
  }

  &__photos-count {
    background-image: url(data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjMDAwMDAwIiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gICAgPHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPiAgICA8cGF0aCBkPSJNMjEgMTlWNWMwLTEuMS0uOS0yLTItMkg1Yy0xLjEgMC0yIC45LTIgMnYxNGMwIDEuMS45IDIgMiAyaDE0YzEuMSAwIDItLjkgMi0yek04LjUgMTMuNWwyLjUgMy4wMUwxNC41IDEybDQuNSA2SDVsMy41LTQuNXoiLz48L3N2Zz4=);
    background-repeat: no-repeat;
    padding: 0 0 0 2rem;
  }

  &__posts-count {
    background-image: url(data:image/svg+xml;base64,PHN2ZyBmaWxsPSIjMDAwMDAwIiBoZWlnaHQ9IjI0IiB2aWV3Qm94PSIwIDAgMjQgMjQiIHdpZHRoPSIyNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4gICAgPHBhdGggZD0iTTMgMTNoMnYtMkgzdjJ6bTAgNGgydi0ySDN2MnptMC04aDJWN0gzdjJ6bTQgNGgxNHYtMkg3djJ6bTAgNGgxNHYtMkg3djJ6TTcgN3YyaDE0VjdIN3oiLz4gICAgPHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPjwvc3ZnPg==);
    background-repeat: no-repeat;
    padding: 0 0 0 2rem;
  }

  &--next {
    grid-column-start: 5;
  }

  &--offset {
    grid-column-start: 2;
  }

  &--offset-next {
    grid-column-start: 6;
  }
}
</style>
