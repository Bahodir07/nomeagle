<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Country extends Model
{
    protected $fillable = [
        'name',
        'slug',
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
            if (blank($country->slug) || ($country->isDirty('name') && ! $country->isDirty('slug'))) {
                $country->slug = $country->generateUniqueSlug($country->name);
            }
        });
    }

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

    public function generateUniqueSlug(string $name): string
    {
        $base = Str::slug($name);
        $slug = $base;
        $i = 2;

        while (
        static::query()
            ->where('slug', $slug)
            ->when($this->exists, fn ($q) => $q->whereKeyNot($this->getKey()))
            ->exists()
        ) {
            $slug = "{$base}-{$i}";
            $i++;
        }

        return $slug;
    }

}
