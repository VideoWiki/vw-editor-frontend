
<template>
  <div>
    <div class="text-xl font-bold text-black mb-6">{{ sectionName }}</div>
    <div class="title-links">
      <template v-for="subSection in sections[sectionName]">
        <div :key="subSection.title" class="text-base mb-3">
          <a :href="subSection.url" class="footer-link-item">{{
            subSection.title
          }}</a>
          <div v-if="subSection.title == 'Integration'">
            <template v-for="sub in subSection.integrations">
              <ul :key="sub.title">
                <li>
                  <a :href="sub.url" class="footer-sublink-item">{{
                    sub.title
                  }}</a>
                </li>
              </ul>
            </template>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
<script>
export default {
  name: 'FooterLinks',
  props: {
    sectionName: String,
  },
  data() {
    return {
      sections: {
        Product: [
          /* {
            title: 'Acquire Users',
            url: '#'
          },
          {
            title: 'Blockchain',
            url: '#'
          }, */
          {
            title: this.$t('FooterLinks.Product[0]'),
            url: '/studio',
          },
          /* {
            title: 'Coaching',
            url: '#'
          }, */
          {
            title: this.$t('FooterLinks.Product[1]'),
            url: '/classroom',
          },
          {
            title:  this.$t('FooterLinks.Product[2]'),
            url: 'https://cast.video.wiki',
          },
          /* {
            title: 'Investores',
            url: '#'
          } */
        ],
        Company: [
          {
            title: this.$t('FooterLinks.Company[0]'),
            url: '/about',
          },
          {
            title: this.$t('FooterLinks.Company[1]'),
            url: '/team',
          },
          /* {
            title: 'Brand Guidelines',
            url: '#'
          }, */
          {
            title: this.$t('FooterLinks.Company[2]'), // 'Press Kit',
            url: '/contact-us',
          },
        ],
        Ecosystem: [
          {
            title: this.$t('FooterLinks.Ecosystem.awards'),
            url: '/awards',
          },

          {
            title:  this.$t('FooterLinks.Ecosystem.integrations_head'),
            integrations: [
              {
                title: this.$t('FooterLinks.Ecosystem.integrations_list[0]'),
                url: '/integration/ocean-protocol',
              },
              {
                title: this.$t('FooterLinks.Ecosystem.integrations_list[1]'),
                url: '/integration/ms-teams',
              },
              {
                title: this.$t('FooterLinks.Ecosystem.integrations_list[2]'),
                url: '#',
              },
            ],
          },
          /* {
            title: 'Brand Guidelines',
            url: '#'
          }, */
          {
            title: this.$t('FooterLinks.Ecosystem.partners'), // 'Press Kit',
            url: '#',
          },
        ],
        Resources: [
          {
            title: this.$t('FooterLinks.Resources[0]'),
            url: '#',
          },
          {
            title: this.$t('FooterLinks.Resources[1]'),
            url: '#',
          },
          {
            title: this.$t('FooterLinks.Resources[2]'),
            url: '#',
          },
          {
            title: this.$t('FooterLinks.Resources[3]'),
            url: '#',
          },
          {
            title: this.$t('FooterLinks.Resources[4]'),
            url: '#',
          },
        ],
        'Terms and Conditions': [
          {
            title: this.$t('FooterLinks.T&C[0]'),
            url: '#',
          },
          {
            title: this.$t('FooterLinks.T&C[1]'),
            url: '#',
          },
          {
            title: this.$t('FooterLinks.T&C[2]'),
            url: '#',
          },
          {
            title: this.$t('FooterLinks.T&C[3]'),
            url: '#',
          },
          {
            title: this.$t('FooterLinks.T&C[4]'),
            url: '#',
          },
        ],
      },
    };
  },
};
</script>
<style scoped>
.title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 2.5rem;
}
.footer-link-item {
  color: #544837;
}
.footer-sublink-item {
  color: #544837;
  position: relative;
  padding-left: 8px;
}
</style>
