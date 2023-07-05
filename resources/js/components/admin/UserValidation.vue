<template>
  <div>
    <v-container class="py-8" v-if="pageLoading == true">
      <v-row>
        <v-col cols="12">
          <v-skeleton-loader class="mx-auto" max-width="100%"
            type="list-item-avatar-three-line, image, article"></v-skeleton-loader>
        </v-col>
      </v-row>
    </v-container>

  </div>
</template>
<script>
export default {
  data() {
    return {
      pageLoading: true,

    };
  }, 
    
  created() {
    setTimeout(() => {
      if (this.$store.state.authUser.userObject.status == undefined) {
        setTimeout(() => {
          if (this.$store.state.authUser.userObject.status == undefined) {
            setTimeout(() => {
              if (this.$store.state.authUser.userObject.status == undefined) {
                window.location.href = "/login";
              }
            }, 3500);
          }
        }, 2000);
      }
    }, 1000);

  },
  watch: {
    '$store.state.authUser.userObject': function () {
      if (this.$store.state.authUser.userObject.status == "active") {
        this.isLogg = true;
        this.$router.go(-1);
      } else {
        window.location.href = "/login";
      }
    }, 
  
  },
};
</script>
  