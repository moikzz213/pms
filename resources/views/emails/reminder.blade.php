@component('mail::message')
# THIS IS AN AUTOMATED REMINDER!
<table style="width:800px; margin:0 auto;border-spacing:0;"> 
<thead>
    <tr>
        <th>PRF</th>
        <th>Company</th>
        <th>Requested By</th>
        <th>Processed By</th>
        <th>Date Requested</th>
    </tr>
</thead>
@foreach ($data['details'] as $k => $v) 
<tr>  
    <td style="padding: 5px 10px; border:1px solid #ccc;text-align:left;font-size:12px;">{{$v['prf_no']}}</td>  
    <td style="padding: 5px 10px; border:1px solid #ccc;text-align:left;font-size:12px;">{{$v['company']}}</td>  
    <td style="padding: 5px 10px; border:1px solid #ccc;text-align:left;font-size:12px;">{{$v['profile']}}</td>  
    <td style="padding: 5px 10px; border:1px solid #ccc;text-align:left;font-size:12px;">{{$v['process_by']}}</td>  
    <td style="padding: 5px 10px; border:1px solid #ccc;text-align:left;font-size:12px;">{{$v['request_date']}}</td>  
</tr>
@endforeach
 </table>
<br/>
Link: https://procurement.gagroup.net <br/>
<small>IT Department - Web Developer Team</small>

@endcomponent