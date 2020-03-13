<template>
  <div class="buttons-switcher">
    <!-- veil -->
    <div
      ref="veil"
      class="buttons-switcher-veil"
    ></div>

    <div
      ref="container"
      class="buttons-switcher__container"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ButtonsSwitcher',

  props: {
    position: {
      type: Number,
      default: 0,
    },
  },

  watch: {
    position() {
      this.translateVeil();
    },
  },
  mounted() {
    this.translateVeil(true);
  },

  methods: {
    translateVeil(isMounting) {
      const { container, veil } = this.$refs;
      const {
        offsetLeft: currentLeft,
        offsetWidth: currentWidth,
      } = veil;

      const {
        offsetLeft: nextLeft,
        offsetWidth: nextWidth,
      } = container.children[this.position];

      const duration = isMounting
        ? 0
        : 100;

      veil.animate([
        {
          transform: `translate(${currentLeft}px, 0)`,
          width: `${currentWidth}px`,
        },
        {
          transform: `translate(${nextLeft}px, 0)`,
          width: `${nextWidth}px`,
        },
      ], {
        fill: 'forwards',
        duration,
      });
    },
    handleHeaderButtonClick(position) {
      this.$emit('changeposition', position);
    },
  },
};
</script>

<style lang="scss" scoped>
.buttons-switcher {
  position: relative;
  display: inline-block;

  &__container {
    display: inline-flex;
  }
}

.buttons-switcher-veil {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(120, 120, 120, .15);
  border-radius: 4px;
  z-index: -1;
}
</style>
