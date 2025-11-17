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
        Schema::create('event_sanction_settlements', function (Blueprint $table) {
            $table->string('id', 8)->primary();
            $table->foreignId('event_id')->constrained('events');
            $table->string('user_id_no');

            $table->foreignId('sanction_id')->constrained('sanctions');
            $table->enum('settlement_type', ['monetary', 'service']);

            $table->decimal('amount_paid', 10, 2)->nullable(); // for monetary
            $table->integer('service_completed')->nullable(); // in minutes/hours
            $table->enum('service_time_type', ['minutes', 'hours'])->nullable();

            $table->string('settlement_logged_by'); //user_id_no in users table
            $table->enum('status', ['partial', 'pending', 'settled', 'waived'])->default('pending');
            $table->text('remarks')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('event_sanction_settlements');
    }
};
