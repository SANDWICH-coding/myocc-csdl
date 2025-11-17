<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        // Add profile_photo column to users table
        Schema::table('users', function (Blueprint $table) {
            $table->string('profile_photo')->nullable()->after('user_id_no');
        });

        // Drop the user_profile_photo table
        Schema::dropIfExists('user_profile_photo');
    }

    public function down()
    {
        // Reverse the changes: drop the profile_photo column
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('profile_photo');
        });

        // Recreate the user_profile_photo table (basic structure, adjust as needed)
        Schema::create('user_profile_photo', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->string('photo_path')->nullable();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }
};
