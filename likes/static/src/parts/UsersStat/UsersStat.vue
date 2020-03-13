<template>
  <div class="users-stat">
    <div>
      <transition-group
        name="item"
        class="users-stat__grid"
      >
        <user-stat-item
          v-for="(user, index) in users"
          :key="user.id"
          :user="user"
          :mods="calculateMods(index)"
        ></user-stat-item>
      </transition-group>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import UserStatItem from './UserStatItem';

const mods = [undefined, 'next', 'offset', 'offset-next'];

export default {
  name: 'UsersStat',

  components: {
    UserStatItem,
  },

  data() {
    return {
      users: [],
      idTimeout: undefined,
    };
  },
  computed: {
    ...mapGetters({
      likers: 'likers',
    }),
  },

  watch: {
    likers() {
      this.calculateUsers();
    },
  },
  mounted() {
    const callNext = () => {
      this.sortUsers();
      this.idTimeout = setTimeout(callNext, 2000);
    };

    this.calculateUsers();
    callNext();
  },
  beforeDestroy() {
    clearTimeout(this.idTimeout);
  },

  methods: {
    calculateMods(index) {
      const mod = mods[index % 4];

      if (mod) {
        return [mod];
      }
    },
    calculateUsers() {
      for (const liker of this.likers) {
        const { id, ...likerData } = liker;
        const condition = this.users.some((user) => {
          if (user.id === id) {
            Object.assign(user, likerData);
            return true;
          }
        });

        if (!condition) {
          this.users.push(liker);
        }
      }
    },
    sortUsers() {
      const { users } = this;

      for (let i = 0; i < users.length - 1; i += 1) {
        for (let j = i + 1; j < users.length; j += 1) {
          const left = users[i];
          const right = users[j];

          if (left.likes < right.likes) {
            users[i] = right;
            users[j] = left;
          }
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.users-stat {
  margin: 1rem auto 0;
  width: 1000px;

  &__grid {
    display: grid;
    grid-template: 1fr / repeat(10, 1fr);
  }
}

.item-move {
  transition: transform 1s;
}
</style>
