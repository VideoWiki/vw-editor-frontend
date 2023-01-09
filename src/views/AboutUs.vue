<template>
  <div>
    <div class="section flex bg-white">
      <div class="lg:w-1/2">
        <div class="lg:w-4/5 lg:mx-auto">
          <h1 class="text-4xl font-extrabold mb-8 lg:text-left text-center">
            {{$t('AboutUs.About.title')}}
          </h1>
          <p class="text-base font-medium mb-10 text-left">
            {{$t('AboutUs.About.info1')}}

            <br /><br />
           {{$t('AboutUs.About.info2')}}
            <br /><br />
            {{$t('AboutUs.About.info3')}}
            <a
              href="https://covid-eic.easme-web.eu/solution/videowiki/about"
              target="_blank"
              >{{$t('AboutUs.About.info4')}}</a
            >
           {{$t('AboutUs.About.info5')}}
          </p>
        </div>
      </div>
      <div class="lg:w-1/2 hidden lg:block">
        <img src="@/assets/images/pages/about1.svg" />
      </div>
    </div>

    <div class="section">
      <div class="text-center mb-20">
        <h1 class="font-extrabold text-4xl mb-4">{{$t('AboutUs.Team.title')}}</h1>
        
        <p class="font-medium text-left">
         {{$t('AboutUs.Team.info')}} <b>{{$t('AboutUs.Team.names[0]')}}</b> {{$t('AboutUs.Team.names[1]')}}
         <b>{{$t('AboutUs.Team.names[2]')}}</b> {{$t('AboutUs.Team.names[3]')}} <b>{{$t('AboutUs.Team.names[4]')}}</b>
        {{$t('AboutUs.Team.names[5]')}} <b>{{$t('AboutUs.Team.names[6]')}}</b> {{$t('AboutUs.Team.names[7]')}}
        </p>
      </div>
      <div class="vx-row">
        <div
          class="vx-col w-full mx-auto sm:w-1/2 md:w-1/3 lg:w-1/4 mb-base"
          v-for="member in getTeamList"
          :key="member.name"
        >
          <div class="flex flex-wrap">
            <MemberCard :member="member" />
          </div>
        </div>
      </div>
    </div>

    <div class="section flex bg-white">
      <div class="lg:w-1/2 hidden md:hidden sm:hidden lg:block">
        <img src="@/assets/images/pages/about2.svg" />
      </div>
      <div class="lg:w-1/2">
        <div class="lg:w-3/4 lg:mx-auto">
          <h1 class="text-4xl font-extrabold mb-8 lg:text-left text-center">
            {{$t('AboutUs.Video.title')}}
          </h1>
          <p class="text-base font-medium mb-10">
                {{$t('AboutUs.Video.info1')}}
            <br /><br />
             {{$t('AboutUs.Video.info2')}}
            <br /><br />
            {{$t('AboutUs.Video.info3')}}
            <span class="font-bold"
              > {{$t('AboutUs.Video.info4')}}</span
            >
          </p>
          <div class="lg:text-left text-center">
            <vs-button
              type="filled"
              class="bg-custom-purple text-base font-bold"
              @click="$router.push('/studio')"
              > {{$t('AboutUs.Video.button')}}</vs-button
            >
          </div>
        </div>
      </div>
    </div>

    <!--div class="section bg-white">
      <div class="w-full">
        <div class="vx-card" style="height: 100%">
          <div class="vx-card__collapsible-content vs-con-loading__container">
            <div class="vx-card__body flex flex-wrap justify-between">
              <div class="mb-6 w-full">
                <h3 class="mb-6 lg:text-left text-center">Send an Email</h3>
                <div class="vx-row mb-6">
                  <div class="vx-col w-1/2">
                    <h6 class="mb-4">
                      Full Name<span class="text-danger">*</span>
                    </h6>
                    <input
                      class="w-full base-input"
                      type="text"
                      placeholder="your name"
                    />
                  </div>
                  <div class="vx-col w-1/2">
                    <h6 class="mb-4">
                      Email<span class="text-danger">*</span>
                    </h6>
                    <input
                      class="w-full base-input"
                      type="Email"
                      placeholder="your email"
                    />
                  </div>
                </div>
                <div class="vx-row mb-6">
                  <div class="vx-col w-full">
                    <h6 class="mb-4">Message</h6>
                    <textarea class="message-box" placeholder="your message" />
                  </div>
                </div>
                <div class="lg:text-left text-center">
                  <vs-button
                    type="filled"
                    class="font-bold text-base bg-custom-purple"
                    >Send Message</vs-button
                  >
                </div>
              </div>
              <!--div class="lg:w-2/5 w-full mx-auto">
                <vx-card no-shadow class="address-box pl-8">
                  <h3 class="mb-12">Find us</h3>
                  <div>
                    <h5 class="mb-8">Corporate Headquarters</h5>
                    <p class="mb-4">
                      777 Passaic Ave Suite 375 Clifton, NJ 07012
                    </p>
                    <p class="mb-4">Phone: +011-667-4647</p>
                    <p class="mb-4">Email: info@videowiki.pt</p>
                  </div>
                  <div>
                    <h5 class="mb-8">Development Center</h5>
                    <p class="mb-4">
                      777 Passaic Ave Suite 375 Clifton, NJ 07012
                    </p>
                    <p class="mb-4">Phone: +011-667-4647</p>
                    <p class="mb-4">Email: info@videowiki.pt</p>
                  </div>
                </vx-card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div-->

    <div class="section">
      <NewsLetter />
    </div>
  </div>
</template>
<script>
import NewsLetter from './components/NewsLetter';
import { teamList } from '@/assets/data';
import MemberCard from './components/MemberCard';
export default {
  name: 'AboutUs',
  components: {
    NewsLetter,
    MemberCard
  },
  data() {
    return {};
  },
  computed: {
    getTeamList() {
      return teamList.slice(0, 4);
    }
  }
};
</script>

<style scoped>
.section {
  padding: 8%;
}

.message-box {
  height: 250px !important;
  border: none;
  background: #f3f4f6;
  font-size: 12px;
  overflow-y: auto;
  border-radius: 12px;
  color: #626262;
  width: 100%;
  opacity: 1;
  text-indent: 0.01%;
  font-family: Montserrat, Helvetica, Arial, sans-serif;
  font-weight: 400;
  font-style: normal;
  font-variant: normal;
  text-decoration: none solid rgb(98, 98, 98);
  text-align: start;
  line-height: 22.4px;
  vertical-align: baseline;
  padding: 9px;
}
.base-input {
  height: 45px;
  background: #f3f4f6;
  border-radius: 12px;
  border: none;
  padding: 1rem;
  font-family: Montserrat, Helvetica, Arial, sans-serif;
  font-weight: normal;
  font-size: 12px;
}
.address-box {
  background: #f4f5f7;
  border-radius: 8px;
}
</style>
