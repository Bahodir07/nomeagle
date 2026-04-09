<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('user_lesson_progress', function (Blueprint $table) {
            $table->renameColumn('total_scenarios', 'total_items');
            $table->renameColumn('completed_scenarios', 'completed_items');
        });
    }

    public function down(): void
    {
        Schema::table('user_lesson_progress', function (Blueprint $table) {
            $table->renameColumn('total_items', 'total_scenarios');
            $table->renameColumn('completed_items', 'completed_scenarios');
        });
    }
};
