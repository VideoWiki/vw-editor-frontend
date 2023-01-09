<template>
  <div>
    <form class="mt-6" @submit.prevent="login">
      <div class="vx-row mb-6">
        <div class="vx-col w-full">
          <div class="mb-4">
            <h6>{{ $t('Login.email') }}<span class="text-danger">*</span></h6>
            <div class="h-2">
              <span class="text-danger text-sm" v-show="errors.has('email')">{{
                errors.first('email')
              }}</span>
            </div>
          </div>
          <input
            v-validate="'required|email'"
            type="email"
            name="email"
            :placeholder="$t('Login.email_p')"
            class="modified-input"
            autocomplete="off"
            v-model="email"
          />
        </div>
      </div>
      <div class="vx-row mb-6">
        <div class="vx-col w-full">
          <h6 class="mb-4">
            {{ $t('Login.password') }}<span class="text-danger">*</span>
          </h6>
          <div class="flex relative">
            <input
              :type="showPassword ? 'text' : 'password'"
              data-vv-validate-on="blur"
              v-validate="'required'"
              name="password"
              :placeholder="$t('Login.password_p')"
              class="modified-input"
              autocomplete="off"
              v-model="password"
            />
            <vs-icon
              :icon="showPassword ? 'visibility_off' : 'visibility'"
              class="input-icon"
              @click="showPassword = !showPassword"
              size="25px"
            />
          </div>
        </div>
      </div>

      <div class="flex flex-wrap justify-between my-5" v-if="!popup">
        <vs-checkbox v-model="checkbox_remember_me" class="mb-3">{{
          $t('Login.remember')
        }}</vs-checkbox>
        <router-link to="/password/email">{{ $t('Login.forgot') }}</router-link>
      </div>
      <div class="flex flex-wrap mb-3">
        <vs-button
          :disabled="!validateForm"
          @click.prevent="loginJWT"
          class="flex-1 font-bold h-16"
          >{{ $t('Login.login') }}</vs-button
        >
      </div>
      <input type="submit" value="" style="display: none" />
    </form>
    <div class="flex flex-wrap mb-3 justify-center">
      {{ $t('Login.account') }}
      <span
        class="ml-1 text-primary cursor-pointer"
        @click="navigateToRegister"
        >{{ $t('Login.create') }}</span
      >
    </div>
  </div>
</template>

<script>
import constants from '../../../../constant';

export default {
  data() {
    return {
      constants,
      email: '',
      password: '',
      checkbox_remember_me: false,
      showPassword: false,
      required: false,
    };
  },
  props: {
    popup: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  computed: {
    validateForm() {
      return !this.errors.any() && this.email !== '' && this.password !== '';
    },
    activeUserInfo() {
      return this.$store.state.AppActiveUser;
    },
  },
  mounted() {},
  methods: {
    login() {
      if (this.validateForm) {
        this.loginJWT();
      }
    },
    checkLogin() {
      // If user is already logged in notify
      if (this.$store.state.auth.isUserLoggedIn()) {
        this.$vs.notify({
          title: this.$t('Login.notify.title'),
          text: this.$t('Login.notify.text'),
          iconPack: 'feather',
          icon: 'icon-alert-circle',
          color: 'warning',
        });

        return false;
      }
      return true;
    },
    loginJWT() {
      if (!this.checkLogin()) return;

      // Loading
      this.$vs.loading();

      const payload = {
        checkbox_remember_me: this.checkbox_remember_me,
        userDetails: {
          email: this.email,
          password: this.password,
        },
      };

      this.$store
        .dispatch('auth/login', payload)
        .then((response) => {
          this.$cookies.set(
            'Token',
            response.data.accessToken,
            null,
            null,
            'https://cast.video.wiki'
          );
          this.$cookies.set(
            'userId',
            response.data.usersData.id,
            null,
            null,
            'https://cast.video.wiki'
          );
          this.$cookies.set(
            'Token',
            response.data.accessToken,
            null,
            null,
            'https://room.video.wiki'
          );
          this.$cookies.set(
            'userId',
            response.data.usersData.id,
            null,
            null,
            'https://room.video.wiki'
          );

          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({
            event: 'login',
            authenticationMethod: 'Email',
            userId: response.data.usersData.id, //this should be replaced with an actual ID
          });
          this.$vs.notify({
            title: 'Success',
            text: 'Login Successful',
            iconPack: 'feather',
            color: 'success',
          });

          this.$vs.loading.close();
          // window.location.href = '/';
          this.$acl.change(this.activeUserInfo.userRole);
          if (this.popup) this.$emit('loggedIn');
          else this.$router.push('/');
        })
        .catch((error) => {
          if (
            error.response.data.message ===
              "user doesn't exist , register yourself" ||
            error.response.data.message === 'invalid Password!'
          ) {
            if (
              error.response.data.message ===
              "user doesn't exist , register yourself"
            )
              this.$vs.notify({
                time: 6000,
                title: 'Error',
                text: 'User does not exist. Register yourself.',
                iconPack: 'feather',
                icon: 'icon-alert-circle',
                color: 'danger',
              });
            else
              this.$vs.notify({
                time: 6000,
                title: 'Error',
                text: 'Password entered is incorrect.',
                iconPack: 'feather',
                icon: 'icon-alert-circle',
                color: 'danger',
              });
          } else {
            this.$vs.notify({
              title: 'Error',
              text: error.response.data.message[0],
              iconPack: 'feather',
              icon: 'icon-alert-circle',
              color: 'danger',
            });
          }
          this.$vs.loading.close();
        });
    },
    registerUser() {
      if (!this.checkLogin()) return;
      this.$router.push('/register').catch(() => {});
    },
    navigateToRegister() {
      if (this.popup) this.$emit('toRegister');
      else this.$router.push('/register');
    },
  },
};
</script>
<style scoped>
.modified-input {
  height: 60px;
  border: none;
  /* border-radius: 16px; */
  background: #f3f3f3;
  font-family: Montserrat;
  border-radius: 4px;
  padding: 2rem;
  width: 100%;
}
.input-icon {
  position: absolute;
  right: 5%;
  bottom: 30%;
  cursor: pointer;
}
</style>
