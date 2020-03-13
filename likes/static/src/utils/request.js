import { convertKeys } from '@/utils';

/**
 * request
 * create request to the server
 *
 * @param  {Object} config of xhr object
 * @return {Promise}       request
 */
export default function request({
  type = 'GET',
  path = '',
  responseType = 'json',
  withCredentials = false,
  params,
  body,
}) {
  if (type === 'GET' && params) {
    const getParams = new URLSearchParams(params).toString();
    path = `${path}?${getParams}`;
  }

  const xhr = new XMLHttpRequest();
  xhr.open(type, path, true);
  xhr.responseType = responseType;
  xhr.withCredentials = withCredentials;

  if (type === 'GET') {
    xhr.send();
  } else {
    xhr.send(body);
  }

  return new Promise((resolve, reject) => {
    xhr.addEventListener('load', function () {
      const response = responseType === 'json'
        ? convertKeys(this.response)
        : this.response;

      resolve({
        status: this.status,
        response,
      });
    }, false);

    xhr.addEventListener('error', function () {
      reject({
        status: this.status,
        response: this.response,
      });
    }, false);
  });
}
