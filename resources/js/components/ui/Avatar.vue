<template>
  <div>
    <div
      v-if="userData !== null"
      class="d-flex align-center"
      :class="`d-flex align-center ${
        userData.user && userData.user.images.length > 0
          ? 'avatar-default-size'
          : 'default-size'
      }`"
    >
      <v-menu open-on-hover  origin="center center" :close-on-content-click="false"
      transition="scale-transition" bottom offset-y nudge-top="80%" nudge-left="10%">
        <template v-slot:activator="{ on, attrs }">
          <v-avatar
            color="blue-grey"
            class="mr-2 image-avatar"
            v-bind="attrs"
            v-on="on"
          >
            <v-img
              :width="sizes"
              :height="sizes"
              :aspect-ratio="1"
              class="ma-1 avatar-img"
              v-if="userData.user && userData.user.images.length > 0"
              :src="
                '/file/profile/' +
                userData.user.id +
                '/' +
                userData.user.images[0].path
              "
            ></v-img>
            <div v-else class="text-h5" v-bind="attrs" v-on="on">
              {{
                userData && userData.fullname
                  ? printInitials(userData.fullname)
                  : userData.profile.fullname
                  ? printInitials(userData.profile.fullname)
                  : ""
              }}
            </div>
          </v-avatar>
          <div
            class="d-flex flex-column profile-column"
            v-bind="attrs"
            v-on="on"
          >
            <div class="line-height-1em">
              <div class="primary--text font-weight-bold">
                {{
                  userData.fullname
                    ? userData.fullname
                    : userData.profile.fullname
                }}
              </div>
              <div class="mt-1 text-caption" v-if="colleague">
                {{ userData.position }}
              </div>
            </div>
            <div v-if="meta.status == true" class="line-height-1em">
              <small>
                {{ formatDateHelper(meta.post_date) }}
              </small>
            </div>
          </div>
        </template>

        <v-card maxWidth="530">
          <v-list>
            <v-list-item>
              <v-list-item-avatar size="130" class="bordered ml-2">
                <v-img
                  width="130"
                  height="130"
                  :aspect-ratio="1"
                  class="ma-1 avatar-img"
                  v-if="userData.user && userData.user.images.length > 0"
                  :src="
                    '/file/profile/' +
                    userData.user.id +
                    '/' +
                    userData.user.images[0].path
                  "
                ></v-img>
                <div v-else class="text-h5">
                  {{
                    userData && userData.fullname
                      ? printInitials(userData.fullname)
                      : userData.profile.fullname
                      ? printInitials(userData.profile.fullname)
                      : ""
                  }}
                </div>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title  class="my-1">{{
                  userData && userData.fullname
                    ? userData.fullname
                    : userData.profile.fullname
                    ? userData.profile.fullname
                    : ""
                }}</v-list-item-title> 
                <v-list-item-subtitle  class="my-1">{{
                  userData && userData.position
                    ? userData.position
                    : userData.profile
                    ? userData.profile.position
                    : ""
                }}</v-list-item-subtitle>
                 <v-list-item-subtitle v-if="userData.position !=='Chairman'" class="my-1">Department: {{
                  userData && userData.department && userData.department.length > 0
                    ? userData.department[0] 
                    : ""
                }}</v-list-item-subtitle>
                <v-list-item-subtitle v-if="userData.position !=='Chairman'" class="my-1">Email: {{
                  userData && userData.user
                    ? userData.user.email : ""
                }}</v-list-item-subtitle>
               
                 <v-list-item-subtitle v-if="userData.position !=='Chairman'" class="my-1">Date Joined: {{
                  userData && userData.date_joining
                    ? formatDateHelperString(userData.date_joining)
                    : userData.profile
                    ? formatDateHelperString(userData.profile.date_joining)
                    : ""
                }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>      
    </div>
  </div>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      default: null,
    },
    colleague: {
      type: Boolean,
      default: false,
    },
    sizes: {
      type: Number,
      default: 30,
    },
    meta: {
      type: Object,
      default: () => ({
        status: false,
        post_date: "date",
      }),
    },
  },
  data() {
    return {
      isAdminArray: ["superadmin", "admin", "moderator"],
      userData: this.user ? this.user : null,
    };
  },
  computed: {
    isAdmin() {
      return this.isAdminArray.includes(this.userData.role);
    },
  },
};
</script>
