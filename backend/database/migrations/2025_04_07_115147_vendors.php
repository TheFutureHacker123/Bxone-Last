<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('vendors', function (Blueprint $table) {
            $table->increments('vendor_id'); // auto-increment primary key
            $table->string('email', 100);
            $table->string('password', 100);
            $table->enum('status', ['UnVerified','Pending',"Active", 'Verified', 'Rejected ','Suspended'])->default('UnVerified');
            $table->timestamps(); // Adding created_at and updated_at timestamps
            $table->string('vendor_role_id', 10)->default('Vendor');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vendors');
    }
};

