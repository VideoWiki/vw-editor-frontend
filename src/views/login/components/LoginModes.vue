<!-- eslint-disable prettier/prettier -->
<template>
  <!-- use the buttons prop for login modes buttons is array of json with link, color, text and description and percentage -->
  <!-- set prop linkMode to value if you dont want to visit a new page on button click -->
  <div>
    <h2 class="heading text-2xl md:text-4xl">Choose your <strong>login type </strong></h2>
    <!-- <v-popover offset="16">
      <button v-tooltip="'You have new messages.'" class="tooltip-target b3">
        Click me
      </button>

     <template slot="popover">
        <input
          class="tooltip-content"
          v-model="msg"
          placeholder="Tooltip content"
        />
        <p>
          {{ msg }}
        </p>

       </template>
    </v-popover> -->
    <div
      class="bar"
      :style="{
        '--color': currentButton.color,
        '--percentage': currentButton.percent,
      }"
    >
      <button
        v-for="(button, index) in buttons"
        :id="button.link"
        :key="button.link"
        shadow="sm"
        :title="button.text"
        pill
        :class="[
          currentValue === button.link
            ? 'active'
            : index < currentI
            ? 'preselected'
            : 'unselected',
        ]"
        :style="[
          currentValue === button.link ? { background: button.color } : {},
        ]"
        variant="#000"
        @click="nextStep(button.link)"
      />
    </div>
    <h3 :style="{ color: currentButton.color }">
      {{ currentButton.text }}
    </h3>
    <p style="color: black; font-size: 16px">
      {{ currentButton.description }}
    </p>
    <!-- login mode -->
    <div>
      <Restricted v-if="currentButton.percent == '0%'" />
      <Public v-else-if="currentButton.percent == '50%'" />
      <Private v-else />
    </div>
  </div>
</template>

<script>
import Private from './Private.vue';
import Vue from 'vue';
import Public from './Public.vue';
import Restricted from './Restricted.vue';
export default {
  name: 'LoginModes',
  components: {
    Private,
    Restricted,
    Public,
  },
  model: {
    prop: 'value',
    event: 'input',
  },
  props: {
    value: {
      type: String,
      default: '',
    },
    buttons: {
      type: Array,
      default: () => [
        {
          text: 'Web1',
          link: 'Login',
          color: '#DA9921',
          percent: '0%',
          description: 'Login using your Email & Password.',
        },
        {
          text: 'Web2',
          link: 'Google Login',
          color: '#4CD964',
          percent: '50%',
          description: 'Login using your Social Profile',
        },
        {
          text: 'Web3',
          link: 'Wallet Login',
          color: '#F30200',
          percent: '100%',
          description: 'Login With Crypto Wallet',
        },
      ],
    },
    linkMode: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      currentButton: '',
      currentI: 0,
      proxyValue: '',
      msg: '',
    };
  },
  computed: {
    currentValue() {
      if (this.linkMode) {
        return this.$route.name;
      }
      return this.proxyValue;
    },
  },
  watch: {
    proxyValue() {
      this.getcurrent();
      this.$emit('input', this.currentValue);
    },
    $route() {
      // doesnt colors the slider appropiately on using back/forward keys without this
      this.getcurrent();
    },
  },
  created() {
    if (!this.linkMode) {
      this.proxyValue = this.value;
    }
    this.getcurrent();
  },
  methods: {
    nextStep(link) {
      if (this.linkMode) {
        this.$router.push({ name: link }, () => {
          this.proxyValue = link;
        });
      } else {
        this.proxyValue = link;
      }
    },
    getcurrent() {
      for (let i = 0; i < this.buttons.length; i += 1) {
        const button = this.buttons[i];
        if (this.currentValue === button.link) {
          this.currentI = i;
          this.currentButton = button;
        }
      }
    },
  },
};
</script>

<style scoped>
button {
  border-radius: 15px;
  cursor: pointer;
}
.heading {
  font-weight: 500;
  font-size: 32px;
  text-align: left;
  margin-top: 2rem;
  margin-bottom: 3rem;
  color: black;
}
.preselected {
  background: var(--color);
  border-style: unset;
  height: 15px;
  width: 15px;
  padding: 0px;
}
.active {
  width: 25px;
  height: 25px;
  padding: 0px;
  border: 3px solid white;
  box-shadow: 0px 2px 8px rgba(243, 2, 0, 0.25);
}
.bar {
  background: linear-gradient(to right,var(--color, blue) var(--percentage), #d2d6d9 var(--percentage));
  display: flex;
  margin: 2rem 0;
  justify-content: space-between;
  align-items: center;
  position: relative;
  overflow: visible;
  width: 100%;
  height: 5px;
  margin-bottom: 3rem;
}
.unselected {
  height: 15px;
  width: 15px;
  padding: 0px;
  background-color: #d2d6d9;
  border: #d2d6d9;
}
</style>

<style lang="scss">
.tooltip {
  // ...

  &.popover {
    $color: #000;

    .popover-inner {
      background: $color;
      color: white;
      padding: 24px;
      border-radius: 5px;
      box-shadow: 0 5px 30px rgba(black, 1);
    }

    .popover-arrow {
      border-color: $color;
    }
  }
}
.tooltip-arrow {
  z-index: 10000;
}
</style>
