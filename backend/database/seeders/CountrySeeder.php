<?php

namespace Database\Seeders;

use App\Models\Country;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CountrySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $items = [
            ['name' => 'Japan', 'region' => 'Asia'],
            ['name' => 'Germany', 'region' => 'Europe'],
            ['name' => 'Kazakhstan', 'region' => 'Asia'],
            ['name' => 'USA', 'region' => 'America'],
            ['name' => 'France', 'region' => 'Europe'],
        ];

        foreach ($items as $item) {
            Country::updateOrCreate(
                ['slug' => Str::slug($item['name'])],
                [
                    'name' => $item['name'],
                    'slug' => Str::slug($item['name']),
                    'region' => $item['region'],
                    'description' => null,
                    'flag_path' => null,
                    'is_active' => true,
                ]
            );
        }
    }
}
