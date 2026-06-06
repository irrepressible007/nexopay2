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
        Schema::table('events', function (Blueprint $table) {
            $table->json('ca_form_schema')->nullable()->after('form_schema');
            $table->json('volunteer_form_schema')->nullable()->after('ca_form_schema');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn('ca_form_schema');
            $table->dropColumn('volunteer_form_schema');
        });
    }
};
