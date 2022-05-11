@component('mail::message') 
Dear {{$data['details']['user']['profile']['name']}}, <br/>

Request No. {{$data['details']['prf_no']}} has been assigned to you. <br/>
   
Link: https://procurement.gagroup.net
@endcomponent