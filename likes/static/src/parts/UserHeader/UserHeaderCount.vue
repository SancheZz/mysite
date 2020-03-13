<template>
  <div
    ref="container"
    class="header-count"
  >
    <div class="header-count__heart"></div>
    <div class="header-count__value">
      <transition
        name="move"
        @enter="setContent"
      >
        <!-- current count -->
        <div
          v-if="isCurrentAnimated"
          key="currentCount"
          class="count-value"
        >
          <div
            ref="currentCount"
            class="count-value__content"
          >
            {{ currentCount }}
          </div>
        </div>

        <!-- next count -->
        <div
          v-if="isNextAnimated"
          key="nextCount"
          class="count-value"
        >
          <div
            ref="nextCount"
            class="count-value__content"
          >
            {{ nextCount }}
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UserHeaderCount',

  props: {
    value: {
      type: Number,
      default: 0,
    },
  },

  data() {
    return {
      currentCount: undefined,
      nextCount: undefined,
      isCurrentCountAnimating: true,
    };
  },
  computed: {
    isCurrentAnimated() {
      return this.isCurrentCountAnimating;
    },
    isNextAnimated() {
      return !this.isCurrentCountAnimating;
    },
  },

  watch: {
    value(count) {
      if (this.isCurrentCountAnimating) {
        this.nextCount = count;
      } else {
        this.currentCount = count;
      }

      this.isCurrentCountAnimating = !this.isCurrentCountAnimating;
    },
  },
  mounted() {
    this.currentCount = this.value;
    setTimeout(this.setContent, 0);
    window.addEventListener('resize', this.setContent, false);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.setContent, false);
  },

  methods: {
    setContent() {
      const { container, currentCount, nextCount } = this.$refs;
      const containerStyle = container.style;

      let content;
      if (this.isCurrentCountAnimating) {
        content = currentCount;
      } else {
        content = nextCount;
      }

      containerStyle.setProperty(
        '--current-height',
        `${content.clientHeight}px`,
      );
      containerStyle.setProperty(
        '--current-width',
        `${content.clientWidth}px`,
      );
    },
  },
};
</script>

<style lang="scss" scoped>
$transition-time: .1s;

.header-count {
  display: inline-flex;
  align-items: center;

  &__value {
    position: relative;
    height: var(--current-height);
    width: var(--current-width);
    overflow: hidden;
    will-change: height, width;
  }

  &__heart {
    display: inline-block;
    background: url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2214%22%20viewBox%3D%220%200%2016%2014%22%20style%3D%22fill%3A%233D6899%3B%22%3E%3Cpath%20d%3D%22M8%203.2C7.4-0.3%203.2-0.8%201.4%201%20-0.5%202.9-0.5%205.8%201.4%207.7%201.9%208.2%206.9%2013%206.9%2013%207.4%2013.6%208.5%2013.6%209%2013L14.5%207.7C16.5%205.8%2016.5%202.9%2014.6%201%2012.8-0.7%208.6-0.3%208%203.2Z%22%2F%3E%3C%2Fsvg%3E") no-repeat 0 0;
    margin: 0 .5rem 0 0;
    width: 17px;
    height: 14px;
    opacity: 0.35;
  }
}

.count-value {
  position: absolute;
  top: 0;
  left: 0;
  transition: transform $transition-time ease-in-out;
  will-change: transform;

  &__content {
    white-space: nowrap;
  }
}

/* animates */
.move-enter {
  transform: translate(0, 100%);
}

.move-enter-to {
  transform: translate(0, 0);
}

.move-enter-active,
.move-leave-active {
  transition: transform $transition-time ease-in-out;
}

.move-leave {
  transform: translate(0, 0);
}

.move-leave-to {
  transform: translate(0, -100%);
}
</style>
