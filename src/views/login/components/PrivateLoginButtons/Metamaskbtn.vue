<template>
  <div class="flex flex-wrap mt-6">
    <!-- <button
      @click.prevent="walletUse"
      class="my-4 wallet-btn rounded-md meta-btn"
    >
      <img class="wallet-icon" src="@/assets/images/login/metamask.png" /><span
        class="text-xl font-bold m-0"
        >Metamask</span
      >
    </button> -->
    <vs-button @click="walletUse" class="flex-1 font-bold h-16"
      >Connect wallet</vs-button
    >
  </div>
</template>

<script>
import Web3 from 'web3';
import constants from '../../../../../constant';

export default {
  data() {
    return {
      constants,
      nonce: '',
      signature: '',
      publicAddress: '',
      coinbase: '',
      verify: this.payload,
    };
  },
  props: ['payload'],
  computed: {
    activeUserInfo() {
      return this.$store.state.AppActiveUser;
    },
  },
  methods: {
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
    //Metamsask Connection
    async handleSignMessage(publicAddress, nonce) {
      // Loading
      this.$vs.loading();
      try {
        const web3 = new Web3(Web3.givenProvider);
        const signature = await web3.eth.personal.sign(
          `I am signing my one-time nonce: ${nonce}`,
          publicAddress,
          '' // MetaMask will ignore the password argument here
        );
        this.signature = signature;
        this.nonce = nonce;
        // Send signature to backend for auth...
        this.$store
          .dispatch('auth/sendSignature', {
            signature: this.signature,
            nonce: this.nonce,
          })
          .then((res) => {
            //uncomment the statment below before pushing wile
            window.location.replace('/');
            //Remove the statment below before pushing wile
            this.$vs.notify({
              title: this.$t('Login.notify.title'),
              text: 'Login Successfull',
              iconPack: 'feather',
              icon: 'icon-alert-circle',
              color: 'success',
            });
          });
      } catch (err) {
        this.$vs.loading.close();
        this.$vs.notify({
          title: this.$t('Login.notify.title'),
          text: this.$t('Metamasklogin.signmessage'),
          iconPack: 'feather',
          icon: 'icon-alert-circle',
          color: 'warning',
        });
      }
    },
    async loginWithMetamask() {
      // if (!this.checkLogin()) return;
      this.publicAddress = '';
      this.signature = '';
      this.nonce = '';
      this.coinbase = '';
      const web3 = new Web3(Web3.givenProvider);
      if (!web3.givenProvider) {
        this.$vs.notify({
          title: this.$t('Login.notify.title'),
          text: this.$t('Metamasklogin.install'),
          iconPack: 'feather',
          icon: 'icon-alert-circle',
          color: 'warning',
        });
      }
      const accounts = await ethereum.request({
        method: 'eth_requestAccounts',
      });
      const account = accounts[0];
      const coinbase = await web3.eth.getCoinbase();
      if (!coinbase) {
        this.$vs.notify({
          title: this.$t('Login.notify.title'),
          text: this.$t('Metamasklogin.activate'),
          iconPack: 'feather',
          icon: 'icon-alert-circle',
          color: 'warning',
        });
      }
      this.publicAddress = account.toLowerCase();
      this.$store
        .dispatch('auth/getNonce', { public_add: this.publicAddress })
        .then((res) =>
          // Popup MetaMask confirmation to sign message
          this.handleSignMessage(this.publicAddress, res.data.nonce)
        )
        .catch((err) => {
          console.log(err);
          this.$vs.notify({
            title: this.$t('Login.notify.title'),
            text: this.$t('Metamasklogin.tryagain'),
            iconPack: 'feather',
            icon: 'icon-alert-circle',
            color: 'danger',
          });
        });
    },
    async connectWallet() {
      await ethereum.send('eth_requestAccounts');
      // Get a Web3 instance for the wallet
      const web3 = new Web3(Web3.givenProvider);
      // Get list of accounts of the connected wallet
      const accounts = await web3.eth.getAccounts();
      // MetaMask does not give you all accounts, only the selected account
      const selectedAccount = accounts[0].toLowerCase();
      const payload = {
        cast_id: this.verify.cast_id,
        email: this.verify.email,
        public_address: selectedAccount,
      };
      this.$store
        .dispatch('auth/saveWalletAddress', payload)
        .then((res) => null)
        .catch((err) => {
          this.$vs.notify({
            title: this.$t('Login.notify.title'),
            text:
              err.response != null
                ? err.response.data.message
                : this.$t('Metamasklogin.notconnected'),
            iconPack: 'feather',
            icon: 'icon-alert-circle',
            color: 'danger',
          });
        });
    },
    walletUse() {
      console.log(this.$route.name);
      if (this.$route.name === 'Wallet Login') {
        console.log(178);
        this.loginWithMetamask();
      } else {
        this.connectWallet();
      }
    },
  },
};
</script>

<style scoped>
.wallet-btn {
  padding: 2em 1em;
  width: 27rem !important;
  background-color: rgba(175, 165, 165, 0.527);
  color: #312e2ed1;
  border-radius: 6px;
  height: 50px;
  display: inline-flex !important;
  justify-content: space-between;
  align-items: center;
  border: none;
  cursor: pointer;
}
.meta-btn:hover {
  box-shadow: 0 4px 8px 0 rgba(175, 165, 165, 0.527);
  background-color: #ff7b0086 !important;
  color: #ff7b00fb;
  transform: scale(1.1);
  transition: transform 0.2s;
}
.wallet-icon {
  width: 4rem;
  height: 2.5rem;
}
@media only screen and (max-width: 600px) {
  .wallet-btn {
    width: 20rem !important;
  }
}
</style>
