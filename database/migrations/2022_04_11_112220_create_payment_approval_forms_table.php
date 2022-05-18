<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePaymentApprovalFormsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('payment_approval_forms', function (Blueprint $table) {
            $table->id();
            $table->string('relation', 15)->nullable();
            $table->unsignedBigInteger('request_id')->nullable();
            $table->string('invoices',250)->nullable();
            $table->date('invoice_date')->nullable();
            $table->string('paf_no', 50)->nullable();  
            $table->unsignedBigInteger('company_id')->nullable();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('department_head',150)->nullable();
            $table->string('department_name', 80)->nullable();
            $table->string('mode_of_payment', 50)->nullable();
            $table->float('purchase_limit', 10)->nullable();
            $table->float('total_vat', 10)->nullable(); 
            $table->float('cash_card_limit', 10)->nullable();
            $table->string('document_no_1', 80)->nullable();
            $table->string('document_no_2', 80)->nullable();
            $table->unsignedBigInteger('supplier_id')->nullable();
            $table->string('currency',10)->default("aed");
            $table->text('remarks_general')->nullable();
            $table->text('amount_in_words')->nullable();
            $table->text('approval_limit_payment')->nullable();
            $table->text('remarks_finance')->nullable();
            $table->unsignedInteger('budgeted')->nullable();
            $table->float('discount', 10)->nullable();
            $table->float('currency_rate', 5)->default(1);
            $table->float('total_amount', 10)->nullable();
            $table->float('net_amount', 10)->nullable();
            $table->string('status', 80);
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
        Schema::dropIfExists('payment_approval_forms');
    }
}
