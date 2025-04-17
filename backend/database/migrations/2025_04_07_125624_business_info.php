<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('business_info', function (Blueprint $table) {
            $table->increments('business_id'); // Auto-increment primary key
            $table->string('business_email', 100);
            $table->string('business_name', 100);
            $table->string('business_address', 100);
            $table->string('business_city', 100);
            $table->string('business_state', 100);
            $table->string('business_phone', 100); // Changed to string for handling phone formats
            $table->unsignedInteger('blicess_number'); // Assuming business number is a numeric field
            $table->string('address_proof_img', 255); // Storing image link/path for address proof
            $table->string('other_img_one', 255)->nullable(); // Optional image link/paths
            $table->string('other_img_two', 255)->nullable();
            $table->string('other_img_three', 255)->nullable();
            $table->string('other_img_four', 255)->nullable();
            $table->string('other_img_five', 255)->nullable();
            $table->enum('status', ['active', 'inactive', 'pending'])->default('pending'); // Enum for status
            $table->unsignedInteger('admin_id'); // Foreign key reference to admins
            $table->unsignedInteger('vendor_id'); // Foreign key reference to vendors
            $table->timestamps(); // Adding created_at and updated_at timestamps
            
            // Foreign key constraints
            $table->foreign('admin_id')->references('admin_id')->on('admin')->onDelete('cascade');
            $table->foreign('vendor_id')->references('vendor_id')->on('vendors')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('business_info');
    }
};
