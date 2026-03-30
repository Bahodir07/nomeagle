<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_lesson_progress', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('lesson_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('status')->default('not_started');
            $table->unsignedInteger('progress_pct')->default(0);

            $table->unsignedInteger('total_scenarios')->default(0);
            $table->unsignedInteger('completed_scenarios')->default(0);

            $table->unsignedInteger('correct_answers')->default(0);
            $table->unsignedInteger('total_attempts')->default(0);

            $table->unsignedInteger('xp_earned')->default(0);

            $table->timestamp('completed_at')->nullable();
            $table->timestamp('last_activity_at')->nullable();

            $table->timestamps();

            $table->unique(['user_id', 'lesson_id']);

            $table->index('user_id');
            $table->index('lesson_id');
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_lesson_progress');
    }
};
