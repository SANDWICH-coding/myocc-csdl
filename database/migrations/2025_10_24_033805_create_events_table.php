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
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->tinyInteger('school_year_id');

            $table->string('event_name');
            $table->foreignId('location_id')->constrained('locations');
            $table->date('event_date');

            $table->enum('attendance_type', ['single', 'double']);
            // if attendance_type is single
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();
            // if attendance_type is double
            $table->time('first_start_time')->nullable();
            $table->time('first_end_time')->nullable();
            $table->time('second_start_time')->nullable();
            $table->time('second_end_time')->nullable();

            $table->integer('attendance_duration');

            $table->json('participant_course_id');
            $table->json('participant_year_level_id');

            $table->foreignId('sanction_id')->constrained('sanctions');
            $table->boolean('is_cancelled')->default(false);
            $table->boolean('status')->default(true);

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
