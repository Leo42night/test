<?php

namespace Database\Seeders;

use App\Models\Blog;
use App\Models\Comment;
use App\Models\Pengadaan;
use App\Models\Portfolio;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'test',
            'email' => 'test@test.com',
            'password' => Hash::make('123456'),
            'role' => 'admin',
        ]);

        Blog::factory(10)->sequence(fn($sequence) => [
            'cover' => 'blogs/' . $sequence->index + 1 . '.jpg'
        ])->create();

        Comment::factory(20)->create();
        
        Portfolio::factory(10)->create();

        Pengadaan::factory(10)->create();
    }
}
