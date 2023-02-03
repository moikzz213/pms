<template>
  <div>
    <notification-form
      :objectdata="objectData"
      :pagetitle="'edit'"
      @saved="savedResponse"
    ></notification-form>
  </div>
</template>

<script>
import notificationForm from "./NotificationForm";
export default {
  components: { notificationForm },
  data() {
    return {
      objectData: {},
    };
  },
  methods: {
    getData() {
      axios
        .get("/d/admin/notification/get/" + this.$route.params.id)
        .then((response) => {
          console.log(response.data);
          this.objectData = Object.assign({}, response.data);
        })
        .catch((err) => {});
    },
    savedResponse() {
      this.getData();
    },
  },
  mounted() {
    this.getData();
  },
};
</script>