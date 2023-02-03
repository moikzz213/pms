<template>
  <div>
    <category-form
      :objectdata="objectData"
      :pagetitle="'edit'"
      @saved="savedResponse"
    ></category-form>
  </div>
</template>

<script>
import CategoryForm from "./CategoryForm.vue";

export default {
  components: { CategoryForm },
  data() {
    return { 
      objectData: {},
    };
  },
  methods: { 
    async getData() {
      await axios
        .get("/d/admin/categories/fetch/" + this.$route.params.id)
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
