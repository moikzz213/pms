<template>
  <div>
    <v-app-bar color="white" dense class="elevation-0 mt-10">
      <v-toolbar-title class="overline">Dashboard</v-toolbar-title>
    </v-app-bar>
    <v-container class="py-8" style="max-width:1400px"> 
          <v-row>
            <div class="col-12 col-sm-6 col-xs-6 col-md-2">
              <v-card :loading="loading"> 
                <v-card-text class="text-center"> 
                 <div>TODAY'S <br/>REQUEST</div>
                 <h2 class="mt-4">{{objTotal.new }}</h2>
                </v-card-text>
              </v-card>
            </div>

            <div class="col-12 col-sm-6 col-xs-6 col-md-2">
              <v-card :loading="loading">
                <v-card-text class="text-center"> 
                  <div>OPEN <br/>REQUEST</div>
                  <h2 class="mt-4">{{objTotal.pending }}</h2>
                </v-card-text>
              </v-card>
            </div>

            <div class="col-12 col-sm-6 col-xs-6 col-md-2">
              <v-card :loading="loading">
                <v-card-text class="text-center"> 
                  <div>ONHOLD <br/>REQUEST</div>
                  <h2 class="mt-4">{{objTotal.hold }}</h2>
                </v-card-text>
              </v-card>
            </div>

            <div class="col-12 col-sm-6 col-xs-6 col-md-2">
              <v-card :loading="loading">
                <v-card-text class="text-center"> 
                  <div>ONPROCESS <br/>REQUEST</div>
                  <h2 class="mt-4">{{objTotal.process }}</h2>
                </v-card-text>
              </v-card>
            </div>
            <div class="col-12 col-sm-6 col-xs-6 col-md-2">
              <v-card :loading="loading">
                <v-card-text class="text-center"> 
                  <div>CLOSED <br/>REQUEST</div>
                  <h2 class="mt-4">{{objTotal.closed }}</h2>
                </v-card-text>
              </v-card>
            </div>
            <div class="col-12 col-sm-6 col-xs-6 col-md-2">
              <v-card :loading="loading">
                <v-card-text class="text-center"> 
                  <div>TOTAL <br/>REQUEST</div>
                  <h2 class="mt-4">{{objTotal.totalcount }}</h2>
                </v-card-text>
              </v-card>
            </div>
          </v-row>
          <v-row>
            <v-col class="col-12">
                <v-card>
                  <v-card-title>Recent activities</v-card-title>
                  <v-card-text>
                    <v-simple-table >
                      <template v-slot:default>
                        <thead>
                          <tr>
                            <th class="text-left">
                              STATUS
                            </th>
                            <th class="text-left">
                              RQST DATE
                            </th>
                            <th>PRF No.</th>
                            <th>BUSINESS UNIT</th>
                            <th>REQUESTED BY</th>
                            <th>PROCESSED BY</th>
                            <th>URGENCY</th>
                          </tr>
                        </thead>
                        <tbody v-if="objTotal" class="dense-table">
                            <tr v-for="(item, index) in objTotal.item">
                              <td :class="item.status">{{ cleanStatus(item.status) }}</td>
                              <td>{{ formatDateHelper(item.created_at) }}</td>
                              <td>{{ item.prf_no }}</td>
                              <td>{{ item.company.title }}</td>
                              <td>{{ item.profile.name }}</td>
                              <td>{{ item.process_by ? item.process_by.name : '' }}</td>
                              <td>{{ item.urgency }}</td>
                            </tr>
                        </tbody>
                      </template>
                    </v-simple-table>
                  </v-card-text>
                </v-card>
            </v-col>
          </v-row>
    </v-container>
  
  </div>
</template>
<script>
 
export default {
  
  data() {
    return {
      auth: this.$store.state.authUser.userObject,  
      // ui 
      objTotal: {},
      objList: {},
      sbOptions: {},
      confOptions: {},
      loading:   false,  
    };
  },
  
  methods: {
  
    fetchTotalRequests: async function () {
      await axios
        .get("/d/requests/dashboard")
        .then((response) => { 

          this.objTotal = Object.assign({}, response.data);
        
        });
    },
  
  },
  mounted() {
   
     this.fetchTotalRequests();
  },
};
</script>
