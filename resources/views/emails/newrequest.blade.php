@component('mail::message')
# NEW REQUEST
 
<table style="width:800px; margin:0 auto;border-spacing:0;"> 
<tr> 
    <th style="width: 150px; padding: 5px 10px; border:1px solid #ccc;text-align:left;font-size:12px;">PRF NO</th> 
    <td style="padding: 5px 10px; border:1px solid #ccc;text-align:left;font-size:12px;">{{$data['details']['prf_no']}}</td>  
</tr>
<tr> 
    <th style="width: 150px; padding: 5px 10px; border:1px solid #ccc;text-align:left;font-size:12px;">Date</th> 
    <td style="padding: 5px 10px; border:1px solid #ccc;text-align:left;font-size:12px;">{{$data['date'];}}</td>  
</tr>
<tr> 
    <th style="width: 150px; padding: 5px 10px; border:1px solid #ccc;text-align:left;font-size:12px;">Requested by</th> 
    <td style="padding: 5px 10px; border:1px solid #ccc;text-align:left;font-size:12px;">{{$data['details']['profile']['name']}}</td>  
</tr>
<tr> 
    <th style="width: 150px; padding: 5px 10px; border:1px solid #ccc;text-align:left;font-size:12px;">Company</th> 
    <td style="padding: 5px 10px; border:1px solid #ccc;text-align:left;font-size:12px;">{{$data['details']['profile']['company']['title']}}</td>  
</tr>
<tr> 
    <th style="width: 150px; padding: 5px 10px; border:1px solid #ccc;text-align:left;font-size:12px;">Department</th> 
    <td style="padding: 5px 10px; border:1px solid #ccc;text-align:left;font-size:12px;">{{$data['details']['profile']['department']['title']}}</td>  
</tr>
<tr>
<td style="padding: 5px 10px; border:1px solid #ccc;text-align:left;font-size:12px;" colspan="2">
{!! $data['details']['data'] !!}
</td>
</tr>
 </table>
<br/>
Link: https://procurement.gagroup.net
@endcomponent