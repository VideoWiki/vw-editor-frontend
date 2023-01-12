<template>
  <div>
    <TheHeader />
    <div
      class="vs-con-loading__container"
      id="div-with-loading"
      :class="{ 'h-72': isLoading }"
    ></div>
    <div v-if="!isLoading">
      <template v-if="videoList.length > 0">
        <vs-row>
          <template v-for="video in videoList">
            <vs-col
              :key="video.id"
              class="p-3 lg:w-1/5 md:w-1/3 sm:w-1/2 w-full"
            >
              <VideoCard
                :prop="video"
                type="published"
                :isUser="false"
                @click.native="detailView(video)"
              />
            </vs-col>
          </template>
        </vs-row>
      </template>
      <template v-else>
        <div class="flex h-72 justify-center items-center flex-wrap">
          <h4 class="text-danger">No videos published yet</h4>
        </div>
      </template>
    </div>
    <vs-popup ref="custom_modal" :active.sync="showAssetModal">
      <div class="flex items-start -m-5">
        <div class="p-5">
          <img src="@/assets/images/pages/mp4.svg" />
        </div>
        <div class="p-5">
          <div class="mb-2">
            <h4>{{ selectedVideo.video ? selectedVideo.video.title : '' }}</h4>
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
                  class="mb-2 font-semibold px-12"
                  @click="buyContent"
                  >Buy</vs-button
                >
                <vs-button type="filled" class="font-semibold mt-2">
                  <a target="_blank" class="text-white" :href="previewUrl">
                    Preview
                  </a>
                </vs-button>
              </div>
              <div v-else>
                <vs-button
                  type="filled"
                  class="font-semibold"
                  @click="downloadAsset"
                  >Download</vs-button
                >
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--vs-divider /-->
    </vs-popup>
    <Transaction
      :show="showTransactionModal"
      :transactionType="txType"
      :transactionPhase="currentTxPhase"
      @close="showTransactionModal = false"
      @retry="txType === 'Buy' ? buyContent() : downloadAsset()"
    />
  </div>
</template>
<script>
import TheHeader from '@/layouts/components/navbar/NavbarDashboard';
import Transaction from '@/views/components/Transaction/Transaction.vue';
import VideoCard from './components/VideoCard';
import { ajaxCallMixin } from '../../http/HttpCommon';
export default {
  name: 'Dashboard',
  mixins: [ajaxCallMixin],
  components: {
    TheHeader,
    VideoCard,
    Transaction,
  },
  data() {
    return {
      videoList: [],
      isLoading: false,
      selectedVideo: {},
      oceanRequired: 0,
      showAssetModal: false,
      videoTxData: {},
      isDownloadable: false,
      showTransactionModal: false,
      txType: 'Buy',
      currentTxPhase: 'Processing',
      dataToken: '',
      videoTitle: '',
      videoDescription: '',
      previewUrl: '',
    };
  },
  computed: {
    reversedVideoList() {
      return this.videoList.slice().reverse();
    },
    isWalletConnected() {
      return this.$store.state.isWalletConnected;
    },
    accountAddress() {
      return this.$store.state.accountAddress;
    },
  },
  mounted() {
    this.getVideoList();
    this.$refs.custom_modal.$el.childNodes[1].childNodes[0].style.display =
      'none';
    this.$refs.custom_modal.$el.childNodes[1].style.width = '400px';
  },
  methods: {
    getVideoList() {
      const url = '/api/home_videos/';
      this.$vs.loading({
        background: 'transparent',
        container: '#div-with-loading',
      });
      this.isLoading = true;
      this.getRequest(url, this.handleResponse);
    },
    handleResponse(apiResponse) {
      this.$vs.loading.close('#div-with-loading > .con-vs-loading');
      this.isLoading = false;
      this.videoList = apiResponse.results;
    },
    detailView(selectedVideo) {
      if (selectedVideo.is_paid) {
        this.showAssetModal = true;
        this.selectedVideo = selectedVideo;
        if (this.isWalletConnected) {
          this.getVideoTxData();
        }
      } else {
        const route = this.$router.resolve({
          name: 'Video View',
          params: { slug: selectedVideo.id },
          query: { url: selectedVideo.video.url },
        });
        window.open(route.href, '_blank');
      }
    },
    async buyContent() {
      this.showAssetModal = false;
      this.txType = 'Buy';
      this.$store.commit('SET_CURRENT_TRANSACTION_STEP', 1);
      this.showTransactionModal = true;
      this.currentTxPhase = 'Processing';
      if (this.videoTxData.dataToken === 'none') {
        await this.$store.dispatch('purchase', this.videoTxData.dod);
        this.showTransactionModal = false;
        return;
      }
      try {
        await this.$store.dispatch(
          'initiateBuy',
          this.videoTxData.exchange_key
        );
        this.isDownloadable = await this.$store.dispatch('getDownloadStatus', {
          did: this.videoTxData.dod,
          accountAddress: this.accountAddress,
        });
        this.showTransactionModal = false;
        // this.detailView(this.selectedVideo);
      } catch (error) {
        if (error.code === 4001) this.currentTxPhase = 'Rejected';
        else this.currentTxPhase = 'Failed';
      }
    },
    async downloadAsset() {
      this.showAssetModal = false;
      this.txType = 'Download';
      this.$store.commit('SET_CURRENT_TRANSACTION_STEP', 1);
      try {
        if (this.videoTxData.dataToken === 'none') {
          const uri = await this.$store.dispatch(
            'tokenuri',
            this.videoTxData.dod
          );
          window.open(uri, '_blank');
          return;
        } else {
          this.showTransactionModal = true;
          this.currentTxPhase = 'Processing';
          await this.$store.dispatch('startDownload', {
            did: this.videoTxData.dod,
            dta: this.videoTxData.dataToken,
          });
        }
        setTimeout(() => (this.showTransactionModal = false), 2000);
      } catch (error) {
        if (error.code === 4001) this.currentTxPhase = 'Rejected';
        else this.currentTxPhase = 'Failed';
      }
    },
    getVideoTxData() {
      const url = `/transaction/oceanbuy?video_id=${this.selectedVideo.published_id}`;
      this.$vs.loading({
        container: `#buy-download`,
        background: '#fff',
        color: 'primary',
        scale: 0.8,
      });
      this.getRequest(url, this.callBackVideoTxData);
    },
    async callBackVideoTxData(apiResponse) {
      this.videoTxData = apiResponse.data;
      console.log(this.videoTxData);
      this.previewUrl =
        'https://player.video.wiki/player?url=' +
        this.videoTxData.ipfs_preview_url;
      const price = await this.$store.dispatch(
        'getAssetPrice',
        this.videoTxData.exchange_key
      );
      if (this.videoTxData.dataToken === 'none') {
        this.isDownloadable = await this.$store.dispatch('ownerOf', {
          tokenId: this.videoTxData.dod,
          walletAddress: this.accountAddress,
        });
      } else {
        this.isDownloadable = await this.$store.dispatch('getDownloadStatus', {
          did: this.videoTxData.dod,
          accountAddress: this.accountAddress,
        });
      }
      if (this.isDownloadable) {
        console.log(this.selectedVideo.published_id);
        var URL = `/api/video_details?published_id=${this.selectedVideo.published_id}`;
        this.getRequest(URL, this.callBackInfo);
        return;
      }
      this.$vs.loading.close(`#buy-download > .con-vs-loading`);
      this.oceanRequired = price;
    },
    callBackInfo(apiResponse) {
      this.videoTitle =
        apiResponse.data.title.length > 70
          ? apiResponse.data.title.slice(0, 279) + '...'
          : apiResponse.data.title;
      this.videoDescription =
        apiResponse.data.description.length > 300
          ? apiResponse.data.description.slice(0, 279) + '...'
          : apiResponse.data.description;
      console.log(this.videoDescription, this.videoTitle);
      this.$vs.loading.close(`#buy-download > .con-vs-loading`);
    },
  },
};
</script>
<style scoped>
.iframe {
  position: absolute;
  top: 50%;
  left: 50%;
  height: 60%;
  width: 50%;
  transform: translate(-50%, -50%);
}
</style>
