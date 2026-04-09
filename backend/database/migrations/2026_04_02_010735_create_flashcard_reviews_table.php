<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('flashcard_reviews', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('flashcard_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('rating'); // again | good | easy
            $table->unsignedInteger('xp_earned')->default(0);

            $table->timestamp('shown_at')->nullable();
            $table->timestamp('flipped_at')->nullable();
            $table->timestamp('reviewed_at')->nullable();

            $table->timestamps();

            $table->index('user_id');
            $table->index('flashcard_id');
            $table->index('rating');
            $table->index('reviewed_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('flashcard_reviews');
    }
};
