<template>
  <div @click="goToVideo(video)">
    <!-- video thumbnail -->
    <div class="video-mb">
      <img class="side-video" :src="video.video.thumbnail" alt="Video" />
    </div>

    <!-- video details  -->
    <div class="px-2 py-3 md:p-5">
      <h5 class="text-xl font-medium">{{ video.video.title }}</h5>
      <div class="mt-5 flex md:block justify-between">
        <div class="text-dark text-md">
          {{ video.user.first_name }} {{ video.user.last_name }}
        </div>
        <div
          class="
            text-sm text-gery
            flex
            md:font-normal
            font-semibold
            items-center
            -mx-4
            md:mt-1
          "
        >
          <div class="px-4">{{ Math.floor(Math.random() * 100) }} views</div>
          <div class="px-4">
            {{ video.video.created_at ? getUploadTime : 'unknown' }}
          </div>
        </div>
        <i
          v-if="video.is_paid"
          class="
            vs-icon
            notranslate
            icon-scale
            mt-1
            material-icons
            24px
            vs-icon-primary
          "
          style="width: 24px; height: 24px; font-size: 24px"
          >lock</i
        >
      </div>
    </div>
    <vs-popup ref="custom_modal" :active.sync="showAssetModal">
      <div class="flex items-start -m-5">
        <div class="p-5">
          <img src="@/assets/images/pages/mp4.svg" />
        </div>
        <div class="p-5">
          <div class="mb-2">
            <h4>{{ video.video ? video.video.title : '' }}</h4>
          </div>
          <div>
            <div class="text-2xl" v-if="!isWalletConnected">
              Connect Wallet !
            </div>
            <div v-else class="vs-con-loading__container" id="buy-download">
              <div v-if="!isDownloadable">
                <div class="mb-2">
                  <b>{{ oceanRequired }}</b> OCEAN
                </div>
                <vs-button
                  type="filled"
                  class="mb-2 font-semibold"
                  @click="buyContent"
                  >Buy</vs-button
                >
              </div>
              <vs-button
                v-else
                type="filled"
                class="font-semibold"
                @click="downloadAsset"
                >Download</vs-button
              >
            </div>
          </div>
        </div>
      </div>
      <!--vs-divider /-->
    </vs-popup>
  </div>
</template>

<script>
export default {
  name: 'SideVideo',
  data() {
    return {
      showAssetModal: false,
    };
  },
  props: ['video'],
  computed: {
     isWalletConnected() {
      return this.$store.state.isWalletConnected;
    },
    getUploadTime() {
      const date = Date.now();
      const uploadDate = new Date(this.video.video.created_at);
      const diff = Math.ceil(Math.abs(date - uploadDate) / 1000);
      if (diff < 60) {
        return diff < 30 ? `Just Now` : `${diff} secs ago`;
      } else if (diff < 60 * 60) {
        const mins = Math.round(diff / 60);
        return mins === 1 ? `${mins} min ago` : `${mins} mins ago`;
      } else if (diff < 60 * 60 * 24) {
        const hours = Math.round(diff / (60 * 60));
        return hours === 1 ? `${hours} hr ago` : `${hours} hrs ago`;
      } else if (diff <= 60 * 60 * 24 * 6.5) {
        const days = Math.round(diff / (60 * 60 * 24));
        return days === 1 ? `${days} day ago` : `${days} days ago`;
      } else if (diff < 60 * 60 * 24 * 7 * 4) {
        const weeks = Math.round(diff / (60 * 60 * 24 * 7));
        return weeks === 1 ? `${weeks} week ago` : `${weeks} weeks ago`;
      } else if (diff < 60 * 60 * 24 * 7 * 4 * 12) {
        const months = Math.round(diff / (60 * 60 * 24 * 7 * 4));
        return months === 1 ? `${months} month ago` : `${months} months ago`;
      } else {
        const years = Math.round(diff / (60 * 60 * 24 * 7 * 4 * 12));
        return years === 1 ? `${years} year ago` : `${years} years ago`;
      }
    },
  },
  methods: {
    goToVideo(video) {
      if (video.is_paid) {
        this.showAssetModal = true;
        this.video = video;
        if (this.isWalletConnected) {
          this.getVideoTxData();
        }
      } else {
        const route = this.$router.resolve({
          name: 'Video View',
          params: { slug: video.id },
          query: { url: video.video.url },
        });
        window.open(route.href, '_blank');
      }
    },
  },
};
</script>

<style scoped>
.side-video {
  height: 9rem;
  width: 15rem;
}
@media only screen and (max-width: 600px) {
 .side-video{
   width: 60%;
   height: 12rem !important;
 }
 .video-mb{
   display: flex;
   justify-content: center;
   background-color: #000;
 }
}
</style>