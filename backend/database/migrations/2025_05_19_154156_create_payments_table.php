<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->increments('payment_id');
            $table->unsignedInteger('order_id')->unique(); // One-to-one relationship with orders
            $table->string('chapa_reference')->nullable();
            $table->enum('payment_status', ['pending', 'held', 'user_released', 'admin_approved', 'vendor_paid'])->default('pending');
            $table->float('total_amount');
            $table->float('vendor_payout_amount')->nullable();
            $table->float('service_fee_amount')->nullable();
            $table->timestamps();

            $table->foreign('order_id')->references('order_id')->on('orders')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};