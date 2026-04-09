<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('scenario_attempts', function (Blueprint $table) {
            $table->unsignedInteger('duration_seconds')->default(0)->after('xp_earned');
        });

        Schema::table('quiz_question_attempts', function (Blueprint $table) {
            $table->unsignedInteger('duration_seconds')->default(0)->after('xp_earned');
        });

        Schema::table('flashcard_reviews', function (Blueprint $table) {
            $table->unsignedInteger('duration_seconds')->default(0)->after('xp_earned');
        });
    }

    public function down(): void
    {
        Schema::table('scenario_attempts', function (Blueprint $table) {
            $table->dropColumn('duration_seconds');
        });

        Schema::table('quiz_question_attempts', function (Blueprint $table) {
            $table->dropColumn('duration_seconds');
        });

        Schema::table('flashcard_reviews', function (Blueprint $table) {
            $table->dropColumn('duration_seconds');
        });
    }
};
