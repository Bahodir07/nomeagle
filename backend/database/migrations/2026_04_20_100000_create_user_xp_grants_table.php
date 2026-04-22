<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_xp_grants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('grantable_type'); // 'flashcard' | 'scenario' | 'quiz_question' | 'lesson'
            $table->unsignedBigInteger('grantable_id');
            $table->timestamps();

            $table->unique(['user_id', 'grantable_type', 'grantable_id']);
            $table->index('user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_xp_grants');
    }
};
