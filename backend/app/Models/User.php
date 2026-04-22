<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Carbon;

class User extends Authenticatable implements FilamentUser
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass-assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'is_admin',
        'bio',
        'avatar_path',
        'selected_countries',
        'interests',
        'difficulty',
        'current_streak',
        'longest_streak',
        'last_activity_date'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_admin' => 'boolean',
            'selected_countries' => 'array',
            'interests' => 'array',
        ];
    }

    public function canAccessPanel(Panel $panel): bool
    {
        return $panel->getId() === 'admin'
            && $this->is_admin;
    }

    protected function avatarUrl(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->avatar_path
                ? Storage::disk('public')->url($this->avatar_path)
                : null,
        );
    }

    public function updateStreak(): void
    {
        $today = now()->startOfDay();
        $lastActivity = $this->last_activity_date
            ? Carbon::parse($this->last_activity_date)->startOfDay()
            : null;


        if (!$lastActivity) {
            $this->current_streak = 1;
        } elseif ($lastActivity->isYesterday()) {
            $this->current_streak++;
        } elseif ($lastActivity->isBefore(now()->subDay()->startOfDay())) {
            $this->current_streak = 1;
        }


        $this->longest_streak = max($this->current_streak, $this->longest_streak);


        $this->last_activity_date = $today->toDateString();

        $this->save();
    }


    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function scenarioAttempts(): HasMany
    {
        return $this->hasMany(ScenarioAttempt::class);
    }

    public function lessonProgress(): HasMany
    {
        return $this->hasMany(UserLessonProgress::class);
    }

    public function quizQuestionAttempts(): HasMany
    {
        return $this->hasMany(QuizQuestionAttempt::class);
    }

    public function flashcardReviews(): HasMany
    {
        return $this->hasMany(FlashcardReview::class);
    }

    public function lessonCompletionEvents(): HasMany
    {
        return $this->hasMany(LessonCompletionEvent::class);
    }
}
