<?php

namespace App\Jobs;

use App\Models\User;
use App\Mail\ProcurementAssigned;
use Illuminate\Bus\Queueable;
use Illuminate\Support\Carbon; 
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Contracts\Queue\ShouldBeUnique;

class RequestAssignToProcurement implements ShouldQueue
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
        $details = $publisherData['details'];
       
        $subject =  $publisherData['subject'];
        $user = $details['user_id'];

        $profile = User::where('id', '=', $user)->with('profile')->first(); 
        $details['user'] = $profile;

        $email = $profile['email']; 

        $getEmails =  (object) ['email' => $email];

        $data = array("details" => $details,  "date" => Carbon::now(), 'subject' => $subject); 
       
        Mail::to($getEmails)->queue( new ProcurementAssigned($data) ); 
    }
}
