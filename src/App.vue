<!-- =========================================================================================
	File Name: App.vue
	Description: Main vue file - APP
	----------------------------------------------------------------------------------------
	Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
	Author: Pixinvent
	Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <div id="app" :class="vueAppClasses">
    <router-view @setAppClasses="setAppClasses" />
    <vs-popup title="Login/Register" :active.sync="authPopup">
      <div class="w-2/3 mx-auto">
        <h1 class="mb-4">
          <b>{{ login ? 'Login' : 'Register' }}</b>
        </h1>
        <Login
          v-if="login"
          :popup="true"
          @loggedIn="$store.commit('TOGGLE_LOGIN_POPUP', false)"
          @toRegister="login = false"
        />
        <Register
          v-else
          :popup="true"
          @registered="$store.commit('TOGGLE_LOGIN_POPUP', false)"
          @toLogin="login = true"
        />
      </div>
    </vs-popup>
  </div>
</template>

<script>
import themeConfig from '@/../themeConfig.js';
import Login from '@/views/login/LoginJWT';
import Register from '@/views/register/RegisterJWT';
export default {
  data() {
    return {
      vueAppClasses: [],
      login: true
    };
  },
  components: {
    Login,
    Register
  },
  watch: {
    '$store.state.theme'(val) {
      this.toggleClassInBody(val);
    },
    '$vs.rtl'(val) {
      document.documentElement.setAttribute('dir', val ? 'rtl' : 'ltr');
    },
  },
  computed: {
    authPopup: {
      get() {
        return this.$store.state.authPopup;
      },
      set(value) {
        this.$store.commit('TOGGLE_LOGIN_POPUP', value);
      },
    },
  },
  methods: {
    toggleClassInBody(className) {
      if (className == 'dark') {
        if (document.body.className.match('theme-semi-dark'))
          document.body.classList.remove('theme-semi-dark');
        document.body.classList.add('theme-dark');
      } else if (className == 'semi-dark') {
        if (document.body.className.match('theme-dark'))
          document.body.classList.remove('theme-dark');
        document.body.classList.add('theme-semi-dark');
      } else {
        if (document.body.className.match('theme-dark'))
          document.body.classList.remove('theme-dark');
        if (document.body.className.match('theme-semi-dark'))
          document.body.classList.remove('theme-semi-dark');
      }
    },
    setAppClasses(classesStr) {
      this.vueAppClasses.push(classesStr);
    },
    handleWindowResize() {
      this.$store.commit('UPDATE_WINDOW_WIDTH', window.innerWidth);
      this.$store.commit('UPDATE_WINDOW_HEIGHT', window.innerHeight);

      // Set --vh property
      document.documentElement.style.setProperty(
        '--vh',
        `${window.innerHeight * 0.01}px`
      );
    },
    handleScroll() {
      this.$store.commit('UPDATE_WINDOW_SCROLL_Y', window.scrollY);
    },
  },
  mounted() {
    this.toggleClassInBody(themeConfig.theme);
    this.$store.commit('UPDATE_WINDOW_WIDTH', window.innerWidth);
    const vh = window.innerHeight * 0.01;
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  },
  async created() {
    const dir = this.$vs.rtl ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', dir);
    if (window.location !== window.parent.location) {
      this.$store.commit('SET_IFRAME_STATUS', true);
    }
    window.addEventListener('resize', this.handleWindowResize);
    window.addEventListener('scroll', this.handleScroll);
  },
  destroyed() {
    window.removeEventListener('resize', this.handleWindowResize);
    window.removeEventListener('scroll', this.handleScroll);
  },
};
</script>
<style>
input {
  font-family: Montserrat;
}
</style>
