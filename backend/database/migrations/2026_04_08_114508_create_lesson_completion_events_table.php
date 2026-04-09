<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lesson_completion_events', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('lesson_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->unsignedInteger('xp_earned')->default(0);
            $table->unsignedInteger('duration_seconds')->default(0);

            $table->timestamp('completed_at')->nullable();

            $table->timestamps();

            $table->index('user_id');
            $table->index('lesson_id');
            $table->index('completed_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lesson_completion_events');
    }
};
