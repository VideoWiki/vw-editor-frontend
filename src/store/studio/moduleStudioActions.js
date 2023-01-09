/* =========================================================================================
  File Name: moduleAuthActions.js
  Description: Auth Module Actions
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== */

import store from '../store';
import axios from '../../axios';
import constants from '../../../constant';
import { ConnectWallet } from '../../blockchain/Download';

export default {
  // /////////////////////////////////////////////
  // VideoWiki
  // /////////////////////////////////////////////

  fetchVideoChunks({ commit }, meetingId) {
    return new Promise((resolve, reject) => {
      axios
        .get(
          constants.apiUrl + '/api/create_chunks/' + `?meeting_id=${meetingId}`
        )
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  breakVideoIntoScenes({ commit }, reuqestBody) {
    return new Promise((resolve, reject) => {
      axios
        .post(constants.apiUrl + '/api/create_chunks/', reuqestBody)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },

  extractInfoFromUrl({ commit }, requestBody) {
    return new Promise((resolve, reject) => {
      axios
        .post(constants.apiUrl + '/api/extract_info_url/', requestBody)
        .then((res) => {
          resolve(res.data.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  uploadDoc({ commit }, documentFile) {
    var form = new FormData();
    form.append('file', documentFile);
    return new Promise((resolve, reject) => {
      axios
        .post(constants.apiUrl + '/api/extract_info_file/', form)
        .then((res) => {
          // commit('selectVideo', res.data.video_url);
          resolve(res.data.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  trimVideo({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .post(constants.apiUrl + '/api/trim_video/', payload)
        .then((res) => {
          resolve(res.data.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  fastVideo({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .post(constants.apiUrl + '/api/speed_up_video/', payload)
        .then((res) => {
          resolve(res.data.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  summarizeScript({ commit }) {
    return new Promise((resolve, reject) => {
      var data = JSON.stringify({
        model: 'text-davinci-003',
        prompt: store.state.studio.video.script + '.nnTl;dr',
        temperature: 0.7,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });

      var config = {
        method: 'post',
        url: 'https://api.openai.com/v1/completions',
        headers: {
          'Content-Type': 'application/json',
          Authorization:
            'Bearer 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',
        },
        data: data,
      };

      axios(config)
        .then((res) => {
          commit('SET_VIDEO_ATTR', {
            key: 'description',
            value: res.data.choices[0].text.slice(
              2,
              res.data.choices[0].text.length
            ),
          });
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  generateTags({ commit }) {
    return new Promise((resolve, reject) => {
      const dataObj = {
        title: store.state.studio.video.title,
        keywords: [],
      };
      Object.values(store.state.studio.keywords).forEach((arr) => {
        dataObj.keywords.push(...arr);
      });
      axios
        .post(constants.apiUrl + '/api/tags/', dataObj)
        .then((res) => {
          /* let script = '';
          for (const s in res.data) {
            script = script + res.data[s] + ' ';
          } 
          commit('setScript', script); */
          commit('setTags', res.data.tags);
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  sentenceDetection({ commit }, value) {
    return new Promise((resolve, reject) => {
      const dataObj = {
        text: store.state.studio.video.script,
        /* srcLang: store.state.studio.video.language, */
        break_type: value,
      };
      axios
        .post(constants.apiUrl + '/api/sentence_detection/', dataObj)
        .then((res) => {
          commit('setSentences', res.data.sentences);
          commit('setKeywords', res.data.keywords);
          commit('setSourceLanguage', res.data.srcLang);
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  /* keywordExtraction({ commit }) {
    return new Promise((resolve, reject) => {
      const dataObj = {
        text: store.state.studio.video.script,
        srcLang: store.state.studio.video.language
      };
      axios
        .post(constants.apiUrl + '/ke/', dataObj)
        .then(res => {
          commit('setKeywords', res.data);
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  }, */
  audioSuggestions({ commit }) {
    return new Promise((resolve, reject) => {
      const dataObj = {
        keywords: store.state.studio.keywords,
        srcLang: store.state.studio.video.language,
      };
      axios
        .post(constants.apiUrl + '/al/', dataObj)
        .then((res) => {
          // console.log('audio suggestions', res);
          commit('setAudios', res.data);
          resolve(res);
        })
        .catch((err) => {
          console.log('error in audio suggestion', err);
          reject(err);
        });
    });
  },
  audioVideoMerge({ commit }, dataObj) {
    return new Promise((resolve, reject) => {
      /* const headers = {
        'Content-Type': 'multipart/form-data'
      }; */
      axios
        .post(constants.apiUrl + '/api/audio_video_merge/', dataObj)
        .then((res) => {
          // commit('setVideoWithAudio', res.data.url);
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  videoSuggestions({ commit }) {
    return new Promise((resolve, reject) => {
      const dataObj = {
        keywords: store.state.studio.keywords,
        srcLang: store.state.studio.video.language,
      };
      axios
        .post(constants.apiUrl + '/api/media_list/', dataObj)
        .then((res) => {
          commit('setVideos', res.data.videos);
          commit('setImages', res.data.images);
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  searchMedia({ commit }, dataObj) {
    return new Promise((resolve, reject) => {
      axios
        .post(constants.apiUrl + '/api/media_search/', dataObj)
        .then((res) => {
          // commit('setSearchedVideos', res.data);
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  addMotionToImage({ commit }, dataObj) {
    return new Promise((resolve, reject) => {
      axios
        .post(constants.apiUrl + '/api/add_motion/', dataObj)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  editSceneScript({ commit }, sceneScriptData) {
    return new Promise((resolve, reject) => {
      axios
        .post(constants.apiUrl + '/api/add_subtitle_webm/', sceneScriptData)
        .then((res) => {
          // commit("setVideos", res.data)
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  concatenateVideos({ commit }, videoWikiData) {
    return new Promise((resolve, reject) => {
      /* const dataObj = {
        videos
      } */
      axios
        .post(constants.apiUrl + '/api/video_concat/', videoWikiData)
        .then((res) => {
          // commit("setVideos", res.data)
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  download({ commit }) {
    ConnectWallet();
  },
  uploadMedia({ commit }, payload) {
    var form = new FormData();
    form.append('media', payload.media);
    form.append('task_id', payload.task_id);
    return new Promise((resolve, reject) => {
      axios
        .post(constants.apiUrl + '/api/upload_media/', form)
        .then((res) => {
          // commit('selectVideo', res.data.video_url);
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  publishVideo({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .post(constants.apiUrl + '/api/publish_video/', payload)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  saveVideo({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .post(constants.apiUrl + '/api/save_video/', payload)
        .then((res) => {
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  getVideoData({ commit }, videoId) {
    commit('setInitialState');
    return new Promise((resolve, reject) => {
      axios
        .get(constants.apiUrl + '/api/video_details?saved_video_id=' + videoId)
        .then((res) => {
          const apiResponse = res.data.data;
          console.log({ apiResponse });
          const videoData = {};
          const videoDataKeys = [
            'title',
            'script',
            'description',
            'language',
            'bg_music',
            'published_id',
            'url',
          ];
          videoDataKeys.forEach((key) => {
            videoData[key] = apiResponse[key];
          });
          videoData.is_paid = false;
          videoData.saved_id =
            apiResponse.video_type === 'saved'
              ? apiResponse.saved_video_id
              : null;
          commit('SET_VIDEO', videoData);
          commit('setTags', apiResponse.tags);
          const sentences = {};
          const keywords = {};
          Object.entries(apiResponse.scenes).forEach(([key, value]) => {
            sentences[key] = value.subtitle.text;
            keywords[key] = value.keywords;
            commit('setTransition', {
              sceneNum: parseInt(key),
              value: value.transition,
            });
            commit('setRecordedAudio', {
              sceneNum: parseInt(key),
              value: value.audio.url,
            });
            commit('selectMedia', {
              sceneNum: parseInt(key),
              value: {
                id: value.media.lib_media_id,
                url: value.media.url,
              },
            });
            commit('SET_STYLE', {
              sceneNum: parseInt(key),
              value: value.subtitle.style,
            });
          });
          commit('setSentences', sentences);
          commit('setKeywords', keywords);
          commit('skipSubtitles');
          commit('skipMusic');
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
  resetState({ commit }) {
    commit('setInitialState');
  },
  postTxData({ commit }, payload) {
    return new Promise((resolve, reject) => {
      axios
        .post(constants.apiUrl + '/transaction/oceanbuy', payload)
        .then((res) => {
          console.log(res);
          resolve(res);
        })
        .catch((err) => {
          reject(err);
        });
    });
  },
};
