<template>
  <div>
    <v-app-bar app color="white" flat>
      <!-- :color="$vuetify.breakpoint.smAndDown ? 'grey darken-1' : 'transparent'" -->
      <div class="col-3">
        <v-img
          @click="() => openPage('Feed', { type: 'all' })"
          max-width="150"
          :src="`${$baseUrl + '/images/newhivelogoCloser.png'}`"
          style="cursor: pointer"
        ></v-img>
      </div>
      <div class="col-6">
        <v-tabs centered class="" color="grey darken-1">
          <v-tab v-for="item in nav" :key="item.title" :to="item.location">
            {{ item.title }}
          </v-tab>
        </v-tabs>
      </div>
      <div class="col-3 text-right">
        <v-menu
          v-model="menu"
          :close-on-content-click="false"
          :nudge-width="150"
          transition="slide-y-transition"
          offset-y
          :nudge-bottom="3"
        >
          <template v-slot:activator="{ on }">
            <v-btn text icon v-on="on">
              <v-avatar size="30" color="blue-grey lighten-4">
                <img :src="printProfileImageUrl(authenticated_user)" />
              </v-avatar>
            </v-btn>
          </template>
          <v-card>
            <v-list>
              <v-list-item>
                <v-list-item-avatar color="blue-grey lighten-4">
                  <img :src="printProfileImageUrl(authenticated_user)" />
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>{{
                    authenticated_user.profile.fullname
                  }}</v-list-item-title>
                  <v-list-item-subtitle>{{
                    authenticated_user.email
                  }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <v-divider></v-divider>
            <v-list dense class="py-3">
              <v-list-item-group>
                <v-list-item :to="'/e/profile'" class="primary--text">
                  <v-list-item-content>
                    <v-list-item-title>Account Settings</v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
            <v-divider></v-divider>
            <v-card-actions>
              <v-btn depressed v-on:click="logout" width="100%">Logout</v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </div>
    </v-app-bar>
    <v-row class="secondary-header">
      <v-col xs="12" sm="12">
       <v-tabs centered class="" color="grey darken-1">
          <v-tab v-for="item in secondaryNav" :key="item.title" :to="item.location">
            {{ item.title }}
          </v-tab>
        </v-tabs>
        </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  data() {
    return {
      authenticated_user: this.$store.state.authUser.userObject,
      profileImagePath:
        this.$store.state.authUser.userObject.images.length > 0
          ? window.location.origin +
            "/file/" +
            this.$store.state.authUser.userObject.images[0].path
          : window.location.origin + "/images/placeholder-user.png",
      drawer: true,
      menu: false,
      commonNav: [
        // {
        //   title: "HOME",
        //   icon: "mdi-home-outline",
        //   location: "/e/feed",
        // },
        {
          title: "PROBATION FORM",
          icon: "mdi-account",
          location: "/d/probation",
        },
        {
          title: "MY PERFORMACE",
          icon: "mdi-account",
          location: "/d/performance",
        },
        {
          title: "MY WALLET",
          icon: "mdi-account",
          location: "/e/wallet",
        },
      ],
      adminNav: [
        {
          title: "MODERATOR",
          icon: "mdi-account-group-outline",
          location: "/d/moderators",
        },
      ],
      nav: [],
 
      secondaryNav: [
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
  methods: {
    printInitials: function (text) {
      return text
        .split(" ")
        .slice(0, 2)
        .join(" ")
        .split(" ")
        .map((n) => n[0])
        .join("");
    },
    logout: function (event) {
      event.preventDefault();
      document.getElementById("logout-form").submit();
    },
    generateNav() {
      this.nav = [...this.nav, ...this.commonNav];
      if (
        this.authenticated_user.role == "admin" ||
        this.authenticated_user.role == "moderator" ||
        this.authenticated_user.role == "superadmin"
      ) {
        this.nav = [...this.nav, ...this.adminNav];
      }
    },
  },
  created() {
    this.generateNav();
  },
};
</script>
