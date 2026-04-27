<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    private array $map = [
        'Italian'    => 'it',
        'Chinese'    => 'cn',
        'German'     => 'de',
        'Japanese'   => 'jp',
        'French'     => 'fr',
        'Brazilian'  => 'br',
        'Canadian'   => 'ca',
        'Australian' => 'au',
        'Indian'     => 'in',
        'Mexican'    => 'mx',
        'Kazakh'     => 'kz',
        'Turkish'    => 'tr',
        'Spanish'    => 'es',
        'Egyptian'   => 'eg',
        'Thai'       => 'th',
    ];

    public function up(): void
    {
        foreach ($this->map as $name => $iso) {
            DB::table('countries')
                ->where('name', $name)
                ->whereNull('iso_code')
                ->update(['iso_code' => $iso]);
        }
    }

    public function down(): void
    {
        DB::table('countries')
            ->whereIn('name', array_keys($this->map))
            ->update(['iso_code' => null]);
    }
};
