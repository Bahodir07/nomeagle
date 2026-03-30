<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('quiz_questions', function (Blueprint $table) {
            $table->id();

            $table->foreignId('lesson_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->text('question');

            $table->json('options')->nullable();

            $table->text('explanation')->nullable();

            $table->unsignedInteger('order')->default(1);

            $table->unsignedInteger('xp_reward')->default(0);

            $table->boolean('is_active')->default(true);

            $table->timestamps();

            $table->index('lesson_id');
            $table->index('order');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quiz_questions');
    }
};
