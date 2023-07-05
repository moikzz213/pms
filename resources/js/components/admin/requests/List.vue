<template>
  <div>
    <v-app-bar color="white" dense class="elevation-0 mt-10">
      <v-toolbar-title class="overline">My Requests</v-toolbar-title>
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
              <v-col>
                <v-btn small to="/d/admin/requests/new" class="secondary">New Request</v-btn>
              </v-col>
              <v-spacer></v-spacer>
              <v-col class="col-md-5 col-sm-12 d-flex">
                <v-autocomplete :items="statusList" clearable v-model="dataFilter.status" dense outlined hide-details
                  label="Status" class="mt-0 col-md-4 mr-3"></v-autocomplete>
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
            <v-simple-table id="page-invoices">
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
                  <tr v-for="(item, index) in items" :key="item.id" >
                    <td>{{ pageStart + index }}</td>
                    <td :class="`${item.status} view-detail`" @click="routeLocation(item)">{{ cleanStatus(item.status) }}</td>
                    <td>{{ item.prf_no }}</td>
                    <td>{{ item.company ? item.company.title : '' }}</td>
                    <td>{{ item.profile ? item.profile.name : '' }}</td>
                    <td>{{ item.process_by ? item.process_by.name : '' }}</td>
                    <td>{{ item.subject }}</td>
                    <td>{{ item.urgency }}</td>
                    <td>{{ formatDateHelper(item.created_at) }}</td>
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
  </div>
</template>

<script>
export default {
  data() {
    return {
      localStorage: localStorage,
      pageLoading: true,
      page: 1,
      dataFilter: { status: '-', search: '-' },
      pageCount: 0,
      origPageCount: 0,
      loaderOptions: {},
      statusList: ['pending', 'onprocess', 'onhold', 'cancelled', 'closed'],
      totalData: 0,
      origTotalData: 0,
      showPerPage: 10,
      origCnt: 0,
      items: [],
      orderBy: [],
      orderByCount: 0,
      pageStart: 1,
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
    async getAllData(page, sort = null) {

      let response = "";
      if(sort.length == 0){
        sort = '-';
      }
      
      let controller = '';
      if (this.dataFilter.search) {
        controller = "/d/admin/request/fetch/" + this.dataFilter.search + "/-/" +
          sort +
          "?page=" +
          page;
      } else {        
        controller =
          "/d/admin/request/fetch/-/" + this.dataFilter.status + "/" +
          sort +
          "?page=" +
          page;
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
      let sort = "-";
      let stats = this.dataFilter.status ? this.dataFilter.status : '-';

      let controller = '';
      if (this.dataFilter.search) {
        this.dataFilter.search = this.dataFilter.search.replace(/\\/g, "");
        this.localStorage.setItem("vrequests", this.dataFilter.search);
        controller = "/d/admin/request/fetch/" + this.dataFilter.search + "/-/" +
          sort +
          "?page=1";

      } else {
    
        controller =
          "/d/admin/request/fetch/-/" + stats + "/" +
          sort +
          "?page=1";
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
      this.$router.push("/d/admin/requests/page/" + this.page).catch((err) => { });
    },

    clearSearch: function (v) {
      this.localStorage.setItem("vrequests", "");
      this.dataFilter.search = "";
      if (this.$route.params.page) {
        this.getAllData(this.$route.params.page,'-');
      } else {
        this.getAllData(1,'-');
      }
    },

    routeLocation(obj) {
      this.$router.push({
        name: "EditRequest",
        params: { id: obj.id },
      });
    },
  },
  created() {
    this.dataFilter.search = this.localStorage.getItem("vrequests");
    if (this.$route.params.page) {

      this.getAllData(this.$route.params.page, '-').then(() => {
        this.pageLoading = false;
      });
    } else {
      this.getAllData(this.page, '-').then(() => {
        this.pageLoading = false;
      });
    }
  },
  watch: {
    $route(to, from) {
      this.getAllData(this.$route.params.page ? this.$route.params.page : 1, this.orderBy);
    },
  },
};
</script>
