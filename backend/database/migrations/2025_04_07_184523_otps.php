<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('otps', function (Blueprint $table) {
            $table->increments('id'); // Primary key
            $table->unsignedInteger('user_id')->nullable(); // Foreign key for user
            $table->string('otp'); // OTP field
            $table->dateTime('expires_at'); // Expiration time
            $table->dateTime('time_stamp'); // Timestamp for when OTP was created
            $table->unsignedInteger('vendor_id')->nullable(); // Foreign key for vendor
            $table->unsignedInteger('admin_id')->nullable(); // Foreign key for admin
            
            // Foreign key constraints
            $table->foreign('user_id')->references('user_id')->on('users')->onDelete('cascade'); // Added this line
            $table->foreign('vendor_id')->references('vendor_id')->on('vendors')->onDelete('cascade');
            $table->foreign('admin_id')->references('admin_id')->on('admins')->onDelete('cascade');

            $table->timestamps(); // Optional if you want to track created_at and updated_at
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('otps');
    }
};
