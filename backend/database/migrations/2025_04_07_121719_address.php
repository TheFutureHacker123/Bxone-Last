<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('address', function (Blueprint $table) {  // Changed back to 'address'
            $table->increments('address_id'); // Auto-increment primary key
            $table->string('full_name', 100);
            $table->string('phone', 20);
            $table->string('country', 100);
            $table->string('state', 100);
            $table->string('city', 100);
            $table->string('post')->nullable();
            $table->unsignedInteger('user_id'); // Foreign key reference
            $table->timestamps(); // Adding created_at and updated_at timestamps
            
            // Foreign key constraint
            $table->foreign('user_id')->references('user_id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('address'); // Reverted to 'address'
    }
};
