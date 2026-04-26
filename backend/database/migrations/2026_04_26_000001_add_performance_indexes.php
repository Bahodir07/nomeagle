<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Composite index for time-ranged duration SUM queries
        Schema::table('scenario_attempts', function (Blueprint $table) {
            $table->index(['user_id', 'created_at'], 'sa_user_created_at');
        });

        Schema::table('quiz_question_attempts', function (Blueprint $table) {
            $table->index(['user_id', 'created_at'], 'qqa_user_created_at');
            $table->index(['user_id', 'is_correct'], 'qqa_user_is_correct');
        });

        Schema::table('flashcard_reviews', function (Blueprint $table) {
            $table->index(['user_id', 'created_at'], 'fr_user_created_at');
        });

        Schema::table('lesson_completion_events', function (Blueprint $table) {
            $table->index(['user_id', 'created_at'], 'lce_user_created_at');
        });

        // Composite index for filtered progress lookups
        Schema::table('user_lesson_progress', function (Blueprint $table) {
            $table->index(['user_id', 'status'], 'ulp_user_status');
        });

        // Index for leaderboard time-range filter on updated_at
        Schema::table('user_lesson_progress', function (Blueprint $table) {
            $table->index(['user_id', 'updated_at'], 'ulp_user_updated_at');
        });

        // Index for grantable_type lookups in XP deduplication
        Schema::table('user_xp_grants', function (Blueprint $table) {
            $table->index('grantable_type', 'uxg_grantable_type');
        });
    }

    public function down(): void
    {
        Schema::table('scenario_attempts', function (Blueprint $table) {
            $table->dropIndex('sa_user_created_at');
        });

        Schema::table('quiz_question_attempts', function (Blueprint $table) {
            $table->dropIndex('qqa_user_created_at');
            $table->dropIndex('qqa_user_is_correct');
        });

        Schema::table('flashcard_reviews', function (Blueprint $table) {
            $table->dropIndex('fr_user_created_at');
        });

        Schema::table('lesson_completion_events', function (Blueprint $table) {
            $table->dropIndex('lce_user_created_at');
        });

        Schema::table('user_lesson_progress', function (Blueprint $table) {
            $table->dropIndex('ulp_user_status');
            $table->dropIndex('ulp_user_updated_at');
        });

        Schema::table('user_xp_grants', function (Blueprint $table) {
            $table->dropIndex('uxg_grantable_type');
        });
    }
};
