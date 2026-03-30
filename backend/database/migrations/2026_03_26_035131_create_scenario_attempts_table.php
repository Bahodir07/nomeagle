<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('scenario_attempts', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->foreignId('scenario_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->string('selected_answer');
            $table->boolean('is_correct')->default(false);
            $table->unsignedInteger('xp_earned')->default(0);

            $table->timestamp('answered_at')->nullable();

            $table->timestamps();

            $table->index('user_id');
            $table->index('scenario_id');
            $table->index('answered_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('scenario_attempts');
    }
};
