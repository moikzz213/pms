@component('mail::message')
# PASSWORD RESET!
 
<table style="width:800px; margin:0 auto;border-spacing:0;"> 
<tr> 
    <th style="width: 80px; padding: 5px 10px; border:1px solid #ccc;text-align:left;font-size:12px;">NEW PASSWORD</th> 
    <td style="padding: 5px 10px; border:1px solid #ccc;text-align:left;font-size:12px;">{{$data['password']}}</td>  
</tr>
<tr> 
    <th style="width: 80px; padding: 5px 10px; border:1px solid #ccc;text-align:left;font-size:12px;">Date</th> 
    <td style="padding: 5px 10px; border:1px solid #ccc;text-align:left;font-size:12px;">{{$data['date'];}}</td>  
</tr>
<tr>  
    <th colspan="2" style="padding: 5px 10px; border:1px solid #ccc;text-align:left;font-size:12px;">Kindly change your password once you are logged-in to the system located at the Profile section.</th>  
</tr>
 
 
 </table>
<br/>
Link: https://procurement.gagroup.net
@endcomponent