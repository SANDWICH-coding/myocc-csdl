<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;


return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement("ALTER TABLE users 
            MODIFY COLUMN user_role 
            ENUM('super_admin','admin','security','student','department_head') 
            NOT NULL");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE users 
            MODIFY COLUMN user_role 
            ENUM('admin','security','student') 
            NOT NULL");
    }
};
