<template>
  <div class="flex items-center justify-center">
    <!--vue-progress-bar class="absolute"></vue-progress-bar-->
    <div class="flex items-center justify-center">
      <vs-button
        type="filled"
        class="mr-2"
        :size="$store.state.windowWidth < 400 ? 'small' : 'default'"
        @click="$emit('search', sceneNum)"
        >Search</vs-button
      >
      <input
        type="file"
        :id="`add_scene_${sceneNum}`"
        @change="uploadFile($event, null, '')"
        class="hidden"
        accept="video/*,image/*"
      />
      <vs-button
        type="filled"
        @click="chooseFile"
        :size="$store.state.windowWidth < 400 ? 'small' : 'default'"
        >Upload</vs-button
      >
    </div>
    <!--vs-popup title="Select Motion" :active.sync="showEffectModal">
      <div class="flex flex-wrap -m-3">
        <div class="w-1/5 p-3">
          <vx-card
            class="effect-card bg-primary text-white"
            @click="selectImage('no_motion')"
          >
            <div class="-m-3 text-center">
              <vs-icon icon="not_interested" size="45px" />
              <p>None</p>
            </div>
          </vx-card>
        </div>
        <div class="w-1/5 p-3">
          <vx-card
            class="effect-card bg-primary text-white"
            @click="selectImage('zoom_in')"
          >
            <div class="-m-3 text-center">
              <vs-icon icon="zoom_in" size="45px" />
              <p>Zoom In</p>
            </div>
          </vx-card>
        </div>
        <div class="w-1/5 p-3">
          <vx-card
            class="effect-card bg-primary text-white"
            @click="selectImage('zoom_out')"
          >
            <div class="-m-3 text-center">
              <vs-icon icon="zoom_out" size="45px" />
              <p>Zoom out</p>
            </div>
          </vx-card>
        </div>
      </div>
    </vs-popup-->
  </div>
</template>
<script>
export default {
  name: 'VideoNotFound',
  props: ['sceneNum'],
  data() {
    return {
      showEffectModal: false,
      currentUploadedImage: null,
      name: '',
    };
  },
  methods: {
    chooseFile() {
      document.getElementById(`add_scene_${this.sceneNum}`).click();
    },
    uploadFile(event, taskId, name) {
      console.log('Video not found');
      console.log(taskId);
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
        container: `#upload_scene_${this.sceneNum}`,
      });
      this.$store
        .dispatch('studio/uploadMedia', selectedFile)
        .then((res) => {
          if (res.data.data) {
            this.$store.commit('studio/selectMedia', {
              sceneNum: this.sceneNum,
              value: {
                id: null,
                url: res.data.data.media_url,
              },
            });
            this.currentUploadedImage = res.data.data.media_url;
            const dataObj = {
              fileName: name,
              url: res.data.data.media_url,
            };
            this.$store.commit('studio/setUploadedMedia', dataObj);
            this.$vs.loading.close(
              `#upload_scene_${this.sceneNum} > .con-vs-loading`
            );
          } else {
            setTimeout(() => {
              console.log(res.data.task_id === undefined);
              taskId =
                res.data.task_id !== undefined ? res.data.task_id : taskId;
              name = name === '' ? event.target.files[0].name : name;
              this.uploadFile(event, taskId, name);
            }, 2000);
          }
        })
        .catch(() => {
          this.$vs.notify({
            title: 'Error Occurred',
            text: 'Media upload failed',
            color: 'danger',
          });
          this.$vs.loading.close(
            `#upload_scene_${this.sceneNum} > .con-vs-loading`
          );
        });
    },
  },
};
</script>
<style scoped>
.effect-card {
  display: flex;
  justify-content: center;
}
.effect-card:hover {
  cursor: pointer;
  transform: translateY(-5px);
  box-shadow: 0px 4px 25px 0px rgba(0, 0, 0, 0.25);
}
</style>
