/* =========================================================================================
  File Name: moduleAuthActions.js
  Description: Auth Module Actions
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== */

import jwt from '../../http/requests/auth/jwt/index.js';
import router from '@/router';
import axios from '../../axios';

export default {
  // updateUsername ({ commit }, payload) {
  // payload.user.updateProfile({
  //     displayName: payload.displayName
  // }).then(() => {
  //
  //     // If username update is success
  //     // update in localstorage
  //     const newUserData = Object.assign({}, payload.user.providerData[0])
  //     newUserData.displayName = payload.displayName
  //     commit('UPDATE_USER_INFO', newUserData, {root: true})
  //
  //     // If reload is required to get fresh data after update
  //     // Reload current page
  //     if (payload.isReloadRequired) {
  //       router.push(router.currentRoute.query.to || '/')
  //     }
  // }).catch((err) => {
  //     payload.notify({
  //       time: 8800,
  //       title: 'Error',
  //       text: err.message,
  //       iconPack: 'feather',
  //       icon: 'icon-alert-circle',
  //       color: 'danger'
  //     })
  // })
  // },

  login({ commit }, payload) {
    return new Promise((resolve, reject) => {
      jwt
        .login(payload.userDetails.email, payload.userDetails.password)
        .then((response) => {
          // If there's user data in response
          if (response.data.usersData) {
            // Navigate User to homepage
            // router.push(router.currentRoute.query.to || '/');

            // Set accessToken
            localStorage.setItem('accessToken', response.data.accessToken);

            // Update user details
            /* const userData = {
              uid: 0,
              displayName: response.data.userData.profile.display_name,
              about: ''
            }; */
            const userData = response.data.usersData;
            commit('UPDATE_USER_INFO', userData, { root: true });

            // Set bearer token in axios
            commit('SET_BEARER', response.data.accessToken);

            resolve(response);
          } else {
            reject({ message: 'Wrong Email or Password' });
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  sendResetEmail({ commit }, payload) {
    return new Promise((resolve, reject) => {
      jwt
        .sendResetEmail(payload)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  resetPassword({ commit }, payload) {
    return new Promise((resolve, reject) => {
      jwt
        .resetPassword(payload)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  registerUser({ commit }, payload) {
    const { firstName, lastName, email, password, confirmPassword } =
      payload.userDetails;

    return new Promise((resolve, reject) => {
      // Check confirm password
      if (password !== confirmPassword) {
        reject({ message: "Password doesn't match. Please try again." });
      }

      jwt
        .registerUser(firstName, lastName, email, password)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  logOut({ commit }) {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('accessToken');

    window.location.reload();
    // find a way to logout without refresh
    commit('LOGOUT', null, { root: true });
  },
  updateUserDetails({ commit }, payload) {
    return new Promise((resolve, reject) => {
      jwt
        .updateUser(payload)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  changePassword({ commit }, payload) {
    return new Promise((resolve, reject) => {
      jwt
        .changePassword(payload)
        .then((response) => {
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  fetchAccessToken() {
    return new Promise((resolve) => {
      jwt.refreshToken().then((response) => {
        resolve(response);
      });
    });
  },
  // for Metamask
  getNonce({ commit }, payload) {
    return new Promise((resolve, reject) => {
      jwt
        .generateNonce(payload)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  sendSignature({ commit }, payload) {
    return new Promise((resolve, reject) => {
      jwt
        .verifySignature(payload)
        .then((response) => {
          // If there's user data in response
          if (response.data.usersData) {
            // Navigate User to homepage
            // router.push(router.currentRoute.query.to || '/');

            // Set accessToken
            localStorage.setItem('accessToken', response.data.accessToken);

            // Update user details
            /* const userData = {
                uid: 0,
                displayName: response.data.userData.profile.display_name,
                about: ''
              }; */
            const userData = response.data.usersData;
            commit('UPDATE_USER_INFO', userData, { root: true });

            // Set bearer token in axios
            commit('SET_BEARER', response.data.accessToken);

            resolve(response);
          } else {
            reject({ message: 'Wrong Email or Password' });
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  sendAccessToken({ commit }, payload) {
    return new Promise((resolve, reject) => {
      jwt
        .generateAccessToken(payload)
        .then((response) => {
          // If there's user data in response
          if (response.data.usersData) {
            // Navigate User to homepage
            // router.push(router.currentRoute.query.to || '/');

            // Set accessToken
            localStorage.setItem('accessToken', response.data.accessToken);

            // Update user details
            /* const userData = {
                uid: 0,
                displayName: response.data.userData.profile.display_name,
                about: ''
              }; */
            const userData = response.data.usersData;
            commit('UPDATE_USER_INFO', userData, { root: true });

            // Set bearer token in axios
            commit('SET_BEARER', response.data.accessToken);

            resolve(response);
          } else {
            reject({ message: 'Wrong Email or Password' });
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};
