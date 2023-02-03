<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class RequestCancelled extends Mailable 
{
    use Queueable, SerializesModels;

    public $data;
  
    public $subject;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($data)
    {
        $this->data = $data; 

        if(@$this->data['subject'] ){
            $this->subject = $this->data['subject'];
        }else{
            $this->subject = 'Request Cancelled';
        }
    }
    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {  
         
        return $this->subject($this->subject)->markdown('emails.cancelrequest');         
    }
}