<template>
  <div>
    <department-form
      :objectdata="objectData"
      :pagetitle="'edit'"
      @saved="savedResponse"
    ></department-form>
  </div>
</template>

<script>
import DepartmentForm from "./DepartmentForm.vue";

export default {
  components: { DepartmentForm },
  data() {
    return { 
      objectData: {},
    };
  },
  methods: { 
    async getData() {
      await axios
        .get("/d/admin/departments/fetch/" + this.$route.params.id)
        .then((response) => {
          this.objectData = Object.assign({}, response.data); 
        })
        .catch((err) => {});
    },
    savedResponse(value) { 
      if (value == true) {
        this.getData();
      }
    },
  },
  mounted() {
    this.getData();
  },
};
</script>

<style>
</style>
