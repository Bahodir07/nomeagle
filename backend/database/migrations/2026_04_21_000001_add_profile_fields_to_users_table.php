<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('bio', 120)->nullable()->after('name');
            $table->json('selected_countries')->nullable()->after('bio');
            $table->json('interests')->nullable()->after('selected_countries');
            $table->string('difficulty')->default('beginner')->after('interests');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['bio', 'selected_countries', 'interests', 'difficulty']);
        });
    }
};
