<template>
  <div class="flex" id="page-login">
    <div class="hidden lg:flex md:flex relative h-screen left-panel">
      <img src="@/assets/images/pages/loginbg.png" alt="login" class="w-20" />
      <router-link
        tag="div"
        to="/"
        class="cursor-pointer z-50 flex -mx-1 items-center absolute company-logo"
      >
        <img
          src="@/assets/images/logo/logo.svg"
          class="svg-white mr-2 h-16"
        /><span class="px-1 text-white font-bold vx-logo-text">{{
          $t('Login.videowiki')
        }}</span>
      </router-link>
      <a
        tag="div"
        href="https://principles.fairdatasociety.org/"
        class="cursor-pointer z-50 inline-block w-full flex -mx-1 items-center absolute fairsociety-link"
      >
        <p class="text-center text-white w-full text-xl font-semibold">
          {{ $t('Login.principles') }}
        </p>
      </a>
    </div>

    <div class="w-full md:w-1/2 lg:w-1/2 mx-auto flex justify-center">
      <div class="px-8 login-tabs-container lg:w-2/3">
        <login-jwt></login-jwt>
      </div>
    </div>
  </div>
</template>

<script>
import LoginJwt from './LoginJWT.vue';

export default {
  components: {
    LoginJwt,
  },
};
</script>

<style lang="scss">
.login-tabs-container {
  min-height: 505px;
  padding-top: 2rem;

  .con-tab {
    padding-bottom: 14px;
  }

  .con-slot-tabs {
    margin-top: 1rem;
  }
}
.svg-white {
  filter: invert(100%) sepia(100%) saturate(0%) hue-rotate(130deg)
    brightness(106%) contrast(103%);
}
.company-logo {
  top: 5%;
  left: 10%;
}

.fairsociety-link {
  bottom: 10%;
}

.left-panel::after {
  content: '';
  position: absolute;
  top: 0%;
  left: 0%;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.35);
  z-index: 40;
}
.vx-logo-text {
  font-size: 22px;
  font-weight: 600;
  animation: 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) 0s normal forwards 1 fadein;
}
</style>
