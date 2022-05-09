<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLocalPurchaseOrdersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('local_purchase_orders', function (Blueprint $table) {
            $table->id(); 
            $table->unsignedBigInteger('supplier_id')->nullable();
            $table->unsignedBigInteger('contact_person')->nullable(); // user id 
            $table->string('lpo_no', 50)->nullable();
            $table->string('prf_extension', 20)->nullable();
            $table->unsignedBigInteger('request_id')->nullable();
            $table->string('supplier_ref_num', 50)->nullable();
            $table->string('company', 80)->nullable();
            $table->integer('is_license')->nullable();
            $table->unsignedBigInteger('location_id')->nullable();
            $table->string('status', 30);
            $table->text('remarks_general')->nullable();
            $table->text('remarks_optional')->nullable();
            $table->text('remarks_finance')->nullable();
            $table->text('remarks_payment_terms')->nullable();
            $table->float('net_amount', 10)->nullable();
            $table->float('total_amount', 10)->nullable();
            $table->float('discount', 10)->nullable();
            $table->float('vat', 5)->nullable();
            $table->string('license_title_label_1', 50)->nullable();
            $table->string('license_title_label_2', 50)->nullable();
            $table->float('license_title_value_1',10)->nullable();
            $table->float('license_title_value_2',10)->nullable();
            $table->unsignedInteger('payment_terms')->nullable(); // 1 Credit , 2 Payment upon delivery, 3 Advance
            $table->unsignedInteger('payment_mode')->nullable(); // 1 Cheque , 2 Credit Card, 3 Cash
            $table->string('delivery_terms', 30)->nullable();
            $table->unsignedInteger('billing_details_id')->nullable();
            $table->unsignedInteger('shipping_details_id')->nullable();
            $table->unsignedInteger('user_id')->nullable(); // Contact Person
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
        Schema::dropIfExists('local_purchase_orders');
    }
}
