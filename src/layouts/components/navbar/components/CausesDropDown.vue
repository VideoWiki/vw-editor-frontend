<template>
  <vs-dropdown class="vx-navbar-dropdown" vs-trigger-click>
    <router-link
      to="/"
      class="text-dark text-2xl hover-link relative navItem"
      exact-active-class="link-active"
      >Causes
      </router-link
    >

    <vs-dropdown-menu>
      <vs-dropdown-item>
        <a href="http://ukraine.video.wiki" class="text-custom-grey">
          <li
            class="flex items-center py-2 px-6 cursor-pointer hover:bg-primary hover:text-white"
          >
            <!-- <feather-icon icon="TrendingUpIcon" svgClasses="w-4 h-4" /> -->
            <img class="country-flag" src="../../../../assets/images/country-flag/ukraine.png"/>
            <span class="ml-2">Ukraine</span>
            <span class="list-tag">new</span>
          </li>
        </a>
      </vs-dropdown-item>
      <!-- <hr> -->
      <vs-dropdown-item>
        <a
          href="http://afghan.video.wiki"
          class="text-custom-grey"
        >
          <li
            class="flex items-center py-2 px-6 cursor-pointer hover:bg-primary hover:text-white"
          >
            <!-- <feather-icon icon="ClipboardIcon" svgClasses="w-4 h-4" /> -->
            <img class="country-flag" src="../../../../assets/images/country-flag/afghanistan.png"/>
            <span class="ml-2">Afghan</span>
          </li>
        </a>
      </vs-dropdown-item>
    </vs-dropdown-menu>
  </vs-dropdown>
</template>

<style lang="scss" scoped>
.create-chip {
  top: -13px;
  left: -35px;
  min-height: 16px !important;
  visibility: hidden;
}
.create-chip span {
  font-size: 10px;
}
button:hover a {
  font-weight: bold;
}

button:hover a .create-chip {
  visibility: visible;
}
.list-tag{
  position: absolute;
  left: 2px;
  color: white;
  top: 4px;
  // background-color: #f0f0f0;
  background-color: rgba(var(--vs-primary), 1);
  padding: 1px 5px;
  font-size: 10px;
  border-radius: 8px;
}
.country-flag{
  height: 13px;
}
// hr{
//   margin: 0px 5px;
//   display: block; 
//   height: 1px;
//   border: 0; 
//   border-top: 1px solid #ccc;
//   padding: 0;
// }
</style>
