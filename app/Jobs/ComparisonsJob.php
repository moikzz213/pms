<?php

namespace App\Jobs;

 
use App\Mail\ComparisonMail;
use Illuminate\Bus\Queueable;
use Illuminate\Support\Carbon;  
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Contracts\Queue\ShouldBeUnique;

class ComparisonsJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */

    protected $data;
    public function __construct($data)
    {
        $this->data = $data;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        // Publisher ID
        $publisherData = $this->data;
        $ID = $publisherData['id'];
        $title = $publisherData['title'];
        $supplierID = $publisherData['supplierID'];
        $message = $publisherData['message'];
        $details = $publisherData['items'];
        $suppliers = $publisherData['email'];
        $subject =  $publisherData['subject'];
        $reminder =  @$publisherData['reminder'] ? $publisherData['reminder'] : null;
        
        foreach($supplierID AS $k => $v){
            $url = base64_encode(json_encode($ID."&suppid=".$v.'&key='.$suppliers[$k]));
            $data = array("details" => $details,'title' => $title, 'reminder' => $reminder,'url' => $url, "date" => Carbon::now(), "message" => $message, 'subject' => $subject); 
            Mail::to($suppliers[$k])->queue( new ComparisonMail($data) );
        } 
    }
}