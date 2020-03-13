<template>
  <article class="user-header">
    <header class="user-header__header">
      <user-header-count
        :value="likesCount"
      ></user-header-count>
    </header>

    <!-- actions -->
    <div class="user-header__actions">
      <buttons-switcher :position="currentHeaderPosition">
        <base-button
          :mods="leftButtonMods"
          @click="handleGraphButtonClick"
        >
          Граф
        </base-button>
        <base-button
          :mods="rightButtonMods"
          @click="handleStatButtonClick"
        >
          Статистика
        </base-button>
      </buttons-switcher>
    </div>
  </article>
</template>

<script>
import { mapGetters } from 'vuex';
import BaseButton from '@/components/BaseButton';
import ButtonsSwitcher from '@/components/ButtonsSwitcher';
import { graph, stats } from '@/router';
import UserHeaderCount from './UserHeaderCount';

const leftButtonMods = ['right-border'];
const rightButtonMods = ['without-left-border'];
const availableTypes = ['graph', 'stats'];

export default {
  name: 'UserHeader',

  components: {
    BaseButton,
    ButtonsSwitcher,
    UserHeaderCount,
  },

  props: {
    type: {
      type: String,
      default: 'graph',
      validator(value) {
        return availableTypes.includes(value);
      },
    },
  },

  data() {
    return {
      currentHeaderPosition: availableTypes.indexOf(this.type),
      leftButtonMods,
      rightButtonMods,
    };
  },
  computed: {
    ...mapGetters({
      likesCount: 'likesCount',
    }),
  },

  methods: {
    handleGraphButtonClick() {
      this.currentHeaderPosition = 0;
      this.$router.push(graph.path);
    },
    handleStatButtonClick() {
      this.currentHeaderPosition = 1;
      this.$router.push(stats.path);
    },
  },
};
</script>

<style lang="scss" scoped>
.user-header {
  border-bottom: 1px solid var(--light-grey-color);
  font-size: 1.5rem;
  padding: .5rem 0 1rem;

  &__header {
    text-align: center;
    margin: 0 0 .5rem 0;
  }

  &__actions {
    text-align: center;
  }
}
</style>
