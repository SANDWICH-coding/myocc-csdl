<?php

namespace Database\Seeders;

use App\Models\UserInformation;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::updateOrCreate(
            ['user_id_no' => 'SUPERADMIN-001'],
            [
                'password' => Hash::make('P@ssw0rd'),
                'user_role' => 'super_admin',
                'face_enrolled' => 0,
                'profile_photo' => null,
            ]
        );

        UserInformation::updateOrCreate(
            ['user_id_no' => $user->user_id_no],
            [
                'first_name' => 'System',
                'last_name' => 'Administrator',
                'middle_name' => 'Root',
                'email_address' => 'superadmin@yourdomain.com',
            ]
        );
    }
}
