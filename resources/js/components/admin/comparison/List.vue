<template>
  <div>
    <v-app-bar color="white" dense class="elevation-0 mt-10">
      <v-toolbar-title class="overline">Comparisons</v-toolbar-title>
    </v-app-bar>
    <v-container class="py-8" v-if="pageLoading == true">
      <v-row>
        <v-col cols="12">
          <v-skeleton-loader class="mx-auto" max-width="100%"
            type="list-item-avatar-three-line, image, article"></v-skeleton-loader>
        </v-col>
      </v-row>
    </v-container>

    <v-container v-else class="mb-3 mx-auto" style="max-width: 1366px">
      <!-- content here -->
      <v-row class="mt-2">
        <v-col cols="12" class="py-0">

        </v-col>
        <v-col class="col-md-12 mt-1 col-sm-12">
          <v-card class="px-5">
            <v-row>
              <v-col class="col-md-12 col-sm-12 d-flex">
                <v-btn small to="/d/admin/comparisons/new" class="primary mr-3 my-auto">
                  <v-icon>mdi-plus</v-icon></v-btn>
                <v-autocomplete :items="companies" @click="fetchCompany" clearable v-model="dataFilter.company_id" dense
                  outlined hide-details label="Company" class="mt-0 mr-3" item-value="id"
                  item-text="title"></v-autocomplete> 

                <v-autocomplete :items="processedBy" @click="fetchProcTeam" clearable v-model="dataFilter.process_by" dense outlined
                  hide-details label="Processed By" class="mt-0 mr-3" item-value="id" item-text="name"></v-autocomplete>

                <v-autocomplete :items="statusList" clearable v-model="dataFilter.status" dense outlined hide-details
                  label="Status" class="mt-0  mr-3"></v-autocomplete>

                <v-text-field v-model="dataFilter.search" append-outer-icon="mdi-magnify" outlined dense
                  clear-icon="mdi-close-circle" clearable label="Search" type="text" hide-details
                  @click:append-outer="searchData" @keydown.enter="searchData"
                  @click:clear="clearSearch('search')"></v-text-field>
              </v-col>
            </v-row>
          </v-card>
        </v-col>

        <v-col class="col-md-12 col-sm-12">
          <v-card>
            <v-divider></v-divider>
            <v-simple-table id="page-procurement">
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">
                      #
                    </th>
                    <th class="text-left cursor-pointer" @click="OrderByField('status')">
                      Status
                    </th>
                   
                    <th class="text-left cursor-pointer" @click="OrderByField('company_id')">
                      Business Unit
                    </th>
                    <th class="text-left cursor-pointer" @click="OrderByField('supplier_id')">
                      Title
                    </th>
                   
                    <th class="text-left cursor-pointer" @click="OrderByField('process_by')">
                      Processed By
                    </th>
                    <th class="text-left cursor-pointer" @click="OrderByField('created_at')">
                      D.Created
                    </th>
                  </tr>
                </thead>
                <tbody v-if="items && Object.keys(items).length > 0">
                  <tr v-for="(item, index) in items" :key="item.id">
                   
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
            <div v-if="items && Object.keys(items).length == 0" class="text-center caption text-capitalize py-3">
              Result Not Found
            </div>
          </v-card>
          <div class="d-flex">
            <div class="col-3 pt-7">Total: {{ totalData }}</div>
            <div class="col-6">
              <v-pagination v-if="pageCount > 1" class="mt-3" v-model="page" :length="pageCount" @input="onPageChange"
                :total-visible="8" :items-per-page="showPerPage"></v-pagination>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
    <dialog-loader :loader-options="loaderOptions"></dialog-loader>
    <snack-bar :snackbar-options="sbOptions"></snack-bar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      localStorage: localStorage,
      pageLoading: true,
      page: 1,
      dataFilter: { search: '-' },
      pageCount: 0,
      origPageCount: 0,
      loaderOptions: {},
      sbOptions: {},
      statusList: [ 'onprocess', 'onhold', 'cancelled', 'closed'],
      companyList: {},
      processList: {},
      requestedList: {},
      totalData: 0,
      origTotalData: 0,
      showPerPage: 10,
      origCnt: 0,
      items: [],
      orderBy: ['updated_at', 'DESC'],
      orderByCount: 0,
      pageStart: 1,
      processedBy: [],
      companies: [],
      suppliers: [],
      filterLoaded: { comp: false, process: false },
    };
  },
  methods: {


    OrderByField: function (v) {
      this.loaderOptions = {
        status: true,
        text: "Please wait...",
      };
      this.orderBy[0] = v;
      if (this.orderByCount % 2) {
        this.orderBy[1] = "DESC";
      } else {
        this.orderBy[1] = "ASC";
      }
      this.orderByCount++;

      this.getAllData(this.page, this.orderBy);
    },
    async getAllData(page, sort = '', filter = null) {

      let response = "";

      let controller = '';
      if (this.dataFilter.search) {
        controller = "/d/admin/comparisons/fetch/" + this.dataFilter.search + "?page=1&sort=" + sort;

      } else {
        let bdata = filter;
        let dataComp = '';
        let dataProcess = '';
        let dataRequest = '';
        if (bdata && bdata.company_id) {
          dataComp = '&company_id=' + bdata.company_id;
        }
        if (bdata && bdata.process_by) {
          dataProcess = '&process_by=' + bdata.process_by;
        }
        
        controller =
          "/d/admin/comparisons/fetch/-?page=" + page + "&sort=" + sort + dataComp + dataProcess + dataRequest;
      }
      response = await axios.get(controller);
      this.loaderOptions.status = false;
      if (response.data) {
        this.items = Object.assign([], response.data.data);
        this.page = response.data.current_page;
        this.pageCount = response.data.last_page;
        this.totalData = response.data.total;
        this.pageStart = response.data.from;
      }
    },

    searchData: async function () {
      this.loaderOptions = {
        status: true,
        text: "Please wait...",
      };

      let response = "";
      let sort = "";

      let controller = '';
      if (this.dataFilter.search) {
        this.localStorage.setItem("vcomparison", this.dataFilter.search);
        controller = "/d/admin/comparisons/fetch/" + this.dataFilter.search + "?page=1&sort=" + sort;
      } else {
        let bdata = this.dataFilter;
        let dataComp = '';
        let dataProcess = '';
        let dataRequest = '';
        let status = '';
        if (bdata.company_id) {
          dataComp = '&company_id=' + bdata.company_id;
        }
        if (bdata.process_by) {
          dataProcess = '&process_by=' + bdata.process_by;
        }
        
        if (bdata.status) {
          status = '&status=' + bdata.status;
        }
        controller =
          "/d/admin/comparisons/fetch/-?page=1&sort=" + sort + dataComp + dataProcess + dataRequest + status;
      }
      response = await axios.get(controller);

      if (response.data) {
        this.items = Object.assign([], response.data.data);

        this.page = response.data.current_page;
        this.pageCount = response.data.last_page;
        this.totalData = response.data.total;
        this.loaderOptions.status = false;
      }
    },

    onPageChange: function () {
      this.$router.push("/d/admin/comparisons/page/" + this.page).catch((err) => { });
    },

    clearSearch: function (v) {
      this.localStorage.setItem("vcomparison", "");
      this.dataFilter.search = "";
      if (this.$route.params.page) {
        this.getAllData(this.$route.params.page);
      } else {
        this.getAllData(1);
      }
    },

    routeLocation(obj) {
      this.$router.push({
        name: "EditComparison",
        params: { id: obj.id },
      });
    },

    fetchCompany: async function () {
      if (!this.filterLoaded.comp) {
        this.filterLoaded.comp = true;
        await axios
          .get("/d/admin/fetch/non-paginate/companies")
          .then((response) => {
            this.companies = Object.assign([], response.data);
          });
      
      }
    }, 

    fetchProcTeam: async function () {
      if (!this.filterLoaded.process) {
        this.filterLoaded.process = true;
      await axios
        .get("/d/admin/profile/procurements/list")
        .then((response) => {
          let nData = Object.assign([], response.data);
          if (nData && nData.length > 0) {
            let getProfile = [];
            nData.map((o, i) => {
              getProfile[i] = o.profile;
            });
            this.processedBy = getProfile;
          }
        });

      
    }

},

  },
  created() {
    this.dataFilter.search = this.localStorage.getItem("vcomparison");
    
      if (this.$route.params.page) {
        this.getAllData(this.$route.params.page).then(() => {
          this.pageLoading = false;
        });
      } else {
        this.getAllData(this.page).then(() => {
          this.pageLoading = false;
        });
      }
    
  },
  watch: {
    $route(to, from) {
      this.getAllData(this.$route.params.page ? this.$route.params.page : 1, this.orderBy, this.dataFilter);
    },
  },
};
</script>