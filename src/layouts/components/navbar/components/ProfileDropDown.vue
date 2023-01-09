<template>
  <div class="the-navbar__user-meta flex items-center">
    <!--div class="text-right leading-tight hidden sm:block">
      <p class="font-semibold">{{ activeUserInfo.displayName }}</p>
      <small>Available</small>
    </div-->

    <vs-dropdown vs-custom-content vs-trigger-click class="cursor-pointer">
      <div class="flex items-center">
        <vs-icon icon-pack="feather" icon="icon icon-chevron-down" />
        <div class="con-img ml-3">
          <!--img
            key="onlineImg"
            :src="activeUserInfo.profile_image"
            alt="user-img"
            width="40"
            height="40"
            class="rounded-full shadow-md cursor-pointer block user-img-icon"
          /-->
          <vs-avatar
            :text="getFirstLetter(activeUserInfo.first_name)"
            color="primary"
            class="m-0 shadow-md"
            :src="
              activeUserInfo.profile_image ? activeUserInfo.profile_image : ''
            "
            size="40px"
          />
        </div>
      </div>
      <vs-dropdown-menu class="vx-navbar-dropdown">
        <template v-if="forClassroom">
          <ul style="min-width: 9rem">
            <!-- <a
              href="https://videowiki.pt"
              class="text-custom-grey"
              target="_parent"
            >
              <li
                class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white"
              >
                <feather-icon icon="ExternalLinkIcon" svgClasses="w-4 h-4" />
                <span class="ml-2">VideoWiki</span>
              </li>
            </a> -->
            <a
              :href="url + '/profile'"
              class="text-custom-grey"
              target="_parent"
            >
              <li
                class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white"
              >
                <feather-icon icon="UserIcon" svgClasses="w-4 h-4" />
                <span class="ml-2">My Profile</span>
              </li>
            </a>
            <a
              :href="url + '/dashboard'"
              class="text-custom-grey"
              target="_parent"
            >
              <li
                class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white"
              >
                <feather-icon icon="HomeIcon" svgClasses="w-4 h-4" />
                <span class="ml-2">Dashboard</span>
              </li>
            </a>
            <a
              :href="url + '/myvideos'"
              class="text-custom-grey"
              target="_parent"
            >
              <li
                class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white"
              >
                <feather-icon icon="VideoIcon" svgClasses="w-4 h-4" />
                <span class="ml-2">My Videos</span>
              </li>
            </a>

            <a
              :href="getClassroomLink"
              class="text-custom-grey"
              target="_parent"
            >
              <li
                class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white"
              >
                <feather-icon icon="ClipboardIcon" svgClasses="w-4 h-4" />
                <span class="ml-2">My classes</span>
              </li>
            </a>
            <a
              href="https://fider.video.wiki/"
              class="text-custom-grey"
              target="_parent"
            >
              <li
                class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white"
              >
                <feather-icon icon="StarIcon" svgClasses="w-4 h-4" />
                <span class="ml-2">Features</span>
              </li>
            </a>
            <li
              class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white"
              @click="logout"
            >
              <feather-icon icon="LogOutIcon" svgClasses="w-4 h-4" />
              <span class="ml-2">Logout</span>
            </li>
          </ul>
        </template>
        <ul style="min-width: 9rem" v-else>
          <router-link to="/profile" class="text-custom-grey">
            <li
              class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white"
            >
              <feather-icon icon="UserIcon" svgClasses="w-4 h-4" />
              <span class="ml-2">{{ $t('ProfileDropDown.profile') }}</span>
            </li>
          </router-link>
          <vs-divider class="m-1" />
          <router-link to="/dashboard" class="text-custom-grey">
            <li
              class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white"
            >
              <feather-icon icon="HomeIcon" svgClasses="w-4 h-4" />
              <span class="ml-2">{{ $t('ProfileDropDown.dashboard') }}</span>
            </li>
          </router-link>

          <vs-divider class="m-1" />

          <router-link to="/myvideos" class="text-custom-grey">
            <li
              class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white"
            >
              <feather-icon icon="VideoIcon" svgClasses="w-4 h-4" />
              <span class="ml-2">{{ $t('ProfileDropDown.video') }}</span>
            </li>
          </router-link>
          <vs-divider class="m-1" />

          <a :href="getClassroomLink" class="text-custom-grey">
            <li
              class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white"
            >
              <feather-icon icon="ClipboardIcon" svgClasses="w-4 h-4" />
              <span class="ml-2">{{ $t('ProfileDropDown.class') }}</span>
            </li>
          </a>
          <vs-divider class="m-1" />
          <a
            href="https://fider.video.wiki/"
            class="text-custom-grey"
            target="_parent"
          >
            <li
              class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white"
            >
              <feather-icon icon="StarIcon" svgClasses="w-4 h-4" />
              <span class="ml-2">Features</span>
            </li>
          </a>

          <vs-divider class="m-1" />

          <li
            class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white"
            @click="logout"
          >
            <feather-icon icon="LogOutIcon" svgClasses="w-4 h-4" />
            <span class="ml-2">{{ $t('ProfileDropDown.logout') }}</span>
          </li>
        </ul>
      </vs-dropdown-menu>
    </vs-dropdown>
  </div>
</template>

<script>
import { utils } from '@/mixins/index';
import constants from '../../../../../constant';

export default {
  mixins: [utils],
  data() {
    return { url: constants.url };
  },
  props: {
    forClassroom: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    activeUserInfo() {
      return this.$store.state.AppActiveUser;
    },
    getClassroomLink() {
      return `https://room.video.wiki/b/start_class?name=${this.activeUserInfo.first_name}&email=${this.activeUserInfo.email}`;
    },
  },
  methods: {
    logout() {
      this.$cookies.remove('userId');
      this.$cookies.remove('Token');

      localStorage.clear();
      return this.$store.dispatch('auth/logOut');
    },
  },
};
</script>
<style scoped>
.user-img-icon {
  background: white;
}
</style>
