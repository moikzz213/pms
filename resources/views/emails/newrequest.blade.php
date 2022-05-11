@component('mail::message')
# NEW REQUEST
 
<table style="width:600px; margin:0 auto;"> 
<tr> 
    <th style="padding: 5px 10px; border:1px solid #ccc; text-align:left;">PRF NO</th> 
    <td style="padding: 5px 10px; border:1px solid #ccc;text-align:left;">{{$data['details']['prf_no']}}</td>  
</tr>
<tr> 
    <th style="padding: 5px 10px; border:1px solid #ccc;text-align:left;">Date</th> 
    <td style="padding: 5px 10px; border:1px solid #ccc;text-align:left;">{{$data['date'];}}</td>  
</tr>
<tr> 
    <th style="padding: 5px 10px; border:1px solid #ccc;text-align:left;">Requested by</th> 
    <td style="padding: 5px 10px; border:1px solid #ccc;text-align:left;">{{$data['details']['profile']['name']}}</td>  
</tr>
<tr> 
    <th style="padding: 5px 10px; border:1px solid #ccc;text-align:left;">Company</th> 
    <td style="padding: 5px 10px; border:1px solid #ccc;text-align:left;">{{$data['details']['profile']['company']['title']}}</td>  
</tr>
<tr> 
    <th style="padding: 5px 10px; border:1px solid #ccc;text-align:left;">Department</th> 
    <td style="padding: 5px 10px; border:1px solid #ccc;text-align:left;">{{$data['details']['profile']['department']['title']}}</td>  
</tr>
<tr>
<td style="padding: 5px 10px; border:1px solid #ccc;text-align:left;" colspan="2">
{{$data['details']['data']}}
</td>
</tr>
 </table>   
Link: https://procurement.gagroup.net
@endcomponent