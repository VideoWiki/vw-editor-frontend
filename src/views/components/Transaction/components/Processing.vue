<template>
  <div>
    <div class="px-2">
      <h2 class="font-extrabold">Transaction Processing</h2>
      <p class="font-medium mb-8 text-custom-black">
        Please don't close this tab, transaction under processing.
      </p>
    </div>
    <vs-divider />
    <template v-for="(step, idx) in transactionSteps">
      <div class="flex items-center -mx-1 px-2 mb-4" :key="`step_${idx}`">
        <div class="px-1">
          <vs-avatar
            v-if="idx + 1 < currentTransactionStep"
            color="success"
            icon="done"
            size="40px"
            class="currentStep"
          />
          <vs-avatar
            v-else
            color="#ffffff"
            :text="`${idx + 1}`"
            :textColor="
              idx + 1 === currentTransactionStep ? 'success' : '#ADB2B9'
            "
            :id="`transaction-step-${idx + 1}`"
            class="font-bold step-bullet vs-con-loading__container"
            :class="{ currentStep: currentTransactionStep === idx + 1 }"
            size="40px"
          />
        </div>
        <div class="px-1">
          <template v-if="idx + 1 < currentTransactionStep">
            <h6 class="Center">{{ step.success }}</h6>
          </template>
          <template v-else>
            <h6
              :class="{
                inActiveStep: idx + 1 > currentTransactionStep,
                Center: idx + 1 !== currentTransactionStep,
              }"
            >
              {{ step.title }}
            </h6>
            <p class="text-xs mt-2" v-show="idx + 1 === currentTransactionStep">
              {{ step.description }}
            </p>
          </template>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
export default {
  name: 'Processing',
  props: ['txType'],
  data() {
    return {
      transaction: {
        Publish: [
          {
            title: 'Create Tokens & Pricing',
            description:
              'The Data NFT representing your asset, the Datatokens defining access to it, and the pricing schema are all created in a single transaction.',
            success: 'Token is created',
          },
          {
            title: 'Construct & Encrypt DDO',
            description:
              'Entered metadata is transformed into a structured document (DDO) where the file URLs, and the whole DDO itself are encrypted.',
            success: 'DDO is encrypted',
          },
          {
            title: 'Publish DDO',
            description:
              'The encrypted DDO is stored on-chain as part of the Data NFT. Indexers like Aquarius can decrypt the DDO for displaying purposes, but the file URLs can only be decrypted by exchanging the respective datatokens for this asset.',
            success: 'Asset Published on Ocean Protocol',
          },
          // {
          //   title: 'Permission to sell your content',
          //   description:
          //     'Note that we published content under your name with full rights to the content. Hence we need your permission to sell the access token on your behalf.',
          //   success: 'Approved',
          // },
          // {
          //   title: 'Create Exchange Key',
          //   description: 'Creating an exchange to sell the access token',
          //   success: 'Exchange Created. Publish Complete',
          // },
        ],
        Buy: [
          {
            title: 'Approving OCEAN and ordering asset',
            description:
              'We need your permission so that we can exchange your OCEAN tokens for the datatokens',
            success: 'Approved',
          },
        ],
        Download: [
          {
            title: 'Generating signature to access download url',
            description:
              'Register your account to the download service and if already registered, sign using metamask to authenticate your account.',
            success: 'Download Started',
          },
          /* {
            title: 'Sign the transaction to authenticate yourself',
            description: '',
            success: '',
          }, */
        ],
      },
    };
  },
  computed: {
    currentTransactionStep() {
      return this.$store.state.currentTransactionStep;
    },
    transactionSteps() {
      return this.transaction[this.txType];
    },
  },
  mounted() {
    this.$vs.loading({
      container: '#transaction-step-1',
      background: 'transparent',
      color: 'success',
      scale: 0.8,
    });
  },
  watch: {
    currentTransactionStep: function (newVal, oldVal) {
      this.$vs.loading.close(`#transaction-step-${oldVal} > .con-vs-loading`);
      if (newVal <= this.transactionSteps.length) {
        this.$vs.loading({
          container: `#transaction-step-${newVal}`,
          background: 'transparent',
          color: 'success',
          scale: 0.8,
        });
      }
    },
  },
  beforeDestroy() {
    if (this.currentTransactionStep <= this.transactionSteps.length) {
      this.$vs.loading.close(
        `#transaction-step-${this.currentTransactionStep} > .con-vs-loading`
      );
    }
  },
};
</script>
<style scoped>
.step-bullet {
  box-shadow: 0px 0px 16px rgb(144 150 146 / 16%);
}
.currentStep {
  box-shadow: 0px 0px 16px rgba(39, 174, 96, 0.16);
}
.inActiveStep {
  color: #adb2b9;
}
.Center {
  transform: translate(0, -4px);
}
</style>
