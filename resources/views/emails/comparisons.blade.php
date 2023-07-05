@component('mail::message')
<img src="https://procurement.gagroup.net/logo/GAG-EnhancedLogo.svg" style="max-width:300px;">
<br/>
<h4>COMPANY: GHASSAN ABOUD GROUP</h4>
<h4>{{$data['title']}}</h4>
---------------------------------------------------
<pre style="padding-top:5px; padding-bottom:5px;">{{ $data['message'] }}</pre>
----------------------------------------------------
{{-- <table style="width:800px; margin:0 auto;border-spacing:0;"> 
    <thead>
        <tr>
            <th colspan="4" style="padding: 5px 10px; border:1px solid #000;text-align:center;font-size:14px;">{{$data['title']}}</th>
        </tr>
        <tr>
            <th style="padding: 5px 10px; border:1px solid #000;text-align:left;font-size:12px;">S/N</th>
            <th style="padding: 5px 10px; border:1px solid #000;text-align:left;font-size:12px;">DESCRIPTION</th>
            <th style="padding: 5px 10px; border:1px solid #000;text-align:left;font-size:12px;">QTY</th>
            <th style="padding: 5px 10px; border:1px solid #000;text-align:left;font-size:12px;">UOM</th> 
        </tr>
    </thead>
<tbody>
@foreach ($data['details'] as $k => $v) 
<tr>  
<td style="padding: 5px 10px; border:1px solid #000;text-align:left;font-size:12px;">{{$k+1}}</td>  
<td style="padding: 5px 10px; border:1px solid #000;text-align:left;font-size:12px;">{{$v['description']}}</td>  
<td style="padding: 5px 10px; border:1px solid #000;text-align:left;font-size:12px;">{{$v['qty']}}</td>  
<td style="padding: 5px 10px; border:1px solid #000;text-align:left;font-size:12px;">{{$v['uom']}}</td>   
</tr>
@endforeach
</tbody>
</table> --}}
{{-- <br/>
Kindly submit your quotation through our system from the link below. --}}
<br/>
Link: https://procurement.gagroup.net/suppliers/add-quotation?id={{$data['url']}}
@endcomponent