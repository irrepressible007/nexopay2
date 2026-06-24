<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('email_logs', function (Blueprint $table) {
            $table->longText('body')->nullable()->after('subject');
            $table->unsignedBigInteger('sender_id')->nullable()->after('recipient');
            $table->unsignedBigInteger('parent_id')->nullable()->after('sender_id');

            // Optionally add foreign keys if users table is strictly related
            // $table->foreign('sender_id')->references('id')->on('users')->nullOnDelete();
            // $table->foreign('parent_id')->references('id')->on('email_logs')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('email_logs', function (Blueprint $table) {
            $table->dropColumn(['body', 'sender_id', 'parent_id']);
        });
    }
};
