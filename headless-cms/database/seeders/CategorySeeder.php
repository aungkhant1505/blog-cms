<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $topics = [
            'Web Development',
            'UI/UX Design',
            'Data Science',
            'Machine Learning',
            'Cloud Computing',
        ];

        foreach ($topics as $topic) {
            Category::updateOrCreate(
                ['name' => $topic],
                ['slug' => Str::slug($topic)]
            );
        }
    }
}
