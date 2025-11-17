<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('sanctions', function (Blueprint $table) {
            $table->id();
            $table->enum('sanction_type', ['monetary', 'service']);
            $table->string('sanction_name');
            $table->string('sanction_description')->nullable();
            $table->decimal('monetary_amount', 10, 2)->nullable();
            $table->integer('service_time', 10, 2)->nullable();
            $table->enum('service_time_type', ['minutes', 'hours'])->nullable();
            $table->boolean('status')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sanctions');
    }
};
