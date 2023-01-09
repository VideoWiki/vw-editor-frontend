<template>
  <div>
    <div class="overlay-bg" v-if="wallet" @click="showWallets">
      <div class="overlay-inner" @click.stop>
        <button
          @click="showWallets"
          class="border-none rounded-full cross-btn text-xl font-semibold"
        >
          X
        </button>
        <h2 class="my-4">Select Wallet</h2>
        <!-- wallet type  -->
      </div>
    </div>

    <!-- connect to wallet -->
    <div>
      <!-- <vs-button @click="showWallets" class="flex-1 font-bold h-16"
        >Connect wallet</vs-button
        > -->
      <Metamaskbtn :payload="this.payload" />
      <p>
        Your wallet information is not mapped to your email or name. It is saved
        with encryption and only used for the airdrop configured by the event
        admin.
      </p>
    </div>
  </div>
</template>

<script>
import Metamaskbtn from './PrivateLoginButtons/Metamaskbtn.vue';

export default {
  components: { Metamaskbtn },
  props: ['payload'],
  data() {
    return {
      wallet: false,
    };
  },
  methods: {
    showWallets() {
      this.wallet = !this.wallet;
    },
  },
};
</script>

<style scoped>
.cross-btn {
  z-index: 250;
  background-color: #d5d0d0;
  color: rgb(110, 106, 106);
  width: 3em;
  height: 3em;
  cursor: pointer;
  margin-top: -1.5em;
}
.overlay-bg {
  top: 0;
  left: 0;
  z-index: 100;
  background-color: #7d7c7977;
  position: fixed;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.overlay-inner {
  width: 30%;
  border-radius: 5px;
  background-color: #fff;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
}
p {
  color: #101010 !important;
}
@media only screen and (max-width: 600px) {
  .overlay-inner {
    width: 85%;
  }
}
</style>
