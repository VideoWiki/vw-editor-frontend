<template>
  <div>
    <OptionsModal
      :active.sync="showTransitionModal"
      :options="$options.transitionList"
      title="Select Transition"
      :value="selectedTransition"
      @selected="setTransition($event)"
      @close="showTransitionModal = false"
    />
    <OptionsModal
      :active.sync="showAnimationModal"
      :options="$options.animationList"
      title="Select Animation"
      :value="selectedAnimation"
      @selected="transformImage($event)"
      @close="showAnimationModal = false"
    />
    <vx-card
      v-for="(s, indexs) in scenes"
      :key="indexs"
      :id="'scene_card_' + indexs"
      class="scene-card vs-con-loading__container"
      :class="{
        activeScene:
          $store.state.studio.currentActiveScene === parseInt(indexs) + 1,
      }"
    >
      <template v-if="selectedFromLibraryMedia[parseInt(indexs)]">
        <div class="scene-video mb-4" :id="`scene_video_${indexs}`">
          <video
          crossorigin="anonymous"
            width="100%"
            height="auto"
            controls
            v-if="preparedScenesVideos[parseInt(indexs)]"
            :src="preparedScenesVideos[parseInt(indexs)]"
            type="video/mp4"
          ></video>

          <div v-else>
            <template
              v-if="isImageUrl(selectedFromLibraryMedia[parseInt(indexs)].url)"
            >
              <video
                v-if="selectedFromLibraryMedia[parseInt(indexs)].animationUrl"
                crossorigin="anonymous"
                width="100%"
                height="auto"
                controls
                preload="auto"
                :src="selectedFromLibraryMedia[parseInt(indexs)].animationUrl"
              />
              <img
                v-else
                width="100%"
                height="auto"
                :src="selectedFromLibraryMedia[parseInt(indexs)].url"
              />
            </template>
            <video
              v-else
              width="100%"
              height="auto"
              crossorigin="anonymous"
              controls
              :id="`library_video_${indexs}`"
              :src="selectedFromLibraryMedia[parseInt(indexs)].url"
              @canplay="[showTrimBtn(indexs), showFastBtn(indexs)]"
            >
              {{ $t('studio.errors.e1') }}
            </video>
            <TrimVideo
              :id="`trim_video_${indexs}`"
              class="video-trim-bar"
              :sceneNum="indexs"
              @hideTrimbar="closeTrimBar(indexs)"
            />
            <div
              :id="`trim_btn_${indexs}`"
              class="trim-btn bg-primary"
              @click="[showTrimBar(indexs), closeFastBar(indexs)]"
            >
              <vs-tooltip text="Trim Video">
                <span></span>
                <vs-icon icon="content_cut" size="24px" color="#fff" />
              </vs-tooltip>
            </div>

            <FastVideo
              :id="`fast_video_${indexs}`"
              class="video-fast-bar"
              :sceneNum="indexs"
              @hideFastbar="closeFastBar(indexs)"
            />
            <div
              :id="`fast_btn_${indexs}`"
              class="fast-btn bg-primary"
              @click="[showFastBar(indexs), closeTrimBar(indexs)]"
            >
              <vs-tooltip text="SpeedUp Video">
                <span></span>
                <vs-icon icon="speed" size="24px" color="#fff" />
              </vs-tooltip>
            </div>
          </div>
        </div>
        <div class="flex flex-wrap justify-between items-center mb-4">
          <div class="flex items-center -mx-2 edit-subtitles m-2">
            <div class="px-2">
              <h6 class="text-primary">Subtitles</h6>
            </div>
            <div class="px-2" style="transform: translate(0px, 3px)">
              <position-dropdown
                @input="setStyle('text_position', indexs, $event)"
                :value="getStyle('text_position', indexs)"
              />
            </div>
            <div class="px-2">
              <img
                src="@/assets/images/pages/align-left.svg"
                alt="align-left"
              />
            </div>
            <div class="px-2">
              <v-swatches
                :value="getStyle('font_color', indexs)"
                @input="setStyle('font_color', indexs, $event)"
                popover-x="right"
                popover-y="top"
                swatches="text-advanced"
              >
                <div slot="trigger"><h4 class="text-primary">T</h4></div>
              </v-swatches>
            </div>
            <div class="px-2">
              <v-swatches
                :value="getStyle('background_color', indexs)"
                @input="setStyle('background_color', indexs, $event)"
                popover-x="right"
                popover-y="top"
                swatches="text-advanced"
              >
                <div
                  slot="trigger"
                  class="bg-primary rounded-sm"
                  style="width: 24px"
                >
                  <h4 class="text-white">T</h4>
                </div>
              </v-swatches>
            </div>
            <div class="px-2">
              <vx-tooltip text="Undo">
                <button
                  @click="removePreparedScene(indexs)"
                  style="
                    background: none;
                    border: none;
                    transform: translate(0px, 1px);
                  "
                >
                  <vs-icon
                    type="filled"
                    icon="cancel"
                    color="primary"
                    class="cursor-pointer"
                    size="24px"
                  />
                </button>
              </vx-tooltip>
            </div>
          </div>
          <div
            title="Select Transition"
            class="cursor-pointer"
            v-if="
              parseInt(indexs) + 1 < Object.keys(scenes).length &&
              isImageUrl(selectedFromLibraryMedia[parseInt(indexs)].url)
            "
            @click="openTransitionModal(parseInt(indexs))"
          >
            <vs-icon icon="shuffle" color="primary" size="20px" />
          </div>
          <div
            class="add-animation-btn bg-primary"
            @click="OpenAnimationModal(indexs)"
            v-if="isImageUrl(selectedFromLibraryMedia[parseInt(indexs)].url)"
          >
            <vs-tooltip text="SpeedUp Video">
              <span></span>
              <vs-icon icon="layers" size="24px" color="#fff" />
            </vs-tooltip>
          </div>
        </div>
        <div class="items-left mb-3">
          <small class="items-left">{{ $t('studio.course.c4') }}</small>
          <p
            contenteditable
            :id="'scene_script_' + indexs"
            class="scene-text"
            style="white-space: normal"
          >
            {{ s }}
          </p>
        </div>
        <vs-button
          @click="prepareScene(indexs, null)"
          :disabled="isVideoUrl(indexs)"
          >{{ $t('studio.course.c5') }} {{ parseInt(indexs) + 1 }}</vs-button
        >
      </template>
      <template v-else>
        <div class="h-72 flex justify-center items-center">
          <img
            src="../../assets/images/logo/logo.svg"
            width="80px"
            height="80px"
          />
        </div>
      </template>
    </vx-card>
  </div>
</template>

<script>
import vSwatches from 'vue-swatches';
import 'vue-swatches/dist/vue-swatches.css';
import PositionDropdown from './components/PositionDropdown.vue';
import OptionsModal from './components/OptionsModal';
import TrimVideo from './components/TrimVideo';
import FastVideo from './components/FastVideo';
import { transitionList, animationList } from '@/assets/data';
import { utils } from '@/mixins/index.js';
export default {
  name: 'EditScenes',
  mixins: [utils],
  transitionList,
  animationList,
  data() {
    return {
      selectedTransition: 'no_motion',
      showTransitionModal: false,
      currentScene: null,
      chunkUrl: '',
      showAnimationModal: false,
      selectedAnimation: 'none',
    };
  },
  components: {
    vSwatches,
    PositionDropdown,
    OptionsModal,
    TrimVideo,
    FastVideo,
    // AlignmentDropdown
  },
  created() {
    // let a = this.$store.state.studio.selectedFromLibraryMedia;
    // for( let i =0 ; i <a.length, i++){

    // }
    this.chunkUrl = this.$store.state.studio.selectedFromLibraryMedia[0].url;
  },
  computed: {
    preparedScenesVideos() {
      return this.$store.state.studio.preparedScenesVideos;
    },
    selectedFromLibraryMedia() {
      return this.$store.state.studio.selectedFromLibraryMedia;
    },
    styles() {
      return this.$store.state.studio.styles;
    },
    sceneTransitionList() {
      return this.$store.state.studio.sceneTransition;
    },
    scenes() {
      return this.$store.state.studio.scenes;
    },
    currentActiveScene() {
      return this.$store.state.studio.currentActiveScene;
    },
  },
  methods: {
    transformImage(value) {
      this.showAnimationModal = false;
      this.$store.commit('studio/setStyles', {
        prop: 'animation',
        sceneNum: parseInt(this.currentScene),
        value: value,
      });
      if (value === 'none') {
        this.$store.commit('studio/setAnimationURL', {
          sceneNum: parseInt(this.currentScene),
          value: null,
        });
      } else {
        const dataObj = {
          image_url:
            this.selectedFromLibraryMedia[parseInt(this.currentScene)].url,
          motion: value,
        };
        this.$vs.loading({
          background: '#fff',
          container: `#scene_card_${this.currentScene}`,
          text: 'Adding Animation...',
        });
        this.$store
          .dispatch('studio/addMotionToImage', dataObj)
          .then((data) => {
            this.$store.commit('studio/setAnimationURL', {
              value: data.data,
              sceneNum: parseInt(this.currentScene),
            });
          })
          .catch(() => {
            this.$vs.notify({
              title: 'Error',
              text: 'Failed to add Animation',
              color: 'danger',
            });
          })
          .finally(() => {
            this.$vs.loading.close(
              `#scene_card_${this.currentScene} > .con-vs-loading`
            );
          });
      }
    },
    OpenAnimationModal(idx) {
      console.log('options', this.$options);
      if (
        this.$store.state.studio.styles[idx] &&
        this.$store.state.studio.styles[idx].animation
      ) {
        this.selectedAnimation = this.$store.state.studio.styles[idx].animation;
      } else {
        this.$store.commit('studio/setStyles', {
          prop: 'animation',
          sceneNum: parseInt(idx),
          value: this.selectedAnimation,
        });
      }
      this.showAnimationModal = true;
      this.currentScene = idx;
    },
    scriptInput(e) {
      this.$store.commit('studio/editSceneScript', e.target.innerText);
    },
    isVideoUrl(indexs) {
      const videoUrl = this.selectedFromLibraryMedia[parseInt(indexs)].url;
      if (videoUrl) {
        const url = videoUrl.split('.');
        if (url[url.length - 1] === 'gif') return true;
        return false;
      }
      return true;
    },
    /* getStyle(prop, idx) {
      idx = parseInt(idx);
      if (!this.styles[idx] || !this.styles[idx][prop]) {
        this.$store.commit('studio/setStyles', {
          prop: prop,
          sceneNum: idx,
          value: this.defaultStyle[prop]
        });
      }
      return this.styles[idx][prop];
    }, */
    setStyle(prop, idx, value) {
      this.$store.commit('studio/setStyles', {
        prop,
        sceneNum: parseInt(idx),
        value,
      });
    },
    removePreparedScene(indexs) {
      this.$store.commit('studio/setScriptSceneVideo', {
        sceneNum: parseInt(indexs),
        value: null,
      });
      this.$store.commit('studio/setInitialVideo', {
        indexs: indexs,
        value: {
          id: null,
          url: this.chunkUrl,
        },
      });
    },
    async prepareScene(indexs, taskId) {
      this.$vs.loading({
        background: '#fff',
        container: `#scene_card_${indexs}`,
        text: 'Adding Subtitles...',
      });
      this.$store.commit('studio/editSceneScript', {
        value: document.getElementById('scene_script_' + indexs).innerText,
        sceneNum: parseInt(indexs),
      });
      const dataObj = {
        url:
          this.getStyle('animation', indexs) === 'none'
            ? this.selectedFromLibraryMedia[parseInt(indexs)].url
            : this.selectedFromLibraryMedia[parseInt(indexs)].animationUrl,
        script: this.$store.state.studio.scenes[parseInt(indexs)],
        bg_opacity: 0.8,
        transition_type: 'right_to_left',
        font_color: this.styles[indexs].font_color,
        background_color: this.styles[indexs].background_color,
        text_position: this.styles[indexs].text_position,
        task_id: taskId,
      };
      this.$store
        .dispatch('studio/editSceneScript', dataObj)
        .then((res) => {
          if (res.data.video_url) {
            const response = {
              sceneNum: parseInt(indexs),
              value: res.data.video_url,
            };
            this.$store.commit('studio/setScriptSceneVideo', response);
            this.$vs.loading.close(`#scene_card_${indexs} > .con-vs-loading`);
          } else {
            setTimeout(() => {
              this.prepareScene(indexs, res.data.task_id);
            }, 6000);
          }
        })
        .catch((err) => {
          console.log('edit scene script', err);
          /* this.$Progress.fail();
          this.$vs.loading.close(); */
          this.$vs.notify({
            title: 'Error',
            text: 'Cannot merge script with video',
            color: 'danger',
          });
          this.$vs.loading.close(`#scene_card_${indexs} > .con-vs-loading`);
        });
    },
    setTransition(value) {
      this.showTransitionModal = false;
      this.$store.commit('studio/setTransition', {
        sceneNum: this.currentScene,
        value,
      });
    },
    openTransitionModal(idx) {
      if (this.sceneTransitionList[idx]) {
        this.selectedTransition = this.sceneTransitionList[idx];
      }
      this.currentScene = idx;
      // this.setTransition('no_motion');
      this.showTransitionModal = true;
    },
    showTrimBtn(index) {
      const trimBtn = document.getElementById(`trim_btn_${index}`);
      trimBtn.style.display = 'flex';
    },
    showTrimBar(index) {
      const trimBar = document.getElementById(`trim_video_${index}`);
      trimBar.style.display = 'block';
    },
    closeTrimBar(index) {
      const trimBar = document.getElementById(`trim_video_${index}`);
      trimBar.style.display = 'none';
    },

    showFastBtn(index) {
      const fastBtn = document.getElementById(`fast_btn_${index}`);
      fastBtn.style.display = 'flex';
    },
    showFastBar(index) {
      const fastBar = document.getElementById(`fast_video_${index}`);
      fastBar.style.display = 'block';
    },
    closeFastBar(index) {
      const fastBar = document.getElementById(`fast_video_${index}`);
      fastBar.style.display = 'none';
    },
  },
  mounted() {
    window.addEventListener('scroll', this.updateScroll, { passive: true });
    const el = document.getElementById(
      `scene_card_${this.$store.state.studio.currentActiveScene - 1}`
    );
    el.scrollIntoView({ block: 'center' });
  },
  destroyed() {
    window.removeEventListener('scroll', this.updateScroll);
  },
};
</script>

<style scoped>
.vs-con-loading__container {
  z-index: 20 !important;
}
.scene-card {
  min-height: 30rem;
  opacity: 0.2;
  box-shadow: none;
  margin-bottom: 10rem;
}
.scene-video {
  margin: -1.3rem -1.3rem 0;
}
.activeScene {
  box-shadow: 0px 4px 25px 0px rgba(0, 0, 0, 0.1) !important;
  -webkit-box-shadow: 0px 4px 25px 0px rgba(0, 0, 0, 0.1) !important;
  opacity: 1 !important;
}
.items-left {
  text-align: left;
  text-align: -moz-left;
  text-align: -webkit-left;
}
.items-right {
  text-align: right;
  text-align: -moz-right;
  text-align: -webkit-right;
}
.scene-text {
  border: 1px solid gray;
  border-radius: 3px;
  padding: 0.5rem;
}
.edit-subtitles {
  background: rgba(107, 77, 189, 0.06);
  border-radius: 4px;
  padding: 5px;
}
.edit-transition {
  background: rgba(107, 77, 189, 0.06);
  border-radius: 4px;
}

.trim-btn {
  position: absolute;
  height: 20px;
  width: 20px;
  right: 0px;
  padding: 2px;
  top: 25%;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  padding: 20px;
  box-shadow: 0px 4px 25px 0px rgba(0, 0, 0, 0.1) !important;
  cursor: pointer;
  display: none;
}
.fast-btn {
  position: absolute;
  height: 20px;
  width: 20px;
  right: 0px;
  padding: 2px;
  top: 33%;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
  padding: 20px;
  box-shadow: 0px 4px 25px 0px rgba(0, 0, 0, 0.1) !important;
  cursor: pointer;
  display: none;
}
.video-trim-bar,
.video-fast-bar {
  position: absolute;
  right: 3px;
  left: 3px;
  background: #ffff;
  padding: 12px;
  bottom: 15rem;
  display: none;
}

.add-animation-btn {
  position: absolute;
  width: 40px;
  height: 40px;
  top: 33%;
  right: 0;
  border-radius: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 4px 25px 0px rgba(0, 0, 0, 0.1) !important;
  cursor: pointer;
}
</style>
