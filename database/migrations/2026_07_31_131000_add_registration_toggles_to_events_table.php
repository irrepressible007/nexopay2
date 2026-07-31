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
            $table->boolean('allow_participant_registration')->default(true);
            $table->boolean('allow_ca_registration')->default(true);
            $table->boolean('allow_volunteer_registration')->default(true);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn([
                'allow_participant_registration',
                'allow_ca_registration',
                'allow_volunteer_registration',
            ]);
        });
    }
};
