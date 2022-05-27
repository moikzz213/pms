<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePaymentApprovalFormItemsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('payment_approval_form_items', function (Blueprint $table) {
            $table->id(); 
            $table->unsignedBigInteger('payment_approval_form_id')->nullable();
            $table->unsignedBigInteger('local_purchase_order_id')->nullable();
            $table->string('location', 150)->nullable();
            $table->string('serial_number', 80)->nullable(); 
            $table->string('supplier_invoice_num', 100)->nullable();
            $table->string('description')->nullable();
            $table->string('invoice_date', 50)->nullable();
            $table->unsignedInteger('qty')->default(1);
            $table->float('unit_price', 10)->nullable();
            $table->float('total_amount', 10)->nullable();
            $table->float('amount', 10)->nullable();
            $table->float('vat', 10)->nullable(); 
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
        Schema::dropIfExists('payment_approval_form_items');
    }
}
