<template>
  <div>
    <data-form
      :posttype="'post'"
      :redirectedit="'EditLpo'"
      :newurl="'/d/admin/local-purchase-order/save'"
      :headertitle="'Create New Local Purchase Order (LPO)'"
    ></data-form>
  </div>
</template>

<script>
import dataForm from "./DataForm";
export default {
  components: { dataForm },
  data() {
    return {
      //   pagetitle: 'Create New' ,
    };
  },
};
</script>

<style>
</style>
