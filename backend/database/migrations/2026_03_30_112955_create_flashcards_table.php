<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('flashcards', function (Blueprint $table) {
            $table->id();

            $table->foreignId('lesson_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->text('front_text');
            $table->text('back_text');

            $table->unsignedInteger('order')->default(1);
            $table->boolean('is_active')->default(true);

            $table->timestamps();

            $table->index('lesson_id');
            $table->index('order');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('flashcards');
    }
};
