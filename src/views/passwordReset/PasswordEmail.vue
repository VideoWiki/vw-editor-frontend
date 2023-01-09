<template>
  <div class="w-full pt-8 lg:px-5 mt-8">
    <form @submit.prevent="sendResetEmail">
      <div class="p-5 m-5">
        <div class="p-5 reset">
          <div class="mb-2 pl-3">
            <h1 class="font-black text-4xl">Forgot Password</h1>
            <p class="my-5 text-lg">
              Enter the email address you used when you joined and we’ll sent
              you instructions to reset your password.
              <br />
              <br />
              For security reasons, we do NOT store your password. So rest
              assured that we will never send your password via email
            </p>
          </div>
          <div class="vx-col m-2 relative">
            <h6 class="my-4 font-black">
              Email Address <span class="text-danger"> *</span>
            </h6>
            <input
              type="email"
              data-vv-validate-on="blur"
              v-validate="'required'"
              label="Email"
              name="Email"
              placeholder="Enter your email address"
              class="modified-input"
              autocomplete="off"
              v-model="emailReset"
            />
          </div>
          <vs-button
            @click="sendResetEmail"
            type="filled"
            class="font-semibold mt-3"
            >Send Email</vs-button
          >
        </div>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      emailReset: '',
    };
  },
  props: {},
  computed: {},
  mounted() {
    console.log(this.$route);
  },
  methods: {
    validateEmail(email) {
      return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,12})+$/.test(email);
    },
    sendResetEmail() {
      if (!this.validateEmail(this.emailReset)) {
        this.$vs.notify({
          title: 'Not an Email',
          text: 'Enter a valid Email',
          color: 'danger',
        });
        return;
      }
      this.$store
        .dispatch('auth/sendResetEmail', this.emailReset)
        .then((res) => {
          this.$vs.notify({
            title: 'Check your mail',
            text: 'Mail sent successfully',
            color: 'success',
          });
          this.resetEmail = false;
        })
        .catch((e) => {
          if (e.response.data.message === 'invalid emaiil') {
            this.$vs.notify({
              title: 'Error occurred',
              text: 'Invalid email ',
              color: 'danger',
            });
          } else {
            this.$vs.notify({
              title: 'Error occurred',
              text: 'Try Again',
              color: 'danger',
            });
          }
        });
    },
  },
};
</script>
<style scoped>
.modified-input {
  height: 60px;
  border: none;
  /* border-radius: 16px; */
  background: #e3e2e2;
  font-family: Montserrat;
  border-radius: 4px;
  padding: 2rem;
  width: 100%;
}
.reset {
  display: flex;
  flex-direction: column;
}
</style>
