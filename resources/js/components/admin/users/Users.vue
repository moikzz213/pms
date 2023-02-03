<template>
  <div>
    <v-app-bar color="white" dense class="elevation-0">
      <v-toolbar-title class="overline">Users</v-toolbar-title>
    </v-app-bar>
    <v-container class="py-8"  v-if="pageLoading == true">
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
       
      <v-container v-else class="mb-3 mx-auto" style="max-width: 1366px">
      <!-- content here -->
      <v-row class="mt-2"> 
          <v-col cols="12" class="py-0">
          <v-btn small to="/d/admin/users/new" class="secondary mb-5">New User</v-btn>
          <v-btn small to="/d/admin/imports" class="primary mb-5">Import Bulk</v-btn>
        </v-col>
        <v-col class="col-md-12 mt-1 col-sm-12">
          <v-card class="px-5">
            <v-row>
              <v-col class="col-12 col-md-3 col-sm-12 d-flex">
                <div class="mt-2 mr-2">Show</div>
                <v-autocomplete
                  :items="showRows"
                  v-model="showPerPage"
                  @change="filterRows"
                  dense
                  outlined
                  hide-details
                  label="Entry"
                  class="mt-0 col-md-4 mr-3"
                ></v-autocomplete>
               
              </v-col>
             
              <v-spacer></v-spacer>
              <v-col class="col-12 col-md-3 col-sm-12">
                <v-text-field
                  v-model="search"
                  append-outer-icon="mdi-magnify"
                  outlined
                  dense
                  clear-icon="mdi-close-circle"
                  clearable
                  label="Search"
                  type="text"
                  hide-details
                  @click:append-outer="searchData"
                  @keydown.enter="searchData"
                  @click:clear="clearSearch('search')"
                ></v-text-field>
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
                    <th class="text-left cursor-pointer" @click="OrderByField('profiles.name')">Full Name</th>
                    <th class="text-left cursor-pointer" @click="OrderByField('profiles.ecode')">eCode</th> 
                    <th class="text-left cursor-pointer" @click="OrderByField('profiles.designation')">Designation</th> 
                    <th class="text-left cursor-pointer" @click="OrderByField('profiles.company_id')">Company</th> 
                    <th class="text-left cursor-pointer" @click="OrderByField('profiles.department_id')">Department</th> 
                    <th class="text-left cursor-pointer" >Contact No.</th> 
                    <th class="text-left cursor-pointer" @click="OrderByField('status')">Status</th> 
                    <th> Action </th>
                  </tr>
                </thead>
                <tbody v-if="Object.keys(items).length > 0">
                  <tr v-for="(item, index) in items" :key="index">
                    <td >{{ item.name ? item.name : item.profile ? item.profile.name : '' }}</td> 
                    <td >{{ item.email ? item.email : item.profile ? item.profile.email : '' }}</td>
                    <td >{{ item.designation ? item.designation : item.profile ? item.profile.designation : '' }}</td>
                    <td >{{ item.company ? item.company : item.profile && item.profile.company ? item.profile.company.title : '' }} </td> 
                    <td >{{ item.department ? item.department : item.profile  && item.profile.department ? item.profile.department.title : '' }}</td> 
                    <td >{{ item.contact_no ? item.contact_no : item.profile ? item.profile.contact_no : '' }}</td>
                      <td >
                    <v-chip
                  :class="`${ item.status == 'active' ? 'success' : item.status == 'disabled' ? 'error' : 'grey' }`"
                  >{{ item.status == 'active' ? 'Active' : item.status == 'disabled' ? 'Disabled' : 'Trashed' }}</v-chip
                >
                    </td>
                    <td>
                       <v-btn
                  fab
                  x-small
                  depressed
                  @click="editData(item)"
                  class="transparent mr-1"
                >
                  <v-icon small> mdi-pencil </v-icon>
                </v-btn>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
            <div
              v-if="Object.keys(items).length == 0"
              class="text-center caption text-capitalize py-3"
            >
              Result Not Found
            </div>
          </v-card>
          <div class="d-flex">
            <div class="col-3 pt-7">Total: {{ totalData }}</div>
            <div class="col-6">
              <v-pagination
                v-if="pageCount > 1"
                class="mt-3"
                v-model="page"
                :length="pageCount"
                @input="onPageChange"
                :total-visible="8"
                :items-per-page="showPerPage"
              ></v-pagination>
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
      pageCount: 0,
      origPageCount: 0,
      loaderOptions: {},
       showRows: [10, 50, 100],
       totalData: 0,
      origTotalData: 0,
      showPerPage: 10,
      origCnt: 0,
      search: "",
      orderBy: [],
      orderByCount: 0,
      items: [],
    };
  },
  methods: {
    OrderByField: function (v) {
      this.orderBy[0] = v;
      if (this.orderByCount % 2) {
        this.orderBy[1] = "DESC";
      } else {
        this.orderBy[1] = "ASC";
      }
      this.orderByCount++;

      this.getAllData(this.page, this.orderBy);
    },
    async getAllData(page, orderby = null) {
      let response = "";
      let sort = "";
      let shows = "&shows="+this.showPerPage;
      if (orderby && orderby.length > 0) {
        sort = "&sort="+orderby.toString();
      }

       if (this.search) {
        response = await axios.get(
          "/d/admin/users/fetch-all/" +  
            this.search +"/?page=" +
            page + shows+sort
        );
      } else {
        response = await axios.get(
          "/d/admin/users/fetch-all/" + 
            "-/?page=" +
            page + shows+sort
        );
      }
     
      if(response.data){ 
        this.items = Object.assign([], response.data.data);
         console.log(this.items);
        this.page = response.data.current_page;
        this.pageCount = response.data.last_page;
        this.totalData = response.data.total;
      } 
    },

    searchData: async function () {
      this.loaderOptions = {
        status: true,
        text: "Please wait...",
      };
      if (this.search) {
        this.localStorage.setItem("vusers", this.search); 
      }  

      if (
        (this.search && this.search.length > 2)  
      ) {
     
      let shows = "&shows="+this.showPerPage; 
        
        await axios.get(
          "/d/admin/users/fetch-all/" +  
            this.search +"/?page=1" + shows
        ).then((res) => {
           
            this.items = res.data.data; 
            this.page = res.data.current_page;
            this.pageCount = res.data.last_page;
            this.totalData = res.data.total;
            setTimeout(() => {
              this.loaderOptions.status = false;
            }, 800);
          });
      } else if (
        !this.search  
      ) {
        this.items = this.originalData;
        this.totalData = this.origTotalData;
        this.pageCount = parseInt(this.origPageCount);
        this.loaderOptions.status = false;
      }
    },

     onPageChange: function () {
      this.$router
        .push(
          "/d/admin/users/page/" + this.page
        )
        .catch((err) => {});
    },

    clearSearch: function (v) { 
       this.localStorage.setItem("vusers", "");
      this.search = "";
        if (this.$route.params.page) {
            this.getAllData(this.$route.params.page);
        } else {
            this.getAllData(1);
        } 
    },

    filterRows: function () {
       this.loaderOptions = {
        status: true,
        text: "Please wait...",
      };
      this.getAllData(1).then(() => { 
           this.loaderOptions = false;  
        });

     
    },
    editData(obj) { 
      this.$router.push({
        name: "EditUser",
        params: { id: obj.id },
      });
    },
  },
  created() { 
    
     this.search = this.localStorage.getItem("vusers");
    if (this.$route.params.page) {
      this.getAllData(this.$route.params.page).then(() => { 
           this.pageLoading = false;  
        });
    } else {
      this.getAllData(1).then(() => { 
           this.pageLoading = false;  
      });
    }
  },
  watch: {
    $route(to, from) {
      this.getAllData(this.$route.params.page,this.orderBy);
    },
  },
};
</script>
