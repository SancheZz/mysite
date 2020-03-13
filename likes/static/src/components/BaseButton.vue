<template>
  <button
    :class="classes"
    @click="handleClick"
  >
    <slot></slot>
  </button>
</template>

<script>
import { makeMods } from '@/utils';

export default {
  name: 'BaseButton',

  props: {
    mods: {
      type: Array,
      default: () => ([]),
    },
  },

  computed: {
    classes() {
      return makeMods('base-button', this.mods);
    },
  },

  methods: {
    handleClick(event) {
      this.$emit('click', event);
    },
  },
};
</script>

<style lang="scss" scoped>
.base-button {
  display: inline-block;
  background-color: unset;
  border: 1px solid var(--light-grey-color);
  border-radius: 4px;
  cursor: pointer;
  font-size: var(--font-size);
  padding: .4rem .8rem;

  &--right-border {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  &--left-border {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  &--without-right-border {
    border-right: none;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }

  &--without-left-border {
    border-left: none;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
}
</style>
