import axios from '../../../axios/index.js';
import store from '../../../../store/store.js';
import Constant from '../../../../../constant';

// Token Refresh
let isAlreadyFetchingAccessToken = false;
let subscribers = [];

function onAccessTokenFetched(access_token) {
  subscribers = subscribers.filter((callback) => callback(access_token));
}

function addSubscriber(callback) {
  subscribers.push(callback);
}

export default {
  init() {
    axios.interceptors.response.use(
      function (response) {
        return response;
      },
      function (error) {
        // const { config, response: { status } } = error
        const { config, response } = error;
        const originalRequest = config;

        // if (status === 401) {
        if (response && response.status === 401) {
          if (!isAlreadyFetchingAccessToken) {
            isAlreadyFetchingAccessToken = true;
            store.dispatch('auth/fetchAccessToken').then((access_token) => {
              isAlreadyFetchingAccessToken = false;
              onAccessTokenFetched(access_token);
            });
          }

          const retryOriginalRequest = new Promise((resolve) => {
            addSubscriber((access_token) => {
              originalRequest.headers.Authorization = `Bearer ${access_token}`;
              resolve(axios(originalRequest));
            });
          });
          return retryOriginalRequest;
        }
        return Promise.reject(error);
      }
    );
  },
  login(email, pwd) {
    return axios.post(Constant.apiUrl + '/api/signin/', {
      email: email,
      password: pwd,
    });
  },
  registerUser(firstName, lastName, email, pwd) {
    return axios.post(Constant.apiUrl + '/api/signup/', {
      first_name: firstName,
      last_name: lastName,
      username: email,
      email,
      password: pwd,
      profile: {
        display_name: firstName + ' ' + lastName,
        active: true,
      },
    });
  },
  updateUser(payload) {
    var form = new FormData();
    for (const [key, value] of Object.entries(payload)) {
      form.append(key, value);
    }
    return axios.post(Constant.apiUrl + `/api/user/update/`, form);
  },
  changePassword(payload) {
    return axios.post(Constant.apiUrl + `/api/change_password/`, payload);
  },
  refreshToken() {
    return axios.post(Constant.apiUrl + '/api/auth/refresh-token/', {
      accessToken: localStorage.getItem('accessToken'),
    });
  },
  generateNonce(payload) {
    return axios.post(Constant.apiUrl + `/api/add/public/address/`, payload);
  },
  verifySignature(payload) {
    return axios.post(Constant.apiUrl + `/api/verify/signature/`, payload);
  },
  sendResetEmail(payload) {
    return axios.get(
      Constant.apiUrl +
        `/api/password/reset/mail/?email=${payload}&origin=editor`
    );
  },
  resetPassword(payload) {
    return axios.post(Constant.apiUrl + '/api/user/password/reset/', payload);
  },
  generateAccessToken(payload) {
    return axios.post(Constant.apiUrl + `/api/google/`, payload);
  },
};
