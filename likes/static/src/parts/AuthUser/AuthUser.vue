<template>
  <article></article>
</template>

<script>
/* eslint-disable */
import { mapGetters, mapActions } from 'vuex';
import { APP_CLIENT_ID } from '@/consts';
import { graph } from '@/router';

// todo: move it to router
const getParams = new URLSearchParams({
  client_id: APP_CLIENT_ID,
  display: 'page',
  redirect_uri: process.env.NODE_ENV === 'production'
    ? 'https://sanchezz.me/likes/auth'
    : 'http://localhost:8080/auth',
  scope: 2 + 4 + 8192,
}).toString();
const redirectURL = `https://oauth.vk.com/authorize?${getParams}`;

export default {
  name: 'AuthUser',

  computed: {
    ...mapGetters({
      user: 'user',
    }),
  },

  async mounted() {
    const { code } = this.$route.query;

    if (code) {
      try {
        await this.auth({ code });
        this.$router.push(graph.path);
      } catch (error) {
        window.location = redirectURL;
      }
    } else {
      window.location = redirectURL;
    }
  },

  methods: {
    ...mapActions({
      auth: 'auth',
    }),
  },
};
</script>
