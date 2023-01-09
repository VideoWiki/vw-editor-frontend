<template>
  <div>
    <vx-card class="scene-card vs-con-loading__container" id="preview-loading">
      <div v-if="concatStatus">
        <h4 class="text-center mb-4">Preview</h4>
        <p class="font-semibold items-left mb-base" style="white-space: normal">
          Note: This is a low quality video for rendering purposes only, when
          your are ready, extract a high quality video by publishing it.
        </p>
        <video
          @loadedmetadata="setDuration"
          crossorigin="anonymous"
          width="100%"
          height="auto"
          :src="videoData.url"
          id="preview_video"
          controls
        >
          {{ $t('studio.errors.e1') }}
        </video>
        <div class="mb-base"></div>
        <div class="flex justify-center align-center flex-wrap">
          <div v-if="!insideIframe" class="p-2">
            <span v-if="teamsInitialized === true"></span>
            <vs-button v-else @click="beforeSubmit('publish')">{{
              $t('studio.publish.p1')
            }}</vs-button>
          </div>
          <div class="p-2">
            <span v-if="teamsInitialized === true"></span>
            <vs-button v-else @click.prevent="beforeSubmit('save')"
              >Save Draft</vs-button
            >
          </div>

          <div class="p-2">
            <span v-if="teamsInitialized === true"></span>
            <vs-dropdown
              v-else
              vs-custom-content
              vs-trigger-click
              flex
              justify-end
            >
              <vs-button size="medium"> Download </vs-button>

              <vs-dropdown-menu>
                <template v-for="typeOfVideo in typeOfVideos">
                  <vs-dropdown-item
                    :key="typeOfVideo.text"
                    class="px-4 vs-con-loading__container"
                    id="download-with-loading"
                    icon="get_app"
                    :disabled="downloadInProgress"
                    @click.prevent="functionDownload(typeOfVideo.value)"
                  >
                    <span>
                      {{ typeOfVideo.text }}
                    </span>
                  </vs-dropdown-item>
                </template>
              </vs-dropdown-menu>
            </vs-dropdown>
            <div
              v-if="teamsInitialized === true"
              class="centerx con-exemple-prompt"
            >
              <div class="modelx">
                {{ val == null ? 'null' : val }}
              </div>

              <div class="modelx"></div>
              <vs-button
                @click="activePrompt2 = true"
                color="primary"
                type="border"
                >Share & Download</vs-button
              >

              <vs-prompt
                color="rgb(69,68,202)"
                @cancel="valMultipe.value1 = ''"
                @accept="handleDownloadTeams()"
                @close="close"
                :is-valid="validName"
                :active.sync="activePrompt2"
              >
                <div class="con-exemple-prompt modelBox">
                  <vs-alert color="dark" icon="new_releases">
                    Note: Copy the URL below to share the video link
                  </vs-alert>
                  <div class="urlDiv">
                    <p>
                      {{ video_url }}
                    </p>
                  </div>
                  Please enter your email ID to receive high quality video
                  download link.
                  <vs-input placeholder="Email" v-model="valMultipe.value1" />

                  <vs-alert
                    :active="!validateEmail"
                    color="danger"
                    icon="new_releases"
                  >
                    Please Enter Valid Email Id to receive the video link
                  </vs-alert>
                </div>
              </vs-prompt>
            </div>
          </div>
        </div>
      </div>
      <div
        v-else
        class="flex justify-center items-center"
        style="height: 430px"
      >
        <div class="p-4">
          <vs-icon icon="error" size="80px" color="danger" />
          <h4 class="mb-base">Your Video preview was not generated</h4>
          <vs-button type="filled" @click="collectScenes">Retry</vs-button>
        </div>
      </div>
    </vx-card>
    <Transaction
      :show="showTransactionModal"
      transactionType="Publish"
      :transactionPhase="currentTxPhase"
      @close="showTransactionModal = false"
      @retry="publishVideo"
    />
  </div>
</template>

<script>
import * as microsoftTeams from '@microsoft/teams-js';
import constants from '../../../constant';
import axios from 'axios';
import Transaction from '@/views/components/Transaction/Transaction.vue';
import { mapState } from 'vuex';
import { utils } from '@/mixins/index.js';
import { ethers } from 'ethers';
export default {
  name: 'PublishVideo',
  mixins: [utils],
  components: {
    Transaction,
  },
  data() {
    return {
      typeOfVideos: [
        { text: 'Low Quality', value: 0 },
        { text: 'High Quality', value: 1 },
      ],

      activePrompt: false,
      activePrompt2: false,
      duration: 0,
      val: '',
      valMultipe: {
        value1: '',
        value2: '',
      },
      player: null,
      finalScenes: [],
      indexs: 0,
      constants,
      // showAlert: false,
      task_id: null,
      videoId: null,
      downloadInProgress: false,
      showTransactionModal: false,
      concatStatus: true,
      teamsInitialized: false,
      currentTxPhase: 'Processing',
      previewReq: Function,
      video_url: '',
    };
  },

  created() {
    var teamsInitialized = false;
    microsoftTeams.initialize(() => {
      teamsInitialized = true;
    });

    setTimeout(() => {
      if (teamsInitialized) {
        this.teamsInitialized = true;
      } else {
      }
    }, 0);
  },
  computed: {
    ...mapState('auth', ['isUserLoggedIn']),
    getFilename() {
      return `${this.$store.state.studio.video.title}_videowiki.mp4`;
    },
    validName() {
      return this.valMultipe.value1 && this.valMultipe.value2;
    },
    usersData() {
      return this.$store.state.AppActiveUser;
    },
    videoData() {
      return this.$store.state.studio.video;
    },
    videoTxData() {
      return this.$store.state.studio.videoTxData;
    },
    scenes() {
      return this.$store.state.studio.scenes;
    },
    sceneTransitionList() {
      return this.$store.state.studio.sceneTransition;
    },
    insideIframe() {
      return this.$store.state.insideIframe;
    },
  },
  mounted() {
    if (this.$route.params.videoId) {
      this.videoId = this.$route.params.videoId;
    }
    if (this.videoData.url) {
      this.$vs.dialog({
        type: 'confirm',
        color: 'primary',
        title: `Confirm`,
        acceptText: 'Yes',
        text: 'Do you want to generate the Preview again ?',
        accept: this.collectScenes,
      });
    } else {
      this.collectScenes();
    }
  },
  methods: {
    functionDownload(index) {
      if (index === 0) {
        this.handleDownloadLowQualityVideo();
      } else if (this.isUserLoggedIn()) {
        this.handleDownloadHighQualityVideo();
      } else {
        this.$store.commit('TOGGLE_LOGIN_POPUP', true);
      }
    },
    setDuration(e) {
      this.duration = e.target.duration;
    },
    copyVideoLink() {
      navigator.clipboard.writeText(this.video_url);
      this.$vs.notify({
        color: 'primary',
        title: 'URL Copied',
        text: this.video_url,
      });
    },
    acceptAlert(color) {
      this.$vs.notify({
        color: 'success',
        title: 'Accept Selected',
        text: 'Lorem ipsum dolor sit amet, consectetur',
      });
    },

    close() {
      this.$vs.notify({
        color: 'danger',
        title: 'Closed',
        text: 'You close a dialog!',
      });
    },
    collectScenes() {
      this.concatStatus = true;
      this.finalScenes = [];
      this.$store.commit('studio/setPreviewVideo', null);
      this.$vs.loading({
        background: '#fff',
        container: '#preview-loading',
        text: 'Generating Preview...',
      });
      const libraryItems = this.$store.state.studio.selectedFromLibraryMedia;
      const preparedScene = this.$store.state.studio.preparedScenesVideos;
      const audioVideo = this.$store.state.studio.addedAudioVideos;
      // TODO: remove this for loop use forEach
      for (let i = 0; i <= Object.keys(this.scenes).length; i++) {
        if (audioVideo[i]) {
          this.finalScenes.push(audioVideo[i]);
        } else if (preparedScene[i]) {
          this.finalScenes.push(preparedScene[i]);
        } else if (libraryItems[i]) {
          const requiredUrl =
            libraryItems[i].animationUrl || libraryItems[i].url;
          this.finalScenes.push(requiredUrl);
        }
      }
      this.concatVideos();
    },
    async concatVideos() {
      const collectedScenes = {
        videos: this.finalScenes,
        task_id: this.task_id,
        isPreview: 1,
        width: '480',
        height: '360',
        motions: this.sceneTransitionList,
        bgm: this.videoData.bg_music.url || null,
        email: '',
      };
      try {
        const apiResponse = await this.$store.dispatch(
          'studio/concatenateVideos',
          collectedScenes
        );
        console.log(apiResponse);
        if (!this.task_id) this.task_id = apiResponse.task_id;
        if (apiResponse.data && apiResponse.data.video_url) {
          this.video_url = apiResponse.data.video_url;
          this.$store.commit('studio/SET_VIDEO_ATTR', {
            key: 'url',
            value: apiResponse.data.video_url,
          });
          this.$vs.loading.close('#preview-loading > .con-vs-loading');
        } else {
          this.previewReq = setTimeout(() => this.concatVideos(), 15000);
        }
      } catch (err) {
        this.concatStatus = false;
        this.$vs.loading.close('#preview-loading > .con-vs-loading');
        this.$vs.notify({
          title: 'Error',
          text: err.response.data.message,
          color: 'danger',
        });
      }
    },
    async publishVideo(ipfsUrl) {
      this.$Progress.start();
      this.$vs.loading({ color: 'transparent' });
      const data = this.getPostData();
      console.log({ publishVideo: data });
      /* Ajax call start */
      this.$store
        .dispatch('studio/publishVideo', data)
        .then((res) => {
          if (this.videoData.is_paid) {
            const payload = {
              dataToken: this.videoTxData.services[0].datatokenAddress,
              dod: this.videoTxData.id,
              exchange_key: this.videoTxData.nftAddress,
              paid: this.videoData.is_paid,
              video_id: res.data.id,
              price: '1',
              preview_url: ipfsUrl,
            };
            this.$store
              .dispatch('studio/postTxData', payload)
              .then(() => {
                this.$Progress.finish();
                this.$vs.loading.close();
                this.$router.push('/dashboard');
                this.$vs.notify({
                  title: 'Success',
                  text: 'Video Published Successfully',
                  color: 'success',
                });
              })
              .catch((err) => {
                console.log(err);
                this.$Progress.fail();
                this.$vs.loading.close();
                this.$vs.notify({
                  title: 'Error',
                  text: 'Video Tx data was not saved',
                  color: 'danger',
                });
              });
            return;
          }
          this.$Progress.finish();
          this.$vs.loading.close();
          this.$router.push('/dashboard');
          this.$vs.notify({
            title: 'Success',
            text: 'Video Published Successfully',
            color: 'success',
          });
        })
        .catch((err) => {
          console.log(err);
          this.$Progress.fail();
          this.$vs.loading.close();
          this.$vs.notify({
            title: 'Error',
            text: 'Video was not published',
            color: 'danger',
          });
        });
    },
    prettyTime(val) {
      const minutes = parseInt(val / 60);
      const seconds = parseInt(val);
      return (
        (minutes < 10 ? `0${minutes}` : minutes) +
        ':' +
        (seconds < 10 ? `0${seconds}` : seconds)
      );
    },
    async handlePaidVideo() {
      const walletAddress = this.$store.state.accountAddress;
      if (walletAddress) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        var name = await provider.lookupAddress(walletAddress);
        var avatar;
        if (!name) {
          name = this.$store.state.AppActiveUser.first_name;
        }
        if (name) {
          const resolver = await provider.getResolver(name);
          avatar = await resolver.getAvatar();
        }
        var payload = {
          user: {
            stepCurrent: 5,
            chainId: 5,
            accountId: '0x493789c3A5215672ecC6F7153f09a0ADC11A053e',
          },
          metadata: {
            nft: {
              name: 'Ocean Data NFT',
              symbol: 'OCEAN-NFT',
              description:
                'This NFT represents an asset in the Ocean Protocol v4 ecosystem.',
              external_url: 'https://market.oceanprotocol.com',
              background_color: '141414',
              image_data:
                "data:image/svg+xml,%3Csvg viewBox='0 0 99 99' fill='undefined' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23ff409277' d='M0,99L0,27C8,24 16,22 25,21C33,19 42,17 50,20C57,22 64,29 72,31C79,32 89,27 99,23L99,99Z'/%3E%3Cpath fill='%23ff4092bb' d='M0,99L0,49C8,52 17,55 26,55C34,54 41,49 50,46C58,42 66,40 75,41C83,41 91,44 99,48L99,99Z'%3E%3C/path%3E%3Cpath fill='%23ff4092ff' d='M0,99L0,72C8,74 16,76 24,77C31,77 36,74 46,73C55,71 67,69 77,69C86,68 92,69 99,71L99,99Z'%3E%3C/path%3E%3C/svg%3E",
            },
            transferable: true,
            type: 'dataset',
            name: this.videoData.title, // set by user
            author: name, // set by user
            description: this.videoData.description, // set by user
            tags: this.$store.state.studio.keywords[0],
            termsAndConditions: true,
            dockerImage: '',
            dockerImageCustom: '',
            dockerImageCustomTag: '',
            dockerImageCustomEntrypoint: '',
          },
          services: [
            {
              files: [
                {
                  url: this.$store.state.studio.video.url,
                  contentLength: '48050',
                  contentType: 'video/webm',
                  index: 0,
                  valid: true,
                },
              ],
              links: [
                {
                  url: '',
                  type: '',
                },
              ],
              dataTokenOptions: {
                name: 'Propitious Fugu Token',
                symbol: 'PROFUG-19',
              },
              timeout: 'Forever',
              access: 'access',
              providerUrl: {
                url: 'https://v4.provider.goerli.oceanprotocol.com',
                valid: true,
                custom: false,
              },
              computeOptions: {
                allowRawAlgorithm: false,
                allowNetworkAccess: true,
                publisherTrustedAlgorithmPublishers: [],
                publisherTrustedAlgorithms: [],
              },
              algorithmPrivacy: false,
            },
          ],
          pricing: {
            baseToken: {
              address: '0xcfdda22c9837ae76e0faa845354f33c62e03653a', // keep same
              symbol: 'OCEAN',
              name: 'Ocean Token',
              decimals: 18,
            },
            price: 1,
            type: 'fixed',
            freeAgreement: false,
            amountDataToken: 1000,
          },
        };
        this.$store.commit('SET_CURRENT_TRANSACTION_STEP', 1);
        this.currentTxPhase = 'Processing';
        this.showTransactionModal = true;
        try {
          const videoPayload = {
            video_url: this.$store.state.studio.video.url,
            speed_factor: this.duration > 299 ? 10 : 5,
            start: `00:${this.prettyTime(0)}`,
            end: `00:${this.prettyTime(this.duration)}`,
          };
          console.log(videoPayload);
          var ipfsUrl = this.$store.dispatch('load', {
            video: videoPayload,
            description: this.videoData.description,
            title: this.videoData.title,
            speed: this.duration > 299 ? 10 : 5,
            name: name,
            walletAddress,
            avatar: avatar.url,
          });
          var VideoPublished = await this.$store.dispatch(
            'publishToOcean',
            payload
          );
          if (VideoPublished) {
            setTimeout(async () => {
              this.showTransactionModal = false;
              ipfsUrl = await ipfsUrl;
              this.publishVideo(ipfsUrl);
            }, 2000);
          } else {
            this.currentTxPhase = 'Failed';
            this.$vs.notify({
              title: 'Not Published',
              text: 'The process was interrupted',
              color: 'danger',
            });
          }
        } catch (error) {
          if (error.code === 4001) this.currentTxPhase = 'Rejected';
          else this.currentTxPhase = 'Failed';
        }
      } else {
        this.$vs.notify({
          text: 'Connect your Wallet First',
          color: 'primary',
        });
      }
    },
    saveVideo() {
      this.$Progress.start();
      this.$vs.loading({ color: 'transparent' });
      const data = this.getPostData();
      console.log({ saveVideo: data });
      /* Ajax call start */
      this.$store
        .dispatch('studio/saveVideo', data)
        .then((res) => {
          this.$Progress.finish();
          this.$vs.loading.close();
          this.$router.push('/myvideos');
          this.$vs.notify({
            title: 'Success',
            text: 'Video Saved Successfully',
            color: 'success',
          });
        })
        .catch((err) => {
          console.log(err);
          this.$Progress.fail();
          this.$vs.loading.close();
          this.$vs.notify({
            title: 'Error',
            text: 'Video was not saved',
            color: 'danger',
          });
        });
    },
    beforeSubmit(actionType) {
      console.log(this.$store.state.studio.video);
      if (this.isUserLoggedIn()) {
        const title = this.videoData.title;
        const desc = this.videoData.description;
        if (title !== '' && desc !== '') {
          actionType === 'publish'
            ? this.videoData.is_paid
              ? this.handlePaidVideo()
              : this.publishVideo('')
            : this.saveVideo();
        } else {
          this.$vs.notify({
            title: 'Input Missing',
            text: 'Title/Description cannot be empty',
            color: 'primary',
          });
        }
      } else {
        this.$store.commit('TOGGLE_LOGIN_POPUP', true);
      }
      return false;
    },

    getPostData() {
      const studioState = this.$store.state.studio;
      const data = {
        user_id: this.usersData.id,
        ...this.videoData,
        duration: document.getElementById('preview_video').duration,
        scenes: this.getSceneData(studioState),
        tags: studioState.tags,
      };
      return data;
    },
    getSceneData(studioState) {
      const scenes = {};
      Object.values(this.scenes)
        .filter((scene, index) => {
          return !!studioState.selectedFromLibraryMedia[index];
        })
        .forEach((value, index) => {
          const { font_color, text_position, background_color, animation } =
            studioState.styles[index];

          scenes[index] = {
            title: `sceneNo${index}`,
            transition: this.sceneTransitionList[index] || '',
            subtitle: {
              text: value,
              style: {
                alignment: 'left',
                font_style: 'roboto',
                font_size: '14',
                font_type: 'bold',
                text_position,
                font_color,
                background_color,
              },
            },
            media: {
              url: studioState.selectedFromLibraryMedia[index].url,
              source: 'library',
              type: 'image',
              source_site: 'pixaby',
              lib_media_id: studioState.selectedFromLibraryMedia[index].id,
              duration: null,
              animation: animation || 'none',
            },
            audio: {
              source: 'upload',
              url: studioState.recordedAudios[index] || null,
            },
            keywords: studioState.keywords[index],
          };
          // get media source and type
          if (scenes[index].media.url) {
            const videoUrl = new URL(scenes[index].media.url);
            const urlType = this.isImageUrl(scenes[index].media.url)
              ? 'image'
              : 'video';
            scenes[index].media.source =
              videoUrl.origin === constants.apiUrl ? 'upload' : 'library';
            scenes[index].media.type = urlType;
          }
        });
      return scenes;
    },

    handleDownloadLowQualityVideo() {
      this.downloadInProgress = true;
      this.$vs.loading({
        background: 'primary',
        color: '#fff',
        container: '#download-with-loading',
        scale: 0.45,
      });
      axios
        .get(this.videoData.url, { responseType: 'blob' })
        .then((response) => {
          const blob = new Blob([response.data], { type: 'video/mp4' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = this.getFilename;
          console.log(link);
          link.click();
          URL.revokeObjectURL(link.href);
          this.$vs.notify({
            title: 'Success',
            text: 'Video Download Successfully',
            color: 'success',
            fixed: true,
            click: () => {},
          });
        })
        .catch(() => {
          this.$vs.notify({
            title: 'Error Occured',
            text: 'Download Failed',
            color: 'danger',
          });
        })
        .finally(() => {
          this.downloadInProgress = false;
          this.$vs.loading.close('#download-with-loading > .con-vs-loading');
        });
    },
    async handleDownloadHighQualityVideo() {
      const collectedScenes = {
        videos: this.finalScenes,
        task_id: null,
        isPreview: 0,
        width: '1280',
        height: '720',
        motions: this.sceneTransitionList,
        bgm: this.videoData.bg_music.url || null,
        email: this.usersData.email,
      };
      try {
        const apiResponse = await this.$store.dispatch(
          'studio/concatenateVideos',
          collectedScenes
        );
        console.log(apiResponse);
        this.$vs.notify({
          title: 'Success',
          text: 'You will receive download link shortly via email',
          color: 'success',
          fixed: true,
          click: () => {},
        });
      } catch (err) {
        this.$vs.notify({
          title: 'Error',
          text: err.response.data.message,
          color: 'danger',
        });
      }
    },
    beforeDestroy() {
      clearTimeout(this.previewReq);
    },
    async handleDownloadTeams() {
      const collectedScenes = {
        videos: this.finalScenes,
        task_id: null,
        isPreview: 1,
        width: '1280',
        height: '720',
        motions: this.sceneTransitionList,
        bgm: this.videoData.bg_music.url || null,
        email: this.valMultipe.value1,
      };
      this.$vs.notify({
        color: 'success',
        title: 'Processing...',
        text: 'We got your Email ID! ...Please wait',
      });
      try {
        const apiResponse = await this.$store.dispatch(
          'studio/concatenateVideos',
          collectedScenes
        );
        console.log(apiResponse);
        this.$vs.notify({
          title: 'Success',
          text: 'You will receive download link shortly via email',
          color: 'success',
          fixed: true,
          click: () => {},
        });
      } catch (err) {
        this.$vs.notify({
          title: 'Error',
          text: err.response.data.message,
          color: 'danger',
        });
      }
    },
  },
};
</script>

<style scoped>
.vs-con-loading__container {
  z-index: 10 !important;
}
.shareicon {
  margin-bottom: 0px !important;
}
.modelBox * {
  margin-bottom: 15px;
}

.urlDiv {
  border: 1px solid rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  padding: 0.7rem;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  border-radius: 5px;
}
/* .urlDiv:hover{
  color: rgba(var(--vs-primary), 1);
  border: 1px solid rgba(var(--vs-primary), 1);
} */
.urlDiv p {
  /* overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis; */
  margin-bottom: 0;
  overflow-wrap: break-word;
  word-wrap: break-word;

  -ms-word-break: break-all;
  /* This is the dangerous one in WebKit, as it breaks things wherever */
  word-break: break-all;
  /* Instead use this non-standard one: */
  word-break: break-word;

  /* Adds a hyphen where the word breaks, if supported (No Blink) */
  -ms-hyphens: auto;
  -moz-hyphens: auto;
  -webkit-hyphens: auto;
  hyphens: auto;
}
</style>
