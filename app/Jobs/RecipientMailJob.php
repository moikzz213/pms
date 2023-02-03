<?php

namespace App\Jobs;

use App\Models\Profile;
use App\Mail\RecipientMail;
use Illuminate\Bus\Queueable;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Mail;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Contracts\Queue\ShouldBeUnique;

class RecipientMailJob implements ShouldQueue
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
        $message = $publisherData['message'];
        $details = $publisherData['details'];
        $subject =  $publisherData['subject'];
        $email =  explode(",", $publisherData['email']);

        $user = $details['user_id'];
        $profile = Profile::where('user_id', '=', $user)->with('company', 'department')->first(); 
        $details['profile'] = $profile;

        if(count($email) > 1){ 
        }else{
            $email =  explode(";", $publisherData['email']);
        }
        
        $getEmails =  (object) ['email' => $email];

        $data = array("details" => $details,"date" => Carbon::now(), "message" => $message, 'subject' => $subject);
       
        Mail::to($getEmails)->queue( new RecipientMail($data) ); 
    }
}
