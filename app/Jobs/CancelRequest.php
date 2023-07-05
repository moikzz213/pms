<?php

namespace App\Jobs;

use App\Models\Profile;
use App\Mail\RequestCancelled;
use Illuminate\Bus\Queueable;
use Illuminate\Support\Carbon; 
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Contracts\Queue\ShouldBeUnique;

class CancelRequest implements ShouldQueue
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
        $employeeEmail = $publisherData['email'];   
        $subject =  $publisherData['subject'];
        $user = $publisherData['cancelledBy'];

        $profile = Profile::where('user_id', '=', $user)->with('company', 'department')->first(); 
        $details['profile'] = $profile;

        $email = explode(";", $employeeEmail);
        if(count($email) > 1){ 
            $employeeEmail = $email;
        }else{
            $employeeEmail = explode(",", $employeeEmail);
        }

        $getEmails =  (object) ['email' => $employeeEmail];

        $data = array("details" => $details,  "date" => Carbon::now(), 'subject' => $subject); 
       
        Mail::to($getEmails)->queue( new RequestCancelled($data) ); 
    }
}
