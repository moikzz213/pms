<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePaymentApprovalFormApprovalsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('payment_approval_form_approvals', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('payment_approval_form_id');
            $table->unsignedBigInteger('user_id'); 
            $table->unsignedInteger('orders'); 
            $table->string('approval_type', 50); 
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('payment_approval_form_approvals');
    }
}
