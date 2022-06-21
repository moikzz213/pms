<?php

namespace App\Jobs;

use App\Mail\SendPasswordToUser;
use Illuminate\Bus\Queueable;
use Illuminate\Support\Carbon; 
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Contracts\Queue\ShouldBeUnique;

class UserResetPassword implements ShouldQueue
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
        $password = $publisherData['password'];
        $email = $publisherData['email'];   
        $subject =  $publisherData['subject'];  

        $getEmails =  (object) ['email' => $email];

        $data = array("password" => $password,  "date" => Carbon::now(), 'subject' => $subject); 
       
        Mail::to($getEmails)->queue( new SendPasswordToUser($data) ); 
    }
}
