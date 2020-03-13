<template>
  <base-button
    ref="container"
    class="load-button"
    type="button"
    @click="handleClick"
  >
      <!-- default content -->
      <transition
        name="slide-content"
        @enter="setContent"
      >
        <!-- default content -->
        <div
          v-if="checkCurrentPosition('defaultContent')"
          key="defaultContent"
          class="slide-content"
        >
          <div ref="defaultContent">
            <slot name="default-content"></slot>
          </div>
        </div>

        <!-- loading content -->
        <div
          v-if="checkCurrentPosition('loadingContent')"
          key="loadingContent"
          class="slide-content"
        >
          <div ref="loadingContent">
            <slot name="loading-content"></slot>
          </div>
        </div>
      </transition>
    </div>
  </base-button>
</template>

<script>
import BaseButton from '@/components/BaseButton';

export default {
  name: 'LoadButton',

  components: {
    BaseButton,
  },

  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    isNotLoad() {
      return !this.loading;
    },
    position() {
      return this.loading
        ? 'loadingContent'
        : 'defaultContent';
    },
  },

  mounted() {
    const containerEl = this.$refs.container.$el;
    const {
      paddingTop,
      paddingRight,
      paddingBottom,
      paddingLeft,
    } = window.getComputedStyle(containerEl);

    containerEl.style.setProperty('--padding-top', paddingTop);
    containerEl.style.setProperty('--padding-right', paddingRight);
    containerEl.style.setProperty('--padding-bottom', paddingBottom);
    containerEl.style.setProperty('--padding-left', paddingLeft);

    this.setContent();
  },

  methods: {
    handleClick(event) {
      this.$emit('click', event);
    },
    checkCurrentPosition(position) {
      return this.position === position;
    },
    setContent() {
      const containerStyle = this.$refs.container.$el.style;
      const content = this.$refs[this.position];

      if (content) {
        containerStyle.setProperty(
          '--current-height',
          `${content.clientHeight}px`,
        );
        containerStyle.setProperty(
          '--current-width',
          `${content.clientWidth}px`,
        );
      }
    },
  },
};
</script>

<style lang="scss" scoped>
$transition-time: .15s;

.load-button {
  position: relative;
  box-sizing: content-box;
  transition: all $transition-time ease-in-out;
  overflow: hidden;
  height: var(--current-height);
  width: var(--current-width);
  will-change: height, width;
}

.slide-content {
  position: absolute;
  top: 0;
  left: 0;
  will-change: transform;

  padding:
    var(--padding-top)
    var(--padding-right)
    var(--padding-bottom)
    var(--padding-left);
}

.slide-content-enter-active,
.slide-content-leave-active {
  transition: transform $transition-time ease-in-out;
}

.slide-content-enter {
  transform: translate(0, -100%);
}

.slide-content-enter-to {
  transform: translate(0, 0%);
}

.slide-content-leave {
  transform: translate(0%, 0%);
}

.slide-content-leave-to {
  transform: translate(0, calc(100% + var(--current-height)));
}
</style>
