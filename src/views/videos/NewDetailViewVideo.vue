<template>
  <div class="bg-white md:pl-24 md:pb-12 md:pr-10 p-3">
    <!-- VIDEO -->
    <div class="block md:flex justify-between">
      <div
        class="md:mb-24"
        id="video-wrapper"
        @mouseover="dispControls"
        :style="{ visibility: isReady }"
      >
        <video
          crossorigin="anonymous"
          class="video-bg mt-2"
          muted
          playsinline
          preload="auto"
          loop
          id="video"
          width="1250px"
          :height="this.videoheight"
          :src="videoUrl + '#t=0.001'"
          type="video/mp4"
          @timeupdate="updateTime"
          @click="playerToggle"
        >
          Your browser does not support the video tag.
        </video>

        <div id="controls" v-show="active">
          <vue-slider
            v-model="current"
            :hide-label="true"
            class="slider-timeline"
            :tooltip="'none'"
            @change="inputseek()"
            :style="{ cursor: 'pointer' }"
            v-tooltip="current"
            :drag-on-click="true"
          ></vue-slider>
          <div class="flex justify-between md:pr-0 time-display">
            <p class="one">{{ prettyTime(currentTime) }}</p>

            <div style="color: #ffffff" class="flex mt-1">
              <div class="flex" id="volWrap">
                <div class="control-btn">
                  <span
                    class="material-icons"
                    @click="toggleVolume"
                    style="cursor: pointer; margin-top: 5px"
                  >
                    {{ volume > 0 ? `volume_up` : `volume_off` }}
                  </span>
                </div>

                <div
                  class="control-btn"
                  style="width: 50px; margin-right: 1rem; margin-top: 13px"
                  id="vol-slider"
                >
                  <vue-slider
                    v-model="volume"
                    @change="setVolume()"
                    :tooltip="'none'"
                  >
                  </vue-slider>
                </div>
              </div>

              <div class="control-btn">
                <span
                  :style="{ cursor: 'pointer' }"
                  class="one"
                  @click="seekBack"
                >
                  <font-awesome-icon :icon="backward" />
                </span>
              </div>
              <div class="control-btn">
                <span
                  class="material-icons two"
                  :style="{ cursor: 'pointer' }"
                  @click="playerToggle"
                >
                  {{ isPlaying ? `pause` : `play_arrow` }}
                  <!--                <font-awesome-icon :icon="isPlaying ? pause : play" />-->
                </span>
              </div>
              <div class="control-btn">
                <span
                  :style="{ cursor: 'pointer' }"
                  class="one"
                  @click="seekFor"
                >
                  <font-awesome-icon :icon="forward" />
                </span>
              </div>
              <div class="control-btn" style="margin-left: 10px">
                <span
                  :style="{ cursor: 'pointer' }"
                  class="one"
                  @click="toggleFullScreen"
                >
                  <font-awesome-icon
                    :icon="isFullScreen ? exitFullscreen : fullscreen"
                  />
                </span>
              </div>
            </div>

            <p class="time-display pr-10 md:pr-0 one">
              {{ prettyTime(vidDuration) }}
            </p>
          </div>

          <!--        <div class="text-center">-->
          <!--          <span class="material-icons" style="font-size: 30px">-->
          <!--            {{ isPlaying ? `pause` : `play_arrow` }}-->
          <!--          </span>-->
          <!--        </div>-->
        </div>

        <div class="hidden md:mt-4 md:ml-6 md:block">
          <div class="text-dark text-md md:text-3xl">
            {{ videoDetails.title }}
          </div>
          <vs-avatar
            :text="S"
            color="primary"
            size="medium"
            class="mr-3"
            :src="videoDetails.profile_image ? videoDetails.profile_image : ''"
          />
          <div class="text-dark text-md md:text-2xl">
            {{ videoDetails.description }}
          </div>
        </div>
      </div>

      <!-- for small devices title and description -->
      <div class="mobile-side-videos md:hidden">
        <div class="text-dark text-xl font-medium">
          {{ videoDetails.title }}
        </div>
        <div class="text-dark text-md">
          {{ videoDetails.description }}
        </div>
      </div>

      <!-- side videos -->
      <div class="mt-8 md:px-160">
        <SideVideo
          class="m-auto md:flex pb-4"
          v-for="video in videos"
          :key="video.id"
          :video="video"
        />
        <div class="flex justify-center mt-2">
          <button
            @click="goToDashboard()"
            class="text-base font-bold more-videos text-white py-3 px-4 rounded"
          >
            Load More Videos
          </button>
        </div>

        <!-- side videos finished -->
      </div>

      <!--vs-card class="custom-border-box c-mb-4 p-0">
      <div class="tag-share-section ml-1 mt-n2">
        <vs-row vs-justify="space-between">
          <vs-col vs-w="5" vs-type="flex" vs-justify="start">
            <div class="category-tag">#biology</div>
            <div class="category-tag">#science</div>
            <div class="category-tag">#chemistry</div>
          </vs-col>
          <vs-col vs-w="5" vs-type="flex" class="text-right">
            <vs-button
              color="rgb(130,130,130,1)"
              type="border"
              icon="share"
              class="ml-4 text-custom"
              >share</vs-button
            >
            <vs-button
              color="rgb(130,130,130,1)"
              type="border"
              icon="watch_later"
              class="ml-4 text-custom"
              >10.24 Min</vs-button
            >
            <vs-button
              color="rgb(130,130,130,1)"
              type="border"
              icon="start"
              class="ml-4 text-custom"
              >4.6</vs-button
            >
          </vs-col>
        </vs-row>
      </div>
      <div class="creator-info-section pl-3">
        <vs-row vs-align="center" vs-justify="space-between">
          <vs-col
            vs-w="3"
            vs-type="flex"
            vs-align="center"
            vs-justify="flex-start"
          >
            <vs-avatar size="large" class="mr-4" />
            <div>
              <div class="text-variant-1 text-dark">Science</div>
              <div class="text-variant-2">By Chinmay</div>
            </div>
          </vs-col>
          <vs-col vs-w="6" vs-type="flex" vs-align="center" vs-justify="center">
            <div class="flex">
              <vs-button
                color="rgb(217,217,217,1)"
                icon="flag"
                size="large"
                text-color="rgb(130,130,130,1)"
                class="text-variant-1 ml-4 btn-size-custom"
                >Report</vs-button
              >
              <vs-button
                color="warning"
                icon="star"
                size="large"
                class="text-variant-1 ml-4 btn-size-custom"
                >Rating</vs-button
              >
              <div>
                <vs-button
                  color="rgb(114,71,196,1)"
                  size="large"
                  class="text-variant-1 ml-4 btn-size-custom"
                  @click="showBranch = true"
                  >Fork It
                </vs-button>
                <img
                  src="../../assets/images/pages/git-branch.png"
                  class="branch-icon"
                />
              </div>
            </div>
          </vs-col>
        </vs-row>
      </div>
    </vs-card-->
      <!--SCRIPT-->
      <!--vs-collapse type="margin" class="custom-border-box p-0 c-mb-4">
      <vs-collapse-item not-arrow="true" class="c-collapse">
        <div slot="header" @click="versionChip = !versionChip">
          <vs-row vs-type="flex" vs-align="center">
            <vs-col vs-type="flex" vs-w="10" vs-justify="flex-start">
              <vs-avatar size="large" class="m-0" />
              <vs-avatar size="large" class="custom-avatar" />
              <vs-avatar size="large" class="custom-avatar" />
              <vs-avatar
                size="large"
                class="custom-avatar"
                color="primary"
                text="+20"
              />
            </vs-col>
            <vs-col vs-w="1">
              <vs-chip class="version-chip c-version-chip" v-show="versionChip"
                >Version</vs-chip
              >
            </vs-col>
            <vs-col vs-w="1" vs-type="flex" vs-justify="center">
              <img
                src=""
                height="34"
                width="34"
              />
            </vs-col>
          </vs-row-->
      <!--div class="flex justify-between">
            <div class="flex items-center">
              <ul class="users-liked user-list ml-3 sm:ml-6">
                <li
                  v-for="(user, userIndex) in post.usersLiked"
                  :key="userIndex"
                >
                  <vx-tooltip :text="user.name" position="bottom">
                    <vs-avatar
                      :src="user.img"
                      size="30px"
                      class="border-2 border-white border-solid -m-1"
                    ></vs-avatar>
                  </vx-tooltip>
                </li>
              </ul>
              <small class="ml-2">+{{ post.likes - 5 }} more</small>
            </div>
            <div class="flex items-center">
              <feather-icon
                class="mr-2"
                icon="MessageSquareIcon"
                svgClasses="h-5 w-5"
              ></feather-icon>
              <span>{{ post.comments }}</span>
            </div>
          </div-->
      <!--/div>
        <div class="mt-5">
          <vs-tabs>
            <vs-tab label="Version 4 Script" class="mr-5">
              <div class="con-tab-ejemplo video-script">
                <div class="updated-date text-variant-1 mt-5">
                  <b>Updated on April 29, 2018</b>
                </div>
                <div class="text-variant-para mt-5">
                  Who are some of the players to start focusing on for the 2020
                  U.S. Open? Phil Mickelson, the 2006 runner-up at Winged Foot,
                  is working hard to become fully exempt. And we have a review
                  of the par-4 18th hole. The United States Golf Association
                  (USGA) conducts many of golf's most prestigious championships,
                  highlighted by the U.S. Open, the U.S. Women's Open and the
                  world’s premier amateur championships. Based in Liberty
                  Corner, N.J., the USGA governs the game in the U.S., its
                  territories and Mexico. istoric footage and films from golf's
                  iconic moments and figures, get the FREE USGA streaming app
                  for Apple TV and Roku.
                </div>
              </div>
            </vs-tab>
            <vs-tab label="Version 3 Script">
              <div class="con-tab-ejemplo"></div>
            </vs-tab>
            <vs-tab label="Version 2 Script">
              <div class="con-tab-ejemplo"></div>
            </vs-tab>
            <vs-tab label="More">
              <div class="con-tab-ejemplo"></div>
            </vs-tab>
          </vs-tabs>
        </div>
      </vs-collapse-item>
    </vs-collapse-->
      <!--COMMENTS-->
      <!--vs-card class="custom-border-box">
      <div class="comment-section">
        <div class="mb-4 text-variant-3 text-dark">Comments(780)</div>
        <vs-textarea placeholder="Add a public comment.." class="comment-box" />
        <vs-row vs-type="flex" vs-justify="flex-end">
          <vs-button
            color="rgb(114,71,196,1)"
            size="large"
            class="btn-text-variant"
            >Post Comment</vs-button
          >
        </vs-row>
        <div class="comment-list">
          <div class="comment-thread">
            <Comment />
            <div class="replies">
              <Comment />
            </div>
          </div>
          <Comment />
          <Comment />
        </div>
      </div>
    </vs-card-->
      <!-- RELATED VIDEOS-->
      <!--div class="trending">
      <div class="trend-title text-dark" style="font-size: 20px">
        <b>Related Videos</b>
      </div>
      <vs-row vs-align="center" vs-type="flex" class="video-tiles">
        <vs-col
          vs-w="4"
          :key="index"
          v-for="(col, index) in 3"
          vs-type="flex"
          vs-justify="center"
        >
          <VideoCard />
        </vs-col>
      </vs-row>
    </div-->
      <!-- VIDEO BRANCH MODAL -->
      <!--vs-popup :active.sync="showBranch" button-close-hidden="true">
      <VideoBranch />
    </vs-popup-->
    </div>
  </div>
</template>
<script>
import Comment from './components/Comment';
// import VideoBranch from './components/video-branch/VideoBranch';
import axios from '../../axios';
import constants from '../../../constant';
import VideoCard from '@/views/components/VideoCard';
import VueSlider from 'vue-slider-component';
import './components/custom.css';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faRedo,
  faUndo,
  faPlay,
  faPause,
  faExpand,
  faCompress,
} from '@fortawesome/free-solid-svg-icons';
import SideVideo from './components/SideVideo.vue';

let videoElement;
let vidWrapper;

export default {
  name: 'DetailViewVideo',
  components: {
    Comment,
    VueSlider,
    VideoCard,
    FontAwesomeIcon,
    SideVideo,
    // VideoBranch,
  },
  data() {
    return {
      months: [
        'Jan',
        'Feb',
        'Mar',
        'April',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
      versionChip: true,
      showBranch: false,
      current: 0,
      currentTime: 0,
      vidDuration: 0,
      isPlaying: false,
      forward: faRedo,
      backward: faUndo,
      play: faPlay,
      pause: faPause,
      volume: 50,
      active: true,
      isFullScreen: false,
      fullscreen: faExpand,
      exitFullscreen: faCompress,
      // isReady: 'hidden',
      constants,
      videos: [],
      videoDetails: {},
      videoheight: '650px',
    };
  },
  computed: {
    videoUrl() {
      return this.$route.query.url;
    },
  },

  created() {
    this.getSideVideos();
    this.getMainVideoDetails();
  },
  destroyed() {
    window.removeEventListener('resize', this.videoResize);
  },
  mounted() {
    window.addEventListener('resize', this.videoResize);
    this.videoResize();
    videoElement = document.getElementById('video');
    vidWrapper = document.getElementById('video-wrapper');
    videoElement.onloadedmetadata = () => {
      this.vidDuration = videoElement.duration;
    };
    videoElement.oncanplay = () => {
      this.isReady = 'visible';
    };
    document.addEventListener('fullscreenchange', (e) => {
      this.isFullScreen = !!document.fullscreenElement;
    });
  },

  methods: {
    getSideVideos() {
      axios
        .get(constants.apiUrl + '/api/home_videos/')
        .then((response) => {
          this.videos = response.data.results.splice(0, 4);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    getMainVideoDetails() {
      axios
        .get(
          constants.apiUrl +
            `/api/video_details?saved_video_id=${this.$route.params.slug}`
        )
        .then((response) => {
          this.videoDetails = response.data.data;
          console.log(this.videoDetails, 'details');
        })
        .catch((error) => {
          console.log(error);
        });
    },
    goToDashboard() {
      this.$router.push('/dashboard');
    },
    inputseek() {
      videoElement.currentTime = videoElement.duration * (this.current / 100);
    },
    dispControls() {
      this.active = true;
    },
    setVolume() {
      videoElement.volume = this.volume / 100;
      console.log(this.volume);
    },
    toggleVolume() {
      this.volume > 0 ? (this.volume = 0) : (this.volume = 50);
      videoElement.volume = this.volume / 100;
      console.log(this.volume);
    },
    toggleFullScreen() {
      if (!this.isFullScreen) vidWrapper.requestFullscreen();
      else document.exitFullscreen();
    },
    updateTime() {
      this.currentTime = videoElement.currentTime;
      this.current = (this.currentTime / videoElement.duration) * 100;
    },
    playerToggle() {
      this.isPlaying ? videoElement.pause() : videoElement.play();
      this.isPlaying = !this.isPlaying;
    },
    seekBack() {
      videoElement.currentTime -= 10;
    },
    seekFor() {
      videoElement.currentTime += 10;
    },
    prettyTime(val) {
      const minutes = parseInt(val / 60);
      const seconds = parseInt(val - 60 * minutes);
      return (
        (minutes < 10 ? `0${minutes}` : minutes) +
        ':' +
        (seconds < 10 ? `0${seconds}` : seconds)
      );
    },
    videoResize() {
      if (window.innerWidth < 768) {
        this.videoheight = '230px';
      }
    },
  },
};
</script>

<style scoped>
.padding-5 {
  padding: 5%;
}
.tag-share-section {
  min-height: 116px;
  display: flex;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}
.creator-info-section {
  min-height: 140px;
  display: flex;
  align-items: center;
}
.category-tag {
  margin-right: 1rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  position: static;
  width: 108px;
  height: 39.83px;
  left: 0px;
  top: 0px;
  background: #f7f7f7;
  border-radius: 6px;
  font-weight: 500;
  font-size: 14px;
  color: #828282;
}
.comment-section {
  padding: 3.25rem;
}
.comment-box {
  height: 188px;
  border: none !important;
  color: #a9a9a9;
  background: #f9f9f9;
  border-radius: 16px;
  padding: 1rem;
}
.btn-size-custom {
  height: 45px;
  width: 140px;
}

.trending {
  margin-top: 7rem;
  margin-bottom: 4rem;
}
.video-tiles {
  margin-top: 4rem;
}
.text-custom {
  font-weight: 600;
  font-size: 14px;

  color: #828282;
}
.c-version-chip:first-child {
  padding-right: 20px;
  padding-left: 10px;
  font-weight: 500;
  font-size: 14px;
}

.more-videos {
  background-color: #7367f0;
  border: none;
}

.one {
  font-size: 16px;
}

.two {
  font-size: 28px;
}

.video-script {
  height: 330px;
  overflow: scroll;
}
.replies {
  margin-left: 5rem;
}

.video-bg {
  background-color: #000;
}

#video-wrapper {
  position: relative;
  min-width: 850px;
  height: 660px;
}

#controls {
  position: absolute;
  height: 70px;
  bottom: 10px;
  left: 0;
  right: 0;
  width: 110%;
  z-index: 10;
  background: transparent;
  padding: 0.5% 2%;
}
.vue-slider-process {
  background-color: black;
}
.time-display {
  color: #ffffff;
  font-weight: 400;
}
#video {
  width: 110%;
  background-size: cover;
  overflow: hidden;
}

.control-btn {
  width: 3em;
  text-align: center;
  margin-top: 5px;
  transition: transform 0.1s;
}
.control-btn:hover {
  transform: scale(1.2);
}

.slider-timeline {
  width: 100%;
}

@media only screen and (max-width: 600px) {
  .one {
    font-size: 10px;
  }

  .two {
    font-size: 20px;
  }

  .control-btn {
    width: 2em;
  }

  .mobile-side-videos {
    padding-bottom: 5px;
    border-bottom: 3px solid rgba(138, 134, 134, 0.479);
  }
  #video-wrapper {
    visibility: visible;
    min-width: 0;
    height: 250px;
    overflow: hidden;
  }
  .slider-timeline {
    width: 80%;
  }
  #video {
    width: 100%;
    background-size: cover;
    overflow: hidden;
  }
  #controls {
    width: 100% !important;
  }
}

@media only screen and (max-width: 1280px) {
  #video {
    width: 95% !important;
  }
  .slider-timeline {
    width: 85% !important ;
  }
}
</style>
