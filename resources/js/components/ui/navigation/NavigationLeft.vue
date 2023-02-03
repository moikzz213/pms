<template>
  <v-navigation-drawer fixed permanent left class="mt-header hive-side-drawer hive-scroll-style">
    <v-card v-if="loadingComponent == true" class="elevation-0">
      <v-skeleton-loader
        v-for="n in 5"
        :key="n"
        class="mx-auto"
        max-width="100%"
        type="list-item-three-line"
      ></v-skeleton-loader>
    </v-card>
    <!-- nav-left  -->
    <v-list v-else dense nav class="rounded-lg px-5 py-5">
      <!-- Navigation Items -->
      <div v-for="item in commonNav" :key="item.title">
        <v-list-item :to="item.location" class="mb-1 textcolor--text" active-class="secondary">
          <v-list-item-action class="mr-3">
            <v-icon small color="dark">{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content class="nav-title" >
            <v-list-item-title v-text="item.title"> </v-list-item-title>
          </v-list-item-content>
          <!-- Notification Info here -->
        </v-list-item>
      </div>
      <v-divider class="my-2"></v-divider>
      <div v-for="item in secondaryNav" :key="item.title">
        <v-list-item :to="item.location" class="mb-1" active-class="secondary">
          <v-list-item-action class="mr-3">
            <v-icon small color="dark">{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content class="">
            <v-list-item-title v-text="item.title"> </v-list-item-title>
          </v-list-item-content>
          <!-- Notification Info here -->
        </v-list-item>
      </div>
      <v-divider class="my-2"></v-divider>
      <a href="https://gagconnect.gagroup.net/" target="_blank">
        <v-img max-width="250" src="/images/gag-connect-hive2.jpg"></v-img
      ></a>
      <v-divider class="my-2"></v-divider>
      <a class="speak-up" href="https://speakup.gagroup.net/" target="_blank">
        <v-img max-width="250" src="/images/speakup.png"></v-img
      ></a>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  data() {
    return {
      loadingComponent: true,
      commonNav: [
        {
          title: "Feed",
          icon: "mdi-newspaper-variant-multiple",
          location: "/e/feeds/all",
        },
        {
          title: "NEWS & ARTICLES",
          icon: "mdi-newspaper-variant-outline",
          location: "/e/feeds/post",
        },
        {
          title: "BRANDS",
          icon: "mdi-office-building-outline",
          location: "/e/brands",
        },
        {
          title: "COLLEAGUES",
          icon: "mdi-human-capacity-increase",
          location: "/e/colleagues",
        },
        {
          title: "TRAINING VIDEOS",
          icon: "mdi-video-box",
          location: "/e/feeds/training",
        },
        {
          title: "CAREERS",
          icon: "mdi-book-open-variant",
          location: "/e/feeds/career",
        },
      ],
      secondaryNav: [
        {
          title: "BIRTHDAYS",
          icon: "mdi-cake-layered",
          location: "/e/birthdays",
        },
        {
          title: "POLLS",
          icon: "mdi-waves",
          location: "/e/feeds/poll",
        },
        {
          title: "EVENTS",
          icon: "mdi-lightbulb-group-outline",
          location: "/e/feeds/event",
        },
        {
          title: "MARKETPLACE",
          icon: "mdi-swap-horizontal",
          location: "/e/marketplace",
        },
      ],
    };
  },
  created() {
    setTimeout(() => {
      this.loadingComponent = false;
    }, 300);
  },
};
</script>
