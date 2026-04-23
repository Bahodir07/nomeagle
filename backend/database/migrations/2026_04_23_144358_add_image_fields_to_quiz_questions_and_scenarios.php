<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('quiz_questions', function (Blueprint $table) {
            if (! Schema::hasColumn('quiz_questions', 'question_image_path')) {
                $table->string('question_image_path')->nullable()->after('question');
            }
            if (! Schema::hasColumn('quiz_questions', 'question_image_alt')) {
                $table->string('question_image_alt')->nullable()->after('question_image_path');
            }
        });

        Schema::table('scenarios', function (Blueprint $table) {
            if (! Schema::hasColumn('scenarios', 'image_path')) {
                $table->string('image_path')->nullable()->after('prompt');
            }
            if (! Schema::hasColumn('scenarios', 'image_alt')) {
                $table->string('image_alt')->nullable()->after('image_path');
            }
        });
    }

    public function down(): void
    {
        Schema::table('quiz_questions', function (Blueprint $table) {
            $table->dropColumn(['question_image_path', 'question_image_alt']);
        });

        Schema::table('scenarios', function (Blueprint $table) {
            $table->dropColumn(['image_path', 'image_alt']);
        });
    }
};
