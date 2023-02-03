<template>
  <v-navigation-drawer
    fixed
    permanent
    right
    class="mt-header hive-side-drawer hive-scroll-style"
  >
    <v-card v-if="loadingComponent == true" class="elevation-0">
      <v-skeleton-loader
        v-for="n in 5"
        :key="n"
        class="mx-auto"
        max-width="100%"
        type="list-item-three-line"
      ></v-skeleton-loader>
    </v-card>
    <div v-else class="px-5 py-5" style="height: 100%">
      <div>
        <v-carousel
          v-if="listHightlight && listHightlight.length > 0"
          class="pt-8"
          interval="10000"
          cycle
          height="150"
          :show-arrows-on-hover="true"
          :hide-delimiters="true"
        >
          <div v-for="item in listHightlight" :key="item.id">
            <v-carousel-item
              v-for="(img, i) in item.images"
              :key="i"
              :src="`${$baseUrl + '/file/' + item.images[0].path}`"
              reverse-transition="fade-transition"
              transition="fade-transition"
              show-arrows="false"
              cover
            >
              <div
                class="
                  text-caption
                  highlight-title
                  text-center text-uppercase
                  font-weight-bold
                  mb-1
                "
              >
                {{ item.title }}
              </div>
              <div
                class="
                  text-caption
                  highlight-content
                  text-center
                  font-weight-bold
                  mb-1
                "
              >
                {{ item.content }}
              </div>
            </v-carousel-item>
          </div>
        </v-carousel>

        <v-divider class="my-3"></v-divider>
      </div>
      <div class="mb-3 d-flex flex-column">
        <div
          class="
            text-caption text-uppercase
            justify-space-between
            d-flex
            font-weight-bold
            mb-1
          "
        >
          TODAY'S BIRTHDAY
          <h1>{{ todayDate }}</h1>
        </div>
        <!-- nav-right -->
        <v-list
          class="hive-container-birthday hive-scroll-style overflow-y-auto"
          dense
          v-if="birthdays.length > 0"
        >
          <v-list-item class="pl-1" v-for="item in birthdays" :key="item.name">
            <v-list-item-action class="mr-3">
              <v-icon small color="red">{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content
              @click="greetThem(item)"
              class="black--text cursor-pointer"
            >
              <v-btn
                small
                @click="openTeams(item.email)"
                :class="`light-blue darken-4 ${
                  isClick == item.id ? 'show-teams' : 'greet-team'
                }`"
                dark
                ><v-icon dark>mdi-microsoft-teams</v-icon></v-btn
              >
              <v-list-item-title>{{ item.name }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <h5 v-else class="mt-2 mb-4">No celebrant today.</h5>
        <v-divider class="mb-3 mt-auto"></v-divider>
      </div>
      <div class="mb-3">
        <div class="text-caption text-uppercase font-weight-bold mb-1">
          NEW JOINERS
        </div>
        <v-list
          class="hive-container-new-joiners hive-scroll-style overflow-y-auto"
          dense
          v-if="joiners"
        >
          <v-list-item class="pl-1" v-for="item in joiners" :key="item.name">
            <v-list-item-action class="mr-5">
              <h3>{{ item.day }}</h3>
              <h6>{{ item.month }}</h6>
            </v-list-item-action>
            <v-list-item-content class="black--text">
              <v-list-item-title class="text-capitalize font-weight-bold">{{
                item.name
              }}</v-list-item-title>
              <div class="text-uppercase job-position">{{ item.company }}</div>
              <div class="text-uppercase job-position">{{ item.position }}</div>
            </v-list-item-content>
          </v-list-item>
        </v-list>
        <v-divider class="my-3"></v-divider>
      </div>
    </div>
  </v-navigation-drawer>
</template>

<script>
export default {
  data() {
    return {
      todayDate: new Date().toLocaleString("en-US", {
        day: "2-digit",
        month: "short",
      }),
      loadingComponent: true,
      listHightlight: [],
      birthdays: [],
      joiners: [],
      isClick: false,
    };
  },
  methods: {
    fetchHighlights: async function () {
      await axios
        .get("/d/admin/fetch/non-paginate/highlights")
        .then((response) => {
          this.listHightlight = response.data;
        });
    },

    greetThem: function (v) {
      this.isClick = v.id;
    },

    openTeams: function (v) {
      
      if (v) {
        window.open(
          "https://teams.microsoft.com/l/chat/0/0?users=" + v,
          "_blank"
        );
      } 
    },

    fetchTodayBirthday: async function () {
      await axios.get("/d/admin/fetch/today/birthday").then((response) => {
        let getBirthdays = [];
        if (response.data) {
          response.data.map((o, i) => {
            getBirthdays[i] = {
              name: o.fullname,
              icon: "mdi-cake",
              id: o.id,
              email: o.user ? o.user.email : "",
            };
          });
        }
        this.birthdays = getBirthdays;
      });
    },

    fetchRecentJoiners: async function () {
      await axios.get("/d/admin/fetch/recent/joiners").then((response) => {
        let getJoiners = [];

        if (response.data) {
          response.data.map((o, i) => {
            let dateJoin = this.formatDayMonthDate(o.date_joining).split(" ");

            getJoiners[i] = {
              name: o.fullname,
              company: o.company ? o.company.title : "",
              day: dateJoin[0],
              month: dateJoin[1],
              position: o.position,
            };
          });
        }
        this.joiners = getJoiners;
      });
    },
  },
  created() {
    setTimeout(() => {
      this.loadingComponent = false;
      this.fetchHighlights().then(() => {
        this.fetchTodayBirthday().then(() => {
          this.fetchRecentJoiners();
        });
      });
    }, 300);
  },
};
</script>

<style>
/* .hive-container-highlights {
  height: calc(20vh - 40px);
} */
.hive-container-birthday {
  height: calc(30vh - 40px - 60px);
}
.hive-container-new-joiners {
  height: calc(50vh - 40px - 60px);
}
</style>
