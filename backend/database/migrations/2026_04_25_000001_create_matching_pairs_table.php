<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('matching_pairs', function (Blueprint $table) {
            $table->id();

            $table->foreignId('lesson_id')
                ->constrained()
                ->cascadeOnDelete();

            $table->text('left_text');
            $table->text('right_text');

            $table->unsignedInteger('order')->default(1);
            $table->boolean('is_active')->default(true);

            $table->timestamps();

            $table->index('lesson_id');
            $table->index('order');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('matching_pairs');
    }
};
