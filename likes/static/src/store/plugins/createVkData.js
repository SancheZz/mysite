import { convertKeys } from '@/utils';

export default function createVkData(store) {
  const { commit } = store;
  const wsPath = process.env.NODE_ENV === 'production'
    ? `wss://${location.host}/likes/api/ws`
    : `ws://${location.host}/likes/api/ws`;
  const ws = new WebSocket(wsPath);

  function send(message) {
    if (ws.readyState) {
      ws.send(message);
    } else {
      ws.addEventListener('open', function () {
        this.send(message);
      }, false);
    }
  }

  store.subscribe(({ type, payload }) => {
    if (type === 'setUser') {
      send(payload.accessToken);
    }
  });

  ws.addEventListener('message', ({ data }) => {
    const responseData = JSON.parse(data);
    const { type, post, photo, user } = convertKeys(responseData);

    switch (type) {
      case 'photo':
        commit('setPhoto', {
          photo,
          user,
        });
        break;

      case 'post':
        commit('setPost', {
          post,
          user,
        });
    }
  }, false);
}
