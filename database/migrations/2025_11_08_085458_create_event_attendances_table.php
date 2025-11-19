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
        Schema::create('event_attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('event_id')->constrained('events');
            $table->string('user_id_no');
            $table->string('checkpoint'); // e.g., 'start_time', 'end_time', 'first_start_time', etc.
            $table->time('attended_at');
            $table->json('location_coordinates');
            $table->string('device_user_id_no');
            $table->string('device_model');
            $table->timestamps();

            // Unique constraint to prevent duplicate attendances per user per checkpoint per event
            $table->unique(['event_id', 'user_id_no', 'checkpoint']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('event_attendances');
    }
};
