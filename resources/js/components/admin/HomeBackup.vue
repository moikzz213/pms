<template>
  <v-main class="grey lighten-3 mt-5 px-3">
    <v-container class="py-8" v-if="pageLoading == true">
      <v-row>
        <v-col cols="12">
          <v-skeleton-loader
            class="mx-auto"
            max-width="100%"
            type="list-item-avatar-three-line, image, article"
          ></v-skeleton-loader>
        </v-col>
      </v-row>
    </v-container>

    <v-container v-else style="width: 100%; max-width: 1366px" class="mx-auto">
      <v-row>
        <v-col cols="12" sm="12" md="3">
          <!-- fixed-position -->
          <v-sheet rounded="lg" min-height="268" class="">
            <navigation-left></navigation-left>
          </v-sheet>
        </v-col>

        <v-col cols="12" md="6" sm="12">
          <v-sheet
            v-for="(item, index) in items"
            :key="item.id"
            class="mx-auto py-3 px-6 main-content"
            rounded="lg"
          >
            <div class="d-flex align-center justify-space-between mb-3">
              <div class="text-h6">
                {{ item.title }}
              </div>
              <v-chip small>{{ typepost[item.type] }}</v-chip>
              <small
                v-if="
                  item.events && (item.type == 'event' || item.type == 'poll')
                "
                :class="`${
                  timestampConvert(item.events.date_end) <
                  timestampConvert(currentData)
                    ? 'red--text'
                    : ''
                } date-event`"
                >Event date:
                {{
                  item.events ? formatDateHelper(item.events.date_start) : ""
                }}
                -
                {{
                  item.events ? formatDateHelper(item.events.date_end) : ""
                }}</small
              >
            </div>
            <div v-if="item.images && item.images[0]" class="feature-image">
              <v-img
                :src="`${$baseUrl + '/file/' + item.images[0].path}`"
              ></v-img>
            </div>

            <div class="section-content text-caption">
              <!-- v-html="item.content" -->
              <!-- <div
                ref="infoBox"
                :style="`${
                  item.id === fullView
                    ? 'max-height:' + maxHeight + '; overflow:' + overflow
                    : 'max-height:300px;overflow:hidden'
                }`"
              >
                <ContentRender :content-data="item.content" />
              </div> -->

              <div
                v-if="
                  item.type == 'poll' &&
                  item.poll_choices &&
                  item.poll_choices.length > 0 &&
                  timestampConvert(item.events.date_end) >=
                    timestampConvert(currentData) &&
                  item.poll_answer &&
                  item.poll_answer.length == 0
                "
              >
                <v-divider></v-divider>
                <v-radio-group
                  :disabled="
                    pollAnswerObj[index] && pollAnswerObj[index].length > 0
                  "
                  v-model="poll_choices_answer[(item, index)]"
                  @change="handleRadioChoice(index)"
                  dense
                >
                  <v-radio
                    dense
                    v-for="choice in item.poll_choices"
                    :key="choice.id"
                    :label="choice.content"
                    :value="choice.id"
                  ></v-radio>
                </v-radio-group>
                <v-text-field
                  v-if="item.poll_textbox_enabled == 1"
                  outlined
                  v-model="pollAnswerObj[index]"
                  clear-icon="mdi-close-circle"
                  clearable
                  dense
                  class="poll-answer-textbox"
                  @keyup="handleCustomHander(index)"
                  label="Your suggestion/answer?"
                  type="text"
                  @click:clear="clearPollAnswer(index)"
                  v-on:keyup.enter="submitPollChoice(item, index)"
                ></v-text-field>
                <v-btn
                  @click="submitPollChoice(item, index)"
                  dense
                  x-small
                  color="primary"
                  :disabled="!hasValue[index]"
                  :loading="loading"
                  >Submit</v-btn
                >
              </div>
              <div v-else-if="item.poll_answer && item.poll_answer.length > 0">
                <v-btn class="mx-2" fab dark x-small color="success">
                  <v-icon dark> mdi-hand-okay </v-icon>
                </v-btn>
              </div>
            </div>
            <div class="view-more-message">
              <v-icon color="blue darken-2" @click="viewMessage(item.id)">{{
                item.id === fullView ? iconToggle : "mdi-inbox-arrow-down"
              }}</v-icon>
            </div>
            <v-divider></v-divider>
            <div class="section-like d-flex">
              <div>
                <v-btn small text @click="handleLike(item, index)"
                  ><v-icon small>{{
                    item.likes && item.likes.length > 0
                      ? likeIcon[1]
                      : likeIcon[0]
                  }}</v-icon
                  ><span v-if="item.likes_count > 0" class="font-weight-bold"
                    >({{ item.likes_count }})</span
                  ></v-btn
                >
                |
                <v-btn small text
                  >comment(<span class="font-weight-bold">{{
                    item.comments.length
                  }}</span
                  >)</v-btn
                >
              </div>
              <v-spacer></v-spacer>
              <div class="post-datetime">
                {{ formatDateHelper(item.created_at) }}
              </div>
            </div>
            <v-divider></v-divider>
            <div class="section-comment">
              <v-text-field
                v-model="message[index]"
                :append-outer-icon="message[index] ? 'mdi-send' : ''"
                outlined
                clear-icon="mdi-close-circle"
                clearable
                dense
                label="Enter your comment..."
                type="text"
                v-on:keyup.enter="sendMessage(item, index)"
                @click:append-outer="sendMessage(item, index)"
                @click:clear="clearMessage(index)"
              ></v-text-field>
            </div>
          </v-sheet>

          <div v-if="items && items.length == 0" class="text-center py-5">
            No result found.
          </div>
          <div v-else-if="dataLoaded" class="text-center py-5">
            All posts has been loaded.
          </div>
        </v-col>

        <v-col cols="12" sm="12" md="3">
          <!--  -->
          <v-sheet rounded="lg" min-height="268" class="">
            <navigation-right></navigation-right>
          </v-sheet>
        </v-col>
      </v-row>
    </v-container>
    <snack-bar :snackbar-options="sbOptions"></snack-bar>
  </v-main>
</template>

<script>
import ContentRender from "../admin/ui/content/render/ContentRender.vue";
import NavigationLeft from "./ui/navigation/NavigationLeft";
import NavigationRight from "./ui/navigation/NavigationRight";
export default {
  components: {
    NavigationLeft,
    NavigationRight,
    ContentRender,
  },
  data() {
    return {
      likeIcon: ["mdi-thumb-up-outline", "mdi-thumb-up"],
      sbOptions: {},
      message: [],
      pageLoading: true,
      loading: false,
      page: 1,
      dataCount: 0,
      showPerPage: 3,
      items: [],
      dataLoaded: false,
      maxHeight: "",
      overflow: "",
      fullView: "",
      iconToggle: "mdi-inbox-arrow-down",
      isIconClicked: 0,
      lastIDViewd: "",
      poll_choices_answer: [],
      hasValue: [],
      pollAnswerObj: [],
      refreshOnly: [],
      typepost: {
        post: "News & Article",
        event: "Event",
        poll: "Polls",
        training: "Training",
      },
      currentData: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
    };
  },

  methods: {
    handleLike: function (item, index) {
      let nlike = 1;
      if (item.likes && item.likes.length > 0 && item.likes[0].is_like == 0) {
        nlike = 1;
      } else if (
        item.likes &&
        item.likes.length > 0 &&
        item.likes[0].is_like == 1
      ) {
        nlike = 0;
      }
      let ndata = { post_id: item.id, is_like: nlike };
      axios.post("/d/home/post-like/form", ndata).then((response) => {
        this.refreshOnly = item;
        setTimeout(() => {
          this.page = item.curPage;
          this.getAllData();
        }, 800);
      });
    },
    handleRadioChoice: function (index) {
      this.hasValue[index] = true;
    },
    clearPollAnswer: function (index) {
      this.hasValue[index] = false;
    },
    handleCustomHander: function (index) {
      this.poll_choices_answer[index] = [];

      if (this.pollAnswerObj[index] && this.pollAnswerObj[index].length >= 2) {
        this.hasValue[index] = true;
      } else if (
        this.pollAnswerObj[index] &&
        this.pollAnswerObj[index].length > 0
      ) {
        this.hasValue[index] = true;
      } else {
        this.hasValue[index] = false;
      }
    },
    submitPollChoice: function (item, index) {
      this.loading = true;
      let ndata = {};

      if (this.pollAnswerObj[index]) {
        ndata = {
          data: { post_id: item.id, content: this.pollAnswerObj[index] },
        };
      } else if (
        this.poll_choices_answer[index] &&
        typeof this.poll_choices_answer[index] == "number"
      ) {
        ndata = {
          data: {
            post_id: item.id,
            poll_choice_id: this.poll_choices_answer[index],
          },
        };
      } else {
        this.sbOptions = {
          status: true,
          type: "error",
          text: "Failed to submit your poll! select something!",
        };
        this.loading = false;
        return;
      }

      axios.post("/d/home/poll-answer/form", ndata).then((response) => {
        this.sbOptions = {
          status: true,
          type: "success",
          text: "Poll has been submitted",
        };
        this.refreshOnly = item;
        setTimeout(() => {
          this.page = item.curPage;
          this.getAllData();
        }, 800);
      });
    },
    onScroll() {
      window.onscroll = () => {
        let bottomOfWindow =
          Math.max(
            window.pageYOffset,
            document.documentElement.scrollTop,
            document.body.scrollTop
          ) +
            window.innerHeight ===
          document.documentElement.offsetHeight;

        // check if already at the bottom and all post not loaded
        if (bottomOfWindow && !this.dataLoaded) {
          // load more post
          this.loadMoreImage();
        }
      };
    },
    sendMessage: function (item, index) {
      let ndata = {};
      if (!this.message[index]) {
        return;
      }
      ndata = {
        data: { post_id: item.id, content: this.message[index] },
      };

      axios.post("/d/home/post-comment/form", ndata).then((response) => {
        if (response && response.status == 200) {
          this.sbOptions = {
            status: true,
            type: "success",
            text: response.data.message,
          };
          this.refreshOnly = item;
          this.page = item.curPage;
          this.message[index] = "";
          setTimeout(() => {
            this.getAllData();
          }, 500);
        }
      });
      //this.message[index] = "";
    },
    clearMessage: function (index) {
      this.message[index] = "";
    },

    viewMessage: function (item) {
      if (this.lastIDViewd !== item) {
        this.isIconClicked = 0;
      }
      if (this.isIconClicked == 1) {
        this.iconToggle = "mdi-inbox-arrow-down-outline";
        this.maxHeight = "300px";
        this.overflow = "hidden";
      } else {
        this.iconToggle = "mdi-inbox-arrow-up-outline";
        this.maxHeight = "100%";
        this.overflow = "auto";
        this.isIconClicked = 0;
        this.lastIDViewd = item;
      }
      this.isIconClicked++;

      this.fullView = item;
    },

    async getAllData() {
      let orderby = ["updated_at", "desc"];
      let sort = orderby.toString();

      await axios
        .get(
          "/d/admin/posts-frontend/" +
            this.showPerPage +
            "/-/" +
            sort +
            "/?page=" +
            this.page
        )
        .then((response) => {
          if (response.data && response.data.data.length > 0) {
            response.data.data.forEach((i) => {
              if (i.content.includes("oembed")) {
                let newContent = i.content
                  .replace(/<figure[^>]*>/g, '<div class="media">')
                  .replace(/<\/figure>/g, "</div>")
                  .replace(
                    /<oembed/,
                    '<iframe width="560" height="300" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen'
                  )
                  .replace(/url/g, "src")
                  .replace(/<\/oembed>/g, "</iframe>");
                i.content = newContent;
              }

              var exists = this.items.some(function (field) {
                return field.id === i.id;
              });

              if (!exists) {
                this.items.push(i);
              }

              this.items.map((o, ii) => {
                if (!o.curPage) {
                  o.curPage = response.data.current_page;
                }
                if (o.id == this.refreshOnly.id && o.id == i.id) {
                  this.items.splice(ii, 1);
                  this.items.splice(ii, 0, i);
                }
              });
            });
          } else {
            this.dataLoaded = true;
          }

          this.loading = false;
        });
    },

    loadMoreImage: function () {
      this.page++;
      this.getAllData();
    },
  },

  mounted() {
    this.getAllData().then(() => {
      this.pageLoading = false;
      this.onScroll();
    });
  },
};
</script>
