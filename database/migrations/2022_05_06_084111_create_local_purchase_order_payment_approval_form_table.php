<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLocalPurchaseOrderPaymentApprovalFormTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('local_purchase_order_payment_approval_form', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('local_purchase_order_id');
            $table->unsignedBigInteger('payment_approval_form_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('local_purchase_order_payment_approval_form');
    }
}
