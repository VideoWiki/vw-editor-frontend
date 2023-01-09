<template>
  <div class="w-full">
    <div>
      <div
        class="flex flex-wrap justify-center -m-2"
        v-if="!recordedAudios[parseInt(sceneNum)] && !recordingInProcess"
      >
        <div class="p-2">
          <vs-button @click="getMedia">{{ $t('studio.voice.v1') }}</vs-button>
          <video
            crossorigin="anonymous"
            :src="this.audio"
            v-if="this.audio !== ''"
          ></video>
        </div>

        <div class="p-2">
          <vs-button @click="openFile">Add Audio</vs-button>
          <input
            type="file"
            :id="`recorded_file_${sceneNum}`"
            @change="(e) => uploadRecordedFile(e, null, '')"
            class="hidden"
            accept="audio/*"
          />
        </div>
      </div>
      <div v-show="recordingInProcess">
        <vs-button
          color="danger"
          icon="pause"
          radius
          class="mb-3 animation"
          @click="stopRecording(false, null)"
        ></vs-button>
        <h6>
          {{ prettyTime | prettify }}
        </h6>
      </div>
      <!--ul
        :class="'playlist_' + sceneNum"
        :id="'play_' + sceneNum">
        class="mb-base"
      ></ul-->
      <div
        class="flex flex-wrap controls-wrapper"
        v-if="recordedAudios[parseInt(sceneNum)] && !recordingInProcess"
      >
        <div
          class="cursor-pointer delete-recording-btn w-full sm:w-1/10"
          @click="removeRecording"
        >
          <vs-icon icon="delete" size="20px" color="primary" />
        </div>
        <div
          class="flex flex-wrap items-center justify-center w-full sm:w-9/10"
        >
          <div class="p-2 flex sm:w-1/2 w-4/5">
            <audio controls :id="'audio_' + sceneNum" style="height: 42px">
              <source
                :src="recordedAudios[parseInt(sceneNum)]"
                type="audio/mp3"
              />
              Your browser does not support the audio element.
            </audio>
          </div>
          <!--div class="p-2">
            <vx-tooltip text="Record again">
              <vs-button icon="replay" @click="startRecording" />
            </vx-tooltip>
          </div-->
          <div class="p-2">
            <vs-button
              style="inline-text: center"
              @click="compareAudioVideoDuration"
              >Add Voice</vs-button
            >
          </div>
          <div class="p-1">
            <vx-tooltip text="Remove Voice">
              <vs-button
                icon="block"
                color="danger"
                :disabled="!addedAudioVideos[parseInt(sceneNum)]"
                @click="removeAddedAudio"
              ></vs-button>
            </vx-tooltip>
          </div>
        </div>
      </div>
    </div>
    <vs-popup title="Confirmation" :active.sync="showModal">
      <p v-if="trimVideo" class="mb-base">
        We will trim the video to match it with audio
      </p>
      <p v-else class="mb-base">
        We will loop the video to match it with audio
      </p>
      <div class="flex justify-around">
        <vs-button type="filled" color="danger" @click="showModal = false"
          >No, Record Again</vs-button
        >
        <vs-button type="filled" color="primary" @click="audioVideoMerge"
          >OK</vs-button
        >
      </div>
    </vs-popup>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import * as microsoftTeams from '@microsoft/teams-js';
export default Vue.extend({
  name: 'teams-permission',
  methods: {},
});
</script>
<script>
import { utils } from '@/mixins';
import * as microsoftTeams from '@microsoft/teams-js';
const MicRecorder = require('mic-recorder-to-mp3');
export default {
  name: 'audio-recorder',
  mixins: [utils],
  props: ['sceneNum'],
  data() {
    return {
      button: null,
      recorder: null,
      recordingInProcess: false,
      recordingReady: false,
      task_Id: null,
      name: '',
      audioBlob: null,
      audioFile: null,
      isRunning: true,
      trimVideo: false,
      showModal: false,
      minutes: 0,
      secondes: 0,
      time: 0,
      timer: null,
      audio: '',
    };
  },
  filters: {
    prettify: function (value) {
      const data = value.split(':');
      let minutes = data[0];
      let secondes = data[1];
      if (minutes < 10) {
        minutes = '0' + minutes;
      }
      if (secondes < 10) {
        secondes = '0' + secondes;
      }
      return minutes + ':' + secondes;
    },
  },
  computed: {
    prettyTime() {
      const time = this.time / 60;
      const minutes = parseInt(time);
      const secondes = Math.round((time - minutes) * 60);
      return minutes + ':' + secondes;
    },
    recordedAudios() {
      return this.$store.state.studio.recordedAudios;
    },
    addedAudioVideos() {
      return this.$store.state.studio.addedAudioVideos;
    },
    styles() {
      return this.$store.state.studio.styles;
    },
  },
  methods: {
    startRecording() {
      this.recorder
        .start()
        .then(() => {
          this.playVid();
          this.startTimer();
          this.recordingInProcess = true;
        })
        .catch((e) => {
          console.error(e);
        });
    },
    setAudio(x) {
      this.audio = x;
    },
    captureMedia() {
      try {
        microsoftTeams.media.selectMedia(
          { maxMediaCount: 1, mediaType: microsoftTeams.media.MediaType.Audio },
          (error, attachments) => {
            this.startRecording();
            // If there's any error, an alert shows the error message/code
            if (error) {
              if (error.message) {
                console.log(
                  '====<><<><>,function can be called in error message'
                );
                this.startRecording();
                alert(' ErrorCode: ' + error.errorCode + error.message);
              } else {
                console.log('====<><<><>,function can be called here in else');
                alert(' ErrorCode: ' + error.errorCode);
                this.startRecording();
              }
            }
            if (attachments) {
              this.startRecording();
              //   // taking the first attachment
              //   // let audioResult = attachments[0];
              //   // setting state for preview
              //   //setAudio("data:" + audioResult.mimeType + ";base64," + audioResult.preview)
              // }
            }
          }
        );
      } catch (e) {
        console.log('======>>>', e);
      }
    },
    getMedia() {
      try {
        //console.log("---------->>>>>>",navigator.platform);
        if (
          navigator.platform == 'Win32' ||
          navigator.platform == 'Win64' ||
          navigator.platform == 'MacIntel' ||
          navigator.platform.indexOf('Linux') === 0
        ) {
          //console.log("[This is web device on browser]");
          navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then((stream) => {
              // console.log('You let me use your mic!', stream);
              this.startRecording();
            })
            .catch((err) => {
              alert('Please enable the Microphone to Start Recording');
              // console.log('No mic for you!',err);
              //this.captureMedia();
            });
        } else {
          alert('Recording feature is not available on IOS/Android');

          // microsoftTeams.getContext((context) => {
          //   console.log("=====>>>",context.hostClientType);
          //   if(context.hostClientType=="web")
          //   {
          //     console.log("[this is MS-Teams APP in Web]");
          //     navigator.mediaDevices
          //       .getUserMedia({ audio: true })
          //       .then((stream) => {
          //         console.log('You let me use your mic!', stream);
          //         this.startRecording();
          //       })
          //       .catch((err) => {
          //         alert("PLEASE ENABLE THE MICROPHONE TO START RECORDING");
          //          console.log('No mic for you!',err);
          //          this.getMedia();
          //       });
          //   }
          //   else
          //   {
          //      alert("START RECORDING FEATURE NOT AVAILABLE ON IOS/ANDROID")
          //   }
          // });
        }
      } catch (e) {
        console.log(e);
      }
    },
    removeAddedAudio() {
      this.$store.commit('studio/setVideoWithAudio', {
        sceneNum: parseInt(this.sceneNum),
        value: null,
      });
    },
    removeRecording() {
      this.$store.commit('studio/setRecordedAudio', {
        sceneNum: parseInt(this.sceneNum),
        value: null,
      });
    },
    openFile() {
      document.getElementById(`recorded_file_${this.sceneNum}`).click();
    },
    uploadRecordedFile(event, taskId, name) {
      console.log('audio1');
      const selectedFile =
        taskId === null
          ? {
              media: event.target.files[0],
              task_id: taskId,
            }
          : {
              media: name,
              task_id: taskId,
            };
      if (selectedFile.media.size / 1048576 > 75) {
        this.$vs.notify({
          title: 'Video too large',
          text: 'upload a video with size less than 75mb',
          color: 'danger',
          time: 3000,
        });
        return;
      }
      this.uploadInProgress = true;
      this.$vs.loading({
        background: '#fff',
        container: `#scene_card_${this.sceneNum}`,
        text: 'Uploading...',
      });
      this.$store
        .dispatch('studio/uploadMedia', selectedFile)
        .then((res) => {
          if (res.data.data) {
            this.$vs.loading.close();
            const dataObj = {
              value: res.data.data.media_url,
              sceneNum: parseInt(this.sceneNum),
            };
            this.$store.commit('studio/setRecordedAudio', dataObj);
            this.$vs.loading.close(
              `#scene_card_${this.sceneNum} > .con-vs-loading`
            );
          } else {
            name = name === '' ? event.target.files[0].name : name;
            taskId = res.data.task_id !== undefined ? res.data.task_id : taskId;
            setTimeout(() => {
              this.uploadRecordedFile(event, taskId, name);
            }, 2000);
          }
        })
        .catch((e) => {
          this.$vs.notify({
            title: 'error Occour',
            text: 'Try Again',
            color: 'danger',
          });
          this.$vs.loading.close(
            `#scene_card_${this.sceneNum} > .con-vs-loading`
          );
        });
    },
    playVid() {
      const vid = document.getElementById('video_' + this.sceneNum);
      if (vid) {
        vid.currentTime = 0;
        vid.play();
      }
    },
    pauseVid() {
      const vid = document.getElementById('video_' + this.sceneNum);
      if (vid) {
        vid.pause();
      }
    },
    startRecording() {
      this.recorder
        .start()
        .then(() => {
          this.playVid();
          this.startTimer();
          this.recordingInProcess = true;
        })
        .catch((e) => {
          console.error(e);
        });
    },
    toBase64(blob) {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      let base64data = null;
      return new Promise((resolve, reject) => {
        reader.onloadend = function () {
          base64data = reader.result;
          // console.log(base64data);
          resolve(base64data);
        };
      });
    },
    stopRecording(repeat, taskId) {
      this.recorder
        .stop()
        .getMp3()
        .then(([buffer, blob]) => {
          this.pauseVid();
          this.resetTimer();

          this.recordingInProcess = false;
          const audioFile = new File(
            buffer,
            'music_' + this.sceneNum + '.mp3',
            {
              type: blob.type,
              lastModified: Date.now(),
            }
          );
          const payload = repeat
            ? {
                media: '',
                task_id: taskId,
              }
            : {
                media: audioFile,
                task_id: taskId,
              };
          this.$vs.loading({
            background: '#fff',
            container: `#scene_card_${this.sceneNum}`,
            text: 'Uploading...',
          });
          this.$store
            .dispatch('studio/uploadMedia', payload)
            .then((url) => {
              if (url.data.data) {
                this.$vs.loading.close();
                const audioObj = {
                  value: url.data.data.media_url,
                  sceneNum: parseInt(this.sceneNum),
                };
                this.$store.commit('studio/setRecordedAudio', audioObj);
                this.$vs.loading.close(
                  `#scene_card_${this.sceneNum} > .con-vs-loading`
                );
              } else {
                setTimeout(() => {
                  this.stopRecording(true, url.data.task_id);
                }, 2000);
              }
            })
            .catch((e) => {
              this.$vs.loading.close(
                `#scene_card_${this.sceneNum} > .con-vs-loading`
              );
              this.$vs.notify({
                title: 'Error Occurred',
                text: 'Try Again',
                color: 'danger',
              });
            });
          // this.$emit('updateComponent');
        });
    },
    compareAudioVideoDuration() {
      try {
        const videoDuration = document.getElementById(
          'video_' + this.sceneNum
        ).duration;
        const audioDuration = document.getElementById(
          'audio_' + this.sceneNum
        ).duration;
        if (Math.abs(audioDuration - videoDuration) > 1) {
          this.showModal = true;
          if (audioDuration < videoDuration) this.trimVideo = true;
        } else this.audioVideoMerge();
      } catch (err) {
        this.audioVideoMerge();
      }
    },
    async handleImageAudioMerge() {
      const dataObj = {
        image_url:
          this.$store.state.studio.selectedFromLibraryMedia[
            parseInt(this.sceneNum)
          ].url,
        motion: 'none',
      };
      try {
        const res = await this.$store.dispatch(
          'studio/addMotionToImage',
          dataObj
        );
        return res.data;
      } catch (err) {
        return false;
      }
    },
    async audioVideoMerge() {
      if (this.showModal) this.showModal = false;
      this.$vs.loading({
        background: '#fff',
        container: `#scene_card_${this.sceneNum}`,
        type: 'sound',
        text: 'Adding Voice...',
      });
      const fd = new FormData();
      const audioUrl = this.recordedAudios[parseInt(this.sceneNum)];
      fd.append('audio', audioUrl);
      let videoUrl = '';
      if (
        this.$store.state.studio.preparedScenesVideos[parseInt(this.sceneNum)]
      ) {
        videoUrl =
          this.$store.state.studio.preparedScenesVideos[
            parseInt(this.sceneNum)
          ];
      } else {
        videoUrl =
          this.$store.state.studio.selectedFromLibraryMedia[
            parseInt(this.sceneNum)
          ].url;
      }
      if (this.isImageUrl(videoUrl)) {
        videoUrl =
          this.getStyle('animation', this.sceneNum) === 'none'
            ? await this.handleImageAudioMerge()
            : this.selectedFromLibraryMedia[parseInt(this.sceneNum)]
                .animationUrl;
      }
      if (!videoUrl) {
        this.$vs.loading.close(
          `#scene_card_${this.sceneNum} > .con-vs-loading`
        );
        return;
      }
      // dataObj.video = videoUrl;
      fd.append('video', videoUrl);
      this.$store
        .dispatch('studio/audioVideoMerge', fd)
        .then((res) => {
          const response = {
            sceneNum: parseInt(this.sceneNum),
            value: res.data.video_url,
          };
          // this.$emit('updateComponent');
          this.$store.commit('studio/setVideoWithAudio', response);
        })
        .catch((err) => {
          console.log(err);
          this.$vs.notify({
            title: 'Error Occured',
            text: 'Cannot merge audio and video',
            color: 'danger',
          });
        })
        .finally(() => {
          this.$vs.loading.close(
            `#scene_card_${this.sceneNum} > .con-vs-loading`
          );
        });
    },
    startTimer() {
      this.isRunning = true;
      if (!this.timer) {
        this.timer = setInterval(() => {
          this.time++;
        }, 1000);
      }
    },
    stopTimer() {
      this.isRunning = false;
      clearInterval(this.timer);
      this.timer = null;
    },
    resetTimer() {
      this.stopTimer();
      this.time = 0;
      this.secondes = 0;
      this.minutes = 0;
    },
  },
  mounted() {
    this.recorder = new MicRecorder({
      bitRate: 128,
    });
  },
};
</script>

<style scoped>
.mainblock {
  margin-bottom: -12%;
}

.controls-wrapper {
  border: 1px solid rgba(114, 71, 196, 0.16);
  border-radius: 4px;
}
.delete-recording-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(114, 71, 196, 0.1);
}
.animation {
  box-shadow: 0 0 0 0 rgb(116, 74, 74);
  animation: pulse 2s infinite;
}
@keyframes pulse {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0px rgba(255, 82, 82, 0.7);
  }

  70% {
    transform: scale(1);
    box-shadow: 0 0 0 15px rgba(255, 82, 82, 0);
  }

  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0px rgba(255, 82, 82, 0);
  }
}
</style>
