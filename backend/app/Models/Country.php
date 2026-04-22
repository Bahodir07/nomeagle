<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Country extends Model
{

    /**
     * @property int $id
     * @property string $name
     * @property string $slug
     * @property string|null $region
     * @property string|null $description
     * @property string|null $flag_path
     * @property bool $is_active
     * @property Carbon $created_at
     * @property Carbon $updated_at
     */

    protected $fillable = [
        'name',
        'slug',
        'iso_code',
        'region',
        'description',
        'flag_path',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    protected static function booted(): void
    {
        static::saving(function (Country $country) {
            if (blank($country->slug) || ($country->isDirty('name') && !$country->isDirty('slug'))) {
                $country->slug = $country->generateUniqueSlug($country->name);
            }
        });
    }

    /*
    |--------------------------------------------------------------------------
    | Scopes
    |--------------------------------------------------------------------------
    */


    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public function scopeInactive(Builder $query): Builder
    {
        return $query->where('is_active', false);
    }

    public function scopeRegion(Builder $query, string $region): Builder
    {
        return $query->where('region', $region);
    }

    public function publish(): void
    {
        $this->forceFill(['is_active' => true])->save();
    }

    public function unpublish(): void
    {
        $this->forceFill(['is_active' => false])->save();
    }

    /*
    |--------------------------------------------------------------------------
    | Slug generation
    |--------------------------------------------------------------------------
    */


    public function generateUniqueSlug(string $name): string
    {
        $base = Str::slug($name);
        $slug = $base;
        $i = 2;

        while (
        static::query()
            ->where('slug', $slug)
            ->when($this->exists, fn($q) => $q->whereKeyNot($this->getKey()))
            ->exists()
        ) {
            $slug = "{$base}-{$i}";
            $i++;
        }

        return $slug;
    }

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function flagEmoji(): string
    {
        // Generate flag emoji from ISO 3166-1 alpha-2 code via Unicode Regional Indicator Symbols
        if ($this->iso_code && strlen($this->iso_code) === 2) {
            $code = strtoupper($this->iso_code);
            return mb_chr(ord($code[0]) - ord('A') + 0x1F1E6)
                 . mb_chr(ord($code[1]) - ord('A') + 0x1F1E6);
        }

        return match ($this->slug) {
            'japan'                => '🇯🇵',
            'germany'              => '🇩🇪',
            'kazakhstan'           => '🇰🇿',
            'france'               => '🇫🇷',
            'italy'                => '🇮🇹',
            'brazil'               => '🇧🇷',
            'usa', 'united-states' => '🇺🇸',
            'china'                => '🇨🇳',
            'turkey'               => '🇹🇷',
            'south-korea', 'korea' => '🇰🇷',
            default                => '🏳️',
        };
    }

    public function modules()
    {
        return $this->hasMany(Module::class)->orderBy('order');
    }

}
