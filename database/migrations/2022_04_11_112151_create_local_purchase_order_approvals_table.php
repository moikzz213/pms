<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLocalPurchaseOrderApprovalsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('local_purchase_order_approvals', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('local_purchase_order_id');
            $table->unsignedBigInteger('user_id'); 
            $table->unsignedInteger('orders'); 
            $table->string('approval_type', 80); 
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
        Schema::dropIfExists('local_purchase_order_approvals');
    }
}
