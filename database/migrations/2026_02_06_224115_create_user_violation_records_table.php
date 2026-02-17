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
        Schema::create('user_violation_records', function (Blueprint $table) {
            $table->id();
            $table->string('reference_no', 11)->unique();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->json('violation_ids');
            $table->foreignId('sanction_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();
            $table->foreignId('issued_by')
                ->nullable()
                ->constrained('users')
                ->nullOnDelete();
            $table->string('status')->default('unsettled');
            $table->dateTime('issued_date_time')->nullable();
            $table->text('remarks')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_violation_records');
    }
};
