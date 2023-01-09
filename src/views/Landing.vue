<!-- =========================================================================================
    File Name: Dashboard.vue
    Description: Knowledge Base Page
    ----------------------------------------------------------------------------------------
    Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <div id="knowledge-base-page" class="">
    <!-- JUMBOTRON -->

    <div class="section flex flex-wrap bg-white">
      <div class="lg:w-1/2 w-full lg:text-left text-center">
        <h1 class="lg:text-7xl font-extrabold mb-8 mt-2 text-5xl">
          {{ $t('Landing.Welcome.title') }}
        </h1>
        <p class="lg:text-2xl text-xl mb-10">
          {{ $t('Landing.Welcome.info1') }}
          <br class="hidden lg:block" />{{ $t('Landing.Welcome.info2') }}
        </p>
        <div class="lg:text-left text-center">
          <vs-button
            type="filled"
            class="bg-custom-purple text-base font-bold"
            @click="$router.push('/studio')"
            >{{ $t('Landing.Welcome.button') }}</vs-button
          >
        </div>
        <!-- <div class="lg:text-left text-center">
          <vs-button
            type="filled"
            class="bg-custom-purple text-base font-bold"
            @click="download"
            >{{ $t('Landing.Welcome.button') + 123 }}</vs-button
          >
        </div> -->
      </div>
      <div class="lg:w-1/2 hidden md:hidden sm:hidden lg:block">
        <img src="@/assets/images/landing-page/Frame1.svg" />
      </div>
    </div>

    <!-- JUMBOTRON /-->

    <!--ABOUT US-->

    <div class="section flex flex-wrap md:justify-between">
      <div class="lg:w-1/2 hidden md:hidden sm:hidden lg:block">
        <img src="@/assets/images/landing-page/Frame2.svg" />
      </div>
      <div class="lg:w-1/2 lg:mx-auto w-full text-left">
        <div class="lg:w-4/5 lg:mx-auto">
          <h1 class="text-4xl font-extrabold mb-8 lg:text-left text-center">
            {{ $t('Landing.About.title') }}
          </h1>
          <p class="text-base font-medium mb-10">
            {{ $t('Landing.About.info1') }}
            <br /><br />
            {{ $t('Landing.About.info2') }}
            <br /><br />
            {{ $t('Landing.About.info3') }}
            <span class="font-bold">{{ $t('Landing.About.info4') }}.</span>
          </p>
          <div class="text-center lg:text-left">
            <vs-button
              type="filled"
              class="bg-custom-purple text-base font-bold"
              @click="$router.push('/about')"
              >{{ $t('Landing.About.button') }}</vs-button
            >
          </div>
        </div>
      </div>
    </div>

    <!--ABOUT US /-->

    <!-- PROBLEM AND SOLUTION -->

    <div class="section bg-white">
      <h1 class="font-extrabold text-4xl mb-8 lg:text-left text-center">
        {{ $t('Landing.Problem.title1') }} &amp;
        {{ $t('Landing.Problem.title2') }}
      </h1>
      <p class="text-base text-left">
        {{ $t('Landing.Problem.info1') }}
      </p>
      <br />
      <p class="mb-base">
        <strong>
          {{ $t('Landing.Problem.info2') }}
        </strong>
      </p>
      <br />
      <div class="flex flex-wrap sm:-mx-6">
        <div class="sm:px-6 w-full mx-auto mb-base sm:w-2/3 md:w-1/3 lg:w-1/3">
          <vx-card>
            <div slot="no-body" class="card-img h-36">
              <img
                src="@/assets/images/landing-page/cpu.jpg"
                alt="content-img"
                class="card-img-top"
              />
            </div>
            <div class="text-center">
              <h5 class="mb-2 font-semibold text-xl mb-8">
                {{ $t('Landing.Problem.card1h') }}
              </h5>
            </div>
          </vx-card>
        </div>

        <div class="sm:px-6 w-full sm:w-2/3 mb-base md:w-1/3 lg:w-1/3 mx-auto">
          <vx-card>
            <div slot="no-body" class="card-img h-36">
              <img
                src="@/assets/images/landing-page/servers.png"
                alt="content-img"
                class="card-img-top"
              />
            </div>
            <div class="text-center">
              <h5 class="mb-2 font-semibold text-xl mb-8">
                {{ $t('Landing.Problem.card2h') }}
              </h5>
            </div>
          </vx-card>
        </div>
        <div class="sm:px-6 w-full mx-auto mb-base sm:w-2/3 md:w-1/3 lg:w-1/3">
          <vx-card>
            <div slot="no-body" class="card-img h-36">
              <img
                src="@/assets/images/landing-page/audio-wave.png"
                alt="content-img"
                class="card-img-top"
              />
            </div>
            <div class="text-center">
              <h5 class="mb-2 font-semibold text-xl mb-8">
                {{ $t('Landing.Problem.card3h') }}
              </h5>
            </div>
          </vx-card>
        </div>
      </div>
    </div>

    <!--PROBLEM AND SOLUTION /-->

    <vs-divider class="m-0" />

    <!-- INSPIRATION AND VISION -->

    <div class="section flex flex-wrap bg-white">
      <div class="lg:w-1/2 w-full text-left">
        <h1 class="font-extrabold text-4xl mb-10 lg:text-left text-center">
          {{ $t('Landing.Inspiration.title1') }} &amp;
          {{ $t('Landing.Inspiration.title2') }}
        </h1>
        <p class="font-medium">
          {{ $t('Landing.Inspiration.info1') }}
        </p>
        <br />
        <p class="mb-8 font-medium">
          <strong> {{ $t('Landing.Inspiration.info2') }} </strong>
          <br />{{ $t('Landing.Inspiration.info3') }}
        </p>
        <div class="flex flex-wrap lg:justify-start justify-center -m-2">
          <div
            v-for="(item, idx) in list"
            :key="idx"
            class="no-border text-lg font-medium lg:w-1/4 p-2"
          >
            <vs-icon
              icon-pack="feather"
              icon="icon icon-check-circle"
              color="rgb(230,73,128)"
              class="mr-2 text-xl"
            />{{ item }}
          </div>
        </div>
      </div>
      <div class="lg:w-1/2 hidden md:hidden sm:hidden lg:block">
        <img src="@/assets/images/landing-page/Frame3.svg" />
      </div>
    </div>
    <!-- INSPIRATION AND VISION /-->

    <!-- PROTOTYPE AND TECHNOLOGY -->
    <div class="section bg-white">
      <div class="mb-10">
        <h2 class="font-extrabold text-4xl text-center mb-4">
          {{ $t('Landing.Prototype.title1') }} &
          {{ $t('Landing.Prototype.title2') }}
        </h2>
        <p class="text-center font-medium">
          {{ $t('Landing.Prototype.title3') }}
        </p>
      </div>
      <br />
      <div class="col-lg-3 col-md-6 col-sm-6">
        <video
          width="100%"
          height="100%"
          controls
          :autoplay="false"
          class="rounded-lg text-center"
        >
          <source :src="demoVideoUrl" type="video/mp4" />
          {{ $t('Landing.Prototype.video') }}
        </video>
      </div>
    </div>
    <!--PROTOTYPE AND TECHNOLOGY /-->

    <!-- PROJECT GOALS -->
    <div class="section flex bg-white">
      <div class="lg:w-1/2 w-full">
        <h1 class="font-extrabold text-4xl mb-6 lg:text-left text-center">
          {{ $t('Landing.Project.title1') }}<br class="hidden lg:block" />
          {{ $t('Landing.Project.title2') }}
        </h1>
        <p class="font-medium mb-10 text-left">
          {{ $t('Landing.Project.info') }}
        </p>
        <div class="lg:text-left text-center">
          <vs-button
            type="filled"
            class="bg-custom-purple font-bold"
            @click="$router.push('/goals')"
            >{{ $t('Landing.Project.button') }}</vs-button
          >
        </div>
      </div>
      <div class="lg:w-1/3 hidden md:hidden sm:hidden lg:block mx-auto">
        <img src="@/assets/images/landing-page/Frame4.svg" />
      </div>
    </div>
    <!-- PROJECT GOALS /-->

    <!-- MISSION -->
    <div class="section">
      <div class="text-center">
        <h2 class="font-extrabold text-4xl mb-4">
          {{ $t('Landing.Mission.title1') }}
        </h2>
        <p class="font-medium">
          {{ $t('Landing.Mission.title2') }}
        </p>
      </div>
      <section class="flex flex-wrap justify-between">
        <div class="lg:w-1/2 hidden md:hidden sm:hidden lg:flex h-72 -ml-80px">
          <img src="@/assets/images/landing-page/Frame5.svg" />
        </div>
        <div class="lg:w-1/2 w-full">
          <vs-collapse accordion type="margin" ref="vsCollapse">
            <template v-for="(item, idx) in list6">
              <vs-collapse-item
                not-arrow
                :key="idx"
                class="bg-white"
                :ref="`collapse_${idx}`"
              >
                <div slot="header">
                  <div class="flex items-center -mx-2">
                    <vs-icon
                      icon-pack="feather"
                      :icon="expand(idx) ? 'icon icon-plus' : 'icon icon-minus'"
                      color="rgb(114,71,196,1)"
                      class="px-2"
                    />
                    <div class="px-2 font-medium text-xl">
                      {{ item.title }}
                    </div>
                  </div>
                </div>
                {{ item.description }}
              </vs-collapse-item>
            </template>
          </vs-collapse>
        </div>
      </section>
    </div>
    <!--MISSION/-->

    <!--TEAMS-->
    <!--div class="section bg-white">
      <div class="text-center mb-20">
        <h1 class="font-extrabold text-4xl mb-4">Our Awesome Team</h1>
        <p class="font-medium">
          Rapidly developed, working, and ready for use.
        </p>
      </div>
      <div class="vx-row">
        <div
          class="vx-col w-4/5 mx-auto sm:w-1/2 md:w-1/3 lg:w-1/4 mb-base"
          v-for="member in getTeamList"
          :key="member.name"
        >
          <div class="flex flex-wrap">
            <MemberCard :member="member" />
          </div>
        </div>
      </div>
    </div-->

    <!--TEAMS/-->

    <!--STRATEGY-->
    <div class="section">
      <div class="text-center mb-20">
        <h1 class="font-extrabold text-4xl mb-4">
          {{ $t('Landing.Strategy.title1') }} <br />
          {{ $t('Landing.Strategy.title2') }}
        </h1>
      </div>
      <div class="flex justify-center relative">
        <ul class="w-4/5 timeline">
          <template v-for="(step, idx) in steps">
            <li
              :key="idx"
              class="flex"
              :class="{
                'mb-20': idx !== steps.length - 1,
                'justify-end': idx % 2 === 0,
              }"
            >
              <div class="hidden lg:block md:block timeline-icon">
                <img src="@/assets/images/landing-page/disc.png" />
              </div>
              <div class="vx-card rounded-lg p-4 lg:h-48 lg:w-2/5 md:w-2/5">
                <div class="timeline-content">
                  <div class="flex items-center mb-4">
                    <vs-avatar
                      class="mr-6 block"
                      size="50px"
                      :src="getStepIcon(idx)"
                    />
                    <h5 class="font-semibold text-3xl">
                      {{ $t('Landing.Strategy.step') }}
                      {{ (idx + 1).toString() }}
                    </h5>
                  </div>
                  <p>{{ step }}</p>
                </div>
              </div>
            </li>
          </template>
        </ul>
      </div>
    </div>
    <!--STRATEGY /-->

    <!--SUPPORT-->
    <div class="section bg-white">
      <div class="vx-col w-full mb-base lg:w-full">
        <vx-card>
          <vs-tabs>
            <vs-tab v-bind:label="$t('Landing.Support.label1')">
              <div class="con-tab-ejemplo mt-6">
                <div
                  v-for="(item, idx) in list1"
                  :key="idx"
                  class="no-border font-medium mb-3 flex items-start"
                >
                  <vs-icon
                    icon="check_circle"
                    color="success"
                    size="16px"
                    class="mr-3"
                  />
                  <a :href="item.url">{{ item.title }}</a>
                </div>
              </div>
            </vs-tab>
            <vs-tab v-bind:label="$t('Landing.Support.label2')">
              <div class="con-tab-ejemplo mt-6">
                <div
                  v-for="(item, idx) in list2"
                  :key="idx"
                  class="no-border font-medium mb-3 flex items-start"
                >
                  <vs-icon
                    icon="check_circle"
                    color="success"
                    size="16px"
                    class="mr-3"
                  />
                  <span>{{ item }}</span>
                </div>
              </div>
            </vs-tab>
            <vs-tab v-bind:label="$t('Landing.Support.label3')">
              <div class="con-tab-ejemplo mt-6">
                <div
                  v-for="(item, idx) in list3"
                  :key="idx"
                  class="no-border font-medium mb-3 flex items-start"
                >
                  <vs-icon
                    icon="check_circle"
                    color="success"
                    size="16px"
                    class="mr-3"
                  />
                  <span>{{ item }}</span>
                </div>
              </div>
            </vs-tab>
            <vs-tab v-bind:label="$t('Landing.Support.label4')">
              <div class="con-tab-ejemplo mt-6">
                <div
                  v-for="(item, idx) in list4"
                  :key="idx"
                  class="no-border font-medium mb-3 flex items-start"
                >
                  <vs-icon
                    icon="check_circle"
                    color="success"
                    size="16px"
                    class="mr-3"
                  />{{ item }}
                </div>
              </div>
            </vs-tab>
            <vs-tab v-bind:label="$t('Landing.Support.label5')">
              <div class="con-tab-ejemplo mt-6">
                <div
                  v-for="(item, idx) in list5"
                  :key="idx"
                  class="no-border font-medium mb-3 flex items-start"
                >
                  <vs-icon
                    icon="check_circle"
                    color="success"
                    size="16px"
                    class="mr-3"
                  />{{ item }}
                </div>
              </div>
            </vs-tab>
          </vs-tabs>
        </vx-card>
      </div>
    </div>

    <!--SUPPORT/-->

    <!--NEWSLETTER-->
    <div class="section">
      <NewsLetter />
    </div>

    <!--NEWSLETTER/-->

    <!--FOOTER>
    <div class="bg-white">
      <TheFooter />
    </div>
    <FOOTER/-->
  </div>
</template>

<script>
import NewsLetter from './components/NewsLetter';
import axios from '../axios';
import ConnectWallet from '@/blockchain/Download.js';

// import { teamList } from './components/localDb';
// import MemberCard from './components/MemberCard';

export default {
  data() {
    return {
      demoVideoUrl: '',
      expand: Function,
      list: this.$t('Landing.List'),
      list1: [
        {
          title: this.$t('Landing.List1[0]'),
          url: '/integration/ocean-protocol',
        },
        {
          title: this.$t('Landing.List1[1]'),
          url: '/integration/ms-teams',
        },
        {
          title: this.$t('Landing.List1[2]'),
          url: '#',
        },
      ],
      list2: [],
      list3: this.$t('Landing.List3'),
      list4: this.$t('Landing.List4'),
      list5: this.$t('Landing.List5'),
      list6: [
        {
          title: this.$t('Landing.List6.item1.title'),
          description: this.$t('Landing.List6.item1.description'),
          closed: true,
        },
        {
          title: this.$t('Landing.List6.item2.title'),
          description: this.$t('Landing.List6.item2.description'),
          closed: true,
        },
        {
          title: this.$t('Landing.List6.item3.title'),
          description: this.$t('Landing.List6.item3.description'),
          closed: true,
        },
        {
          title: this.$t('Landing.List6.item4.title'),
          description: this.$t('Landing.List6.item4.description'),
          closed: true,
        },
        {
          title: this.$t('Landing.List6.item5.title'),
          description: this.$t('Landing.List6.item5.description'),
          closed: true,
        },
        {
          title: this.$t('Landing.List6.item6.title'),
          description: this.$t('Landing.List6.item6.description'),
          closed: true,
        },
      ],
      steps: this.$t('Landing.Steps'),
    };
  },
  components: {
    NewsLetter,
    // MemberCard
  },
  /* computed: {
    getTeamList() {
      return teamList.slice(0, 4);
    }
  }, */
  mounted() {
    console.log(this.$cookies.get('userId'));
    console.log(this.$cookies.get('Token'));
    if (this.$cookies.get('userId') && this.$cookies.get('Token')) {
      this.$store.commit('auth/SET_BEARER', this.$cookies.get('Token'));
      axios
        .get('https://api.video.wiki/api/users/' + this.$cookies.get('userId'))
        .then((res) => {
          this.$store.commit('UPDATE_USER_INFO', res.data, { root: true });
          console.log(res.data);
        });
    } else {
      // localStorage.clear();
      null;
    }
    this.expand = (idx) => this.isClosed(idx);
    this.demoVideoUrl =
      'https://videowikistorage.blob.core.windows.net/vw-videos/videowiki_features_explained.mp4';
  },
  methods: {
    download() {
      this.$store.dispatch('studio/download');
    },
    isClosed(idx) {
      if (this.$refs[`collapse_${idx}`][0].maxHeight === '0px') return true;
      return false;
    },
    getStepIcon(index) {
      return require(`../assets/images/landing-page/step${index + 1}.png`);
    },
  },
  beforeDestroy() {
    if (this.$refs.vsCollapse) {
      for (const collapseItem of this.$refs.vsCollapse.$children) {
        window.removeEventListener('resize', collapseItem.changeHeight);
      }
    }
  },
  created() {
    if (this.$cookies.get('userId') && this.$cookies.get('Token')) {
    } else {
      // localStorage.clear();
      null;
    }
  },
};
</script>

<style scoped>
p {
  color: #544837 !important;
}
.aligncenter {
  text-align: center;
}
.no-border {
  border-bottom: none;
}
.section {
  padding: 8%;
}
.card-img {
  display: flex;
  justify-content: center;
  padding: 2rem;
}
.timeline-icon {
  position: absolute;
  right: 50%;
  transform: translateX(50%);
}
@media only screen and (min-width: 768px) {
  .timeline::before {
    content: '';
    position: absolute;
    height: 85.5%;
    width: 1px;
    border-right: 0.5px dashed rgba(230, 73, 128, 0.7);
    left: 50%;
    transform: translateX(-50%);
  }
}
img {
  height: 100%;
}
</style>
