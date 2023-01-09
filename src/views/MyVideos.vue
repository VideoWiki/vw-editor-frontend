<template>
  <div>
    <TheHeader />
    <section class="w-19/20 mx-auto">
      <div class="section-header">
        <h1>{{$t('MyVideos.video')}}</h1>
        <div></div>
      </div>
      <article class="flex flex-wrap -m-4">
        <aside class="p-4 md:w-1/4 w-full">
          <vx-card noShadow>
            <template slot="no-body">
              <ul>
                <li
                  @click="setTabIndex(0)"
                  :class="{ activeTab: videoTabIndex === 0 }"
                >
                  <span class="flex items-center"
                    ><vs-icon
                      icon="language"
                      size="20px"
                      class="mr-2"
                    ></vs-icon>
                    {{$t('MyVideos.publish')}}
                  </span>
                  <span class="active-tab-bar"></span>
                </li>
                <li
                  @click="setTabIndex(1)"
                  :class="{ activeTab: videoTabIndex === 1 }"
                >
                  <span class="flex items-center"
                    ><vs-icon icon="save" size="20px" class="mr-2"></vs-icon>
                    {{$t('MyVideos.save')}}
                  </span>
                  <span class="active-tab-bar"></span>
                </li>
                <li
                  @click="setTabIndex(2)"
                  :class="{ activeTab: videoTabIndex === 2 }"
                >
                  <span class="flex items-center"
                    ><git-branch-icon
                      size="1.2x"
                      class="mr-2"
                    ></git-branch-icon>
                    {{$t('MyVideos.fork')}}
                  </span>
                  <span class="active-tab-bar"></span>
                </li>
                <li
                  @click="setTabIndex(3)"
                  :class="{ activeTab: videoTabIndex === 3 }"
                >
                  <span class="flex items-center"
                    ><vs-icon
                      icon="videocam"
                      size="20px"
                      class="mr-2"
                    ></vs-icon>
                   {{$t('MyVideos.classroom')}}
                  </span>
                  <span class="active-tab-bar"></span>
                </li>
              </ul>
            </template>
          </vx-card>
        </aside>
        <section class="p-4 md:w-3/4 w-full">
          <div
            class="vs-con-loading__container"
            :class="isLoading ? 'h-72' : ''"
            id="video-container"
          ></div>
          <template v-if="myVideoList.length > 0">
            <vs-row class="-mt-3">
              <template v-for="video in myVideoList">
                <vs-col
                  :key="`${videoType}_${video.id}`"
                  vs-lg="4"
                  vs-sm="6"
                  vs-xs="12"
                  class="p-3"
                >
                  <VideoCard :prop="video" :type="videoType" :isUser="true" />
                </vs-col>
              </template>
            </vs-row>
          </template>
          <template v-else-if="!isLoading">
            <h4 class="text-danger text-center">{{ notFoundMessage }}</h4>
          </template>
          <template v-if="totalItems > 15">
            <vs-pagination
              :total="totalPages"
              v-model="pageNumber"
            ></vs-pagination>
          </template>
        </section>
      </article>
    </section>
  </div>
</template>
<script>
import TheHeader from '@/layouts/components/navbar/TheNavbarHorizontal';
import VideoCard from './dashboard/components/VideoCard';
import axios from '../axios';
import { GitBranchIcon } from 'vue-feather-icons';
import constants from '../../constant';
export default {
  name: 'MyVideos',
  components: {
    TheHeader,
    VideoCard,
    GitBranchIcon
  },
  data() {
    return {
      /* video: {
        saved: [],
        published: [],
        forked: [],
        classroom: []
      }, */
      myVideoList: [],
      isLoading: false,
      videoTabIndex: 0,
      pageNumber: 1,
      totalItems: 0
    };
  },
  computed: {
    usersData() {
      return this.$store.state.AppActiveUser;
    },
    videoType() {
      let type = '';
      switch (this.videoTabIndex) {
        case 0:
          type = 'published';
          break;
        case 1:
          type = 'saved';
          break;
        case 2:
          type = 'forked';
          break;
        case 3:
          type = 'classroom';
          break;
      }
      return type;
    },
    notFoundMessage() {
      return `You haven't ${this.videoType} any videos yet`;
    },
    totalPages() {
      return this.totalItems % 15 === 0
        ? parseInt(this.totalItems / 15)
        : parseInt(this.totalItems / 15) + 1;
    }
  },
  watch: {
    videoTabIndex: function(newVal, oldVal) {
      this.getUserVideos(1);
      this.pageNumber = 1;
    },
    pageNumber: function(newVal) {
      this.getUserVideos(newVal);
    }
  },
  mounted() {
    this.getUserVideos(1);
  },
  methods: {
    setTabIndex(idx) {
      this.videoTabIndex = idx;
    },
    getUserVideos(pageNumber) {
      this.$vs.loading({
        background: 'transparent',
        container: `#video-container`
      });
      this.isLoading = true;
      this.myVideoList = [];
      axios
        .get(
          constants.apiUrl +
            `/api/user_videos?page=${pageNumber}&user_id=${this.usersData.id}&video_type=${this.videoType}`
        )
        .then(res => {
          this.totalItems = res.data.count;
          // this.video[videoType] = res.data.results;
          this.myVideoList = res.data.results;
        })
        .catch(() => {
          this.$vs.notify({
            title: this.$t('MyVideos.notify.title'),
            text: this.$t('MyVideos.notify.text'),
            color: 'danger'
          });
        })
        .finally(() => {
          this.$vs.loading.close(`#video-container > .con-vs-loading`);
          this.isLoading = false;
        });
    }
  }
};
</script>
<style scoped>
.section-header {
  padding: 4rem 0 2rem 0;
}
ul {
  padding: 2.5rem 0;
}
li {
  padding: 0.2rem 5.5rem;
  font-weight: 500;
  position: relative;
  cursor: pointer;
}
li:not(:last-child) {
  margin-bottom: 2rem;
}
.active-tab-bar {
  position: absolute;
  width: 5px;
  height: 100%;
  background: #7247c4;
  border-radius: 0px 5px 5px 0;
  display: none;
  left: 0;
  top: 0;
}
li.activeTab .active-tab-bar {
  display: inline;
}
.activeTab {
  color: #7247c4;
}
</style>
