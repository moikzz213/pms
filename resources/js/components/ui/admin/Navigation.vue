<template>
  <div class="no-print">
    <v-navigation-drawer class="elevation-4" v-model="drawer" floating app width="250px"
      :src="`${$baseUrl + '/images/gag-2.png'}`" color="#000" dark>
      <div width="100%" class="text-center pa-3 no-print">
        <v-avatar size="150">
          <v-img :src="printProfileImageUrl(authenticated_user)"></v-img>
        </v-avatar>
        <div class="overline white--text"> 
          {{ authenticated_user.profile.name }}
        </div> 
      </div>
      <v-divider></v-divider>
      <v-list dense rounded>
        <!-- Navigation Items -->
        <!-- Common Nav -->
        <nav-item v-for="item in commonNav" :key="item.title" :nav="item"></nav-item>
        <v-divider></v-divider>
        <nav-item v-for="item in moderatorNav" :key="item.title" :nav="item" 
        v-if="authenticated_user.role == 'superadmin' || authenticated_user.role == 'admin' || authenticated_user.role == 'procurement'"></nav-item>

        <v-list-item  v-on:click="logout">
          <v-list-item-action  >
            <v-icon  color="white">mdi-power</v-icon>
          </v-list-item-action>
          <v-list-item-content class="white--text">
            <v-list-item-title  >Logout </v-list-item-title>
          </v-list-item-content>
          <!-- Notification Info here -->
        </v-list-item>
      </v-list>

    </v-navigation-drawer>
    <v-app-bar app color="white" dense class="elevation-gag no-print">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" color="primary"></v-app-bar-nav-icon>
      <v-toolbar-title class="pl-1 mr-12 align-center d-flex">
        <v-img max-width="25" :src="`${$baseUrl + '/images/fav.png'}`"> </v-img>
        <span class="ml-2 title primary--text text-capitalize">{{ authenticated_user.role }} Panel</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <v-menu v-model="menu" :close-on-content-click="false" :nudge-width="150" transition="slide-y-transition" offset-y
        :nudge-bottom="3">
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
                  authenticated_user.profile.name
                }}</v-list-item-title>
                <v-list-item-subtitle>{{
                  authenticated_user.email
                }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-divider></v-divider>
          <v-card-actions>
            <v-btn depressed v-on:click="logout" width="100%">Logout</v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </v-app-bar>
  </div>
</template>

<script>
import NavItem from "./NavItem";
export default {
  components: {
    NavItem,
  },
  data() {
    return {
      authenticated_user: this.$store.state.authUser.userObject,
      profileImagePath: window.location.origin + "/images/placeholder-user.png",
      drawer: true,
      menu: false,
      moderatorNav: [
      // {
      //     title: "Comparisons",
      //     icon: "mdi-book-open-variant",
      //     location: "/d/admin/comparisons",
      //     slug: "comparisons",
      //   },
        {
          title: "Procurement",
          icon: "mdi-book-open-variant",
          location: "/d/admin/procurement-team",
          slug: "procurement",
        },
        {
          title: "LPO",
          icon: "mdi-book-open-page-variant-outline",
          location: "/d/admin/local-purchase-orders",
          slug: "lpo",
        },
        {
          title: "PAF",
          icon: "mdi-book-multiple-outline",
          location: "/d/admin/payment-approval-forms",
          slug: "lpo",
        },

        {
          title: "Settings",
          icon: "mdi-cog",
          subs: [
            {
              title: "Suppliers",
              icon: "mdi-file-document-multiple",
              location: "/d/admin/suppliers",
              slug: "suppliers",
            },
            {
              title: "Companies",
              icon: "mdi-file-document-multiple",
              location: "/d/admin/companies",
              slug: "companies",
            },
            {
              title: "Departments",
              icon: "mdi-file-document-multiple",
              location: "/d/admin/departments",
              slug: "departments",
            },
            {
              title: "Locations",
              icon: "mdi-file-document-multiple",
              location: "/d/admin/locations",
              slug: "locations",
            },
            {
              title: "Categories",
              icon: "mdi-file-document-multiple",
              location: "/d/admin/categories",
              slug: "categories",
            },
          ],
        },
        {
          title: "Users",
          icon: "mdi-account-group",
          location: "/d/admin/users",
          slug: "users",
        },
        {
          title: "Reports",
          icon: "mdi-graphql",
          location: "/d/admin/reports",
          slug: "reports",
        },

      ],
      commonNav: [
        {
          title: "Profile",
          icon: "mdi-account-cog-outline",
          location: "/d/admin/profile",
          slug: "profile",
        },
        {
          title: "Dashboard",
          icon: "mdi-microsoft",
          location: "/d/admin/dashboard",
          slug: "dashboard",
        },
        {
          title: "My Request",
          icon: "mdi-message-bulleted",
          location: "/d/admin/requests",
          slug: "requests",
        },
      ],
    };
  },
  methods: {
    logout: function (event) {
      event.preventDefault();
      document.getElementById("logout-form").submit();
    },
  },
};
</script>
