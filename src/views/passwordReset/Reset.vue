<template>
  <div class="flex content-between" id="page-login">
    <div class="hidden lg:flex md:flex relative h-screen w-5/12">
      <img
        src="@/assets/images/pages/loginbg.png"
        alt="login"
        class="w-10/12"
      />
      <router-link
        tag="div"
        to="/"
        class="cursor-pointer flex -mx-1 items-center absolute company-logo"
      >
        <img
          src="@/assets/images/logo/logo.svg"
          class="px-1 svg-white h-12"
        /><span class="px-1 text-white text-3xl font-bold">{{
          $t('Login.videowiki')
        }}</span>
      </router-link>
      <a
        tag="div"
        target="_blank"
        href="https://principles.fairdatasociety.org/"
        class="cursor-pointer flex -mx-1 items-center absolute fairsociety-link link"
      >
        <span class="px-1 text-white text-xl font-semibold"
          >Data policies aligned with Fair Data Society Principles
        </span>
      </a>
    </div>

    <div class="lg:w-5/12 md:w-full flex justify-center">
      <ResetPassword v-if="$route.name === 'Reset Password'" />
      <password-email v-else />
    </div>
  </div>
</template>

<script>
import PasswordEmail from './PasswordEmail.vue';
import ResetPassword from './ResetPassword.vue';
export default {
  components: {
    ResetPassword,
    PasswordEmail,
  },
};
</script>

<style lang="scss">
.link {
  width: 60%;
  margin-left: -40px !important;
  text-align: center;
}
.login-tabs-container {
  min-height: 505px;
  padding-top: 5.5rem;

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
  bottom: 4.5em;
  left: 25%;
}
</style>
