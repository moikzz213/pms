<template>
  <div>
    <v-app-bar color="white" dense class="elevation-0 mt-10 no-print">
      <v-toolbar-title class="overline">Employee Requests</v-toolbar-title>
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
        <v-col cols="12" class="py-0 no-print">

        </v-col>
        <v-col class="col-md-12 mt-1 col-sm-12 no-print">
          <v-card class="px-5">
            <v-row>
              <v-col class="col-md-12 col-sm-12 d-flex">
                <v-autocomplete :items="companies" @click:clear="clearFilter('company')" clearable v-model="dataFilter.company_id" dense
                  outlined hide-details label="Company" class="mt-0 mr-3" item-value="id"
                  item-text="title"></v-autocomplete>

                <v-autocomplete :items="statusList" clearable v-model="dataFilter.status" @click:clear="clearFilter('status')" dense outlined hide-details
                  label="Status" class="mt-0  mr-3"></v-autocomplete>

                <v-autocomplete :items="procteam" clearable v-model="dataFilter.process_by" @click:clear="clearFilter('process')" dense outlined
                  hide-details label="Processed By" class="mt-0 mr-3" item-value="id" item-text="profile.name"></v-autocomplete>

                <v-autocomplete :items="profiles" clearable v-model="dataFilter.user_id" dense @click:clear="clearFilter('request')"
                  outlined hide-details label="Requested By" class="mt-0 mr-3" item-value="id"
                  item-text="name"></v-autocomplete>

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
                    <th class="text-left cursor-pointer" @click="OrderByField('prf_no')">
                      PRF NO.
                    </th>
                    <th class="text-left cursor-pointer" @click="OrderByField('company_id')">
                      Business Unit
                    </th>
                    <th class="text-left cursor-pointer" @click="OrderByField('user_id')">
                      Rqsted By
                    </th>
                    <th class="text-left cursor-pointer" @click="OrderByField('process_by')">
                      Processed By
                    </th>
                    <th class="text-left cursor-pointer" @click="OrderByField('subject')">
                      Subject
                    </th>
                    <th class="text-left cursor-pointer" @click="OrderByField('urgency')">
                      Urgency
                    </th>
                    <th class="text-left cursor-pointer" @click="OrderByField('created_at')">
                      Rqsted Date
                    </th>
                  </tr>
                </thead>
                <tbody v-if="items && Object.keys(items).length > 0">
                  <tr v-for="(item, index) in items" :key="item.id">
                    <td>{{ pageStart + index }}</td>
                    <td :class="`${item.status} view-detail`" @click="routeLocation(item)">{{
                      cleanStatus(item.status)
                    }}</td>
                    <td>{{ item.prf_no }}</td>
                    <td>{{ item.company ? item.company.title : '' }}</td>
                    <td>{{ item.profile ? item.profile.name : '' }}</td>
                    <td> <v-autocomplete :items="procteam" 
                      v-model="item.process_by"
                        dense outlined hide-details
                        @change="assignTask(item)"
                        label="Assign To" item-value="id" item-text="profile.name">
                      </v-autocomplete>                     
                    </td>
                    <td>{{ item.subject }}</td>
                    <td>{{ item.urgency }}</td>
                    <td>{{ formatDateHelper(item.created_at) }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
            <div v-if="items && Object.keys(items).length == 0" class="text-center caption text-capitalize py-3 no-print">
              Result Not Found
            </div>
          </v-card>
          <div class="d-flex no-print" >
            <div class="col-3 pt-7 no-print">Total: {{ totalData }}</div>
            <div class="col-6 no-print">
              <v-pagination v-if="pageCount > 1" class="mt-3" v-model="page" :length="pageCount" @input="onPageChange"
                :total-visible="8" :items-per-page="showPerPage"></v-pagination>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
    <dialog-loader :loader-options="loaderOptions" class="no-print"></dialog-loader>
    <snack-bar :snackbar-options="sbOptions" class="no-print"></snack-bar>
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
      statusList: ['pending', 'onprocess', 'onhold', 'cancelled', 'closed'],
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
      filterLoaded: { comp: false, process: false, requested: false },
    };
  },
  computed: {
    companies() {
      return this.$store.state.companies.companyList;
    },

    profiles() {
      return this.$store.state.profiles.profileList;
    }, 
    procteam() {
      return this.$store.state.procteam.procTeam;
    }
  },
  methods: {
    assignTask: function(v){
      this.loaderOptions = {
        status: true,
        text: "Please wait...",
      };
      let nData = { id: v.id, process_by: v.process_by };
      console.log(nData);
      axios.post('/d/admin/request/procurement/assigned', nData).then((response) =>{
        if(response.data.status){
                this.sbOptions = {
                  status: true,
                  type: "success",
                  text: response.data.message,
                };
              setTimeout(() => {
                this.loaderOptions.status = false;
              }, 800);
        }
      }).catch((err) => { });
    },

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
        controller = "/d/admin/request/procurement-fetch/" + this.dataFilter.search + "?page=" + page + "&sort=" + sort;

      } else {
        let filteredSearch = null;
        if(filter){
          filteredSearch = filter;
        }else{
          filteredSearch = this.dataFilter;
        }
        console.log(this.dataFilter);
        let bdata = filteredSearch;
        let dataComp = '';
        let dataProcess = '';
        let dataRequest = '';
        let status = '';

        if (bdata && bdata.company_id) {
          dataComp = '&company_id=' + Number(bdata.company_id);
        }
        if (bdata && bdata.process_by) {
          dataProcess = '&process_by=' + Number(bdata.process_by);
        }
        if (bdata && bdata.user_id) {
          dataRequest = '&user_id=' + Number(bdata.user_id);
        }
        if (bdata && bdata.status) {
          status = '&status=' + bdata.status;
        }
        controller =
          "/d/admin/request/procurement-fetch/-?page=" + page + "&sort=" + sort + dataComp + dataProcess + dataRequest + status;
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
        this.dataFilter.search = this.dataFilter.search.replace(/\\/g, "");
        this.localStorage.setItem("procrequests", this.dataFilter.search);
        controller = "/d/admin/request/procurement-fetch/" + this.dataFilter.search + "?page=1&sort=" + sort;
      } else {
        let bdata = this.dataFilter;
        let dataComp = '';
        let dataProcess = '';
        let dataRequest = '';
        let status = '';
        
        if (bdata.company_id) {
          dataComp = '&company_id=' + bdata.company_id;
          this.localStorage.setItem("proccompany", Number(bdata.company_id));
        }
        if (bdata.process_by) {
          dataProcess = '&process_by=' + bdata.process_by;
          this.localStorage.setItem("procprocess", Number(bdata.process_by));
        }
        if (bdata.user_id) {
          dataRequest = '&user_id=' + bdata.user_id;
          this.localStorage.setItem("procrequestor", Number(bdata.user_id));
        }
        if (bdata.status) {
          status = '&status=' + bdata.status;
          this.localStorage.setItem("procstatus", bdata.status);
        }
        controller =
          "/d/admin/request/procurement-fetch/-?page=1&sort=" + sort + dataComp + dataProcess + dataRequest + status;
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
      this.$router.push("/d/admin/procurement-team/page/" + this.page).catch((err) => { });
    },
    clearFilter: function(v){
      console.log(v);
      if(v == 'company'){
        this.localStorage.setItem("proccompany", ""); 
      }else if(v == 'process'){
        this.localStorage.setItem("procprocess",""); 
      }else if(v == 'request'){
        this.localStorage.setItem("procrequestor",""); 
      }else if(v == 'status'){
        this.localStorage.setItem("procstatus",""); 
      } 
    },
    clearSearch: function (v) {
      this.localStorage.setItem("procrequests", "");
      this.dataFilter.search = "";
      if (this.$route.params.page) {
        this.getAllData(this.$route.params.page);
      } else {
        this.getAllData(1);
      }
    },

    routeLocation(obj) {
      this.$router.push({
        name: "viewRequest",
        params: { id: obj.id },
      });
    },

    fetchCompany: async function () {
      if(this.companies.length == 0){
        this.$store.dispatch("fetchCompanyList"); 
      }
    },
    fetchProcTeam: async function () {
      if(this.procteam.length == 0){
        this.$store.dispatch("fetchProcTeam"); 
      } 
    },

    fetchProfiles: async function () {
      if(this.profiles.length == 0){
        this.$store.dispatch("fetchProfileList"); 
      }
    },

  },
  created() {
    this.dataFilter.search = this.localStorage.getItem("procrequests");
    this.dataFilter.company_id = Number(this.localStorage.getItem("proccompany")); 
    this.dataFilter.process_by = Number(this.localStorage.getItem("procprocess")); 
    this.dataFilter.user_id = Number(this.localStorage.getItem("procrequestor")); 
    this.dataFilter.status = this.localStorage.getItem("procstatus"); 
    
    this.fetchCompany().then(() => {
      this.fetchProfiles().then(() => {
          this.fetchProcTeam().then(() => {
            if (this.$route.params.page) {
              this.getAllData(this.$route.params.page).then(() => {
                this.pageLoading = false;
              });
            } else {
              this.getAllData(this.page).then(() => {
                this.pageLoading = false;
              });
            }
          });
      });
    });
  },
  watch: {
    $route(to, from) {
      this.getAllData(this.$route.params.page ? this.$route.params.page : 1, this.orderBy, this.dataFilter);
    },
  },
};
</script>
<style>
tr td .v-select__slot label, tr td .v-select__slot input{ font-size: 12px;}
</style>