<template>
  <div>
    <v-list-group
      active-class="ga-active-list-bg white--text"
      dark
      v-if="item.subs"
    >
      <template v-slot:activator>
        <v-list-item-action>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-action>
        <v-list-item-content>
          <v-list-item-title v-text="item.title"></v-list-item-title>
        </v-list-item-content>
      </template>
      <div v-for="sub in item.subs" :key="sub.title">
        <v-list-item   :to="sub.location" class="pl-10" active-class="secondary">
          <v-list-item-action class="mr-3">
            <v-icon small color="white">{{ sub.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content class="white--text">
            <v-list-item-title v-text="sub.title"> </v-list-item-title>
          </v-list-item-content>
          <!-- Notification Info here -->
        </v-list-item>
      </div>
    </v-list-group>
    <v-list-item v-else link :to="item.location" active-class="secondary">
      <v-list-item-action>
        <v-icon>{{ item.icon }}</v-icon>
      </v-list-item-action>
      <v-list-item-content>
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item-content>
    </v-list-item>
  </div>
</template>

<script>
export default {
  props: {
    nav: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      auth: this.$store.state.authUser.userObject,
      item: this.nav,
    };
  },
  methods:{
    //  returnAccess: function (slug) {
    //   let hasAccess = false;
    //   if(this.auth.role == 'superadmin' || this.auth.role == 'admin' || this.auth.role == 'procurement'){
    //     return true;
    //   }
       
    //   this.auth.access.map((o, i) => {
    //     if (slug == 'home' || slug == 'companies' || slug == 'departments' || slug == 'categories' || slug == o.slug) {
    //       hasAccess = true;
    //     }
    //   });
    //   return hasAccess;
    // },
  },
  created() {
    // console.log(this.item);
  },
};
</script> 