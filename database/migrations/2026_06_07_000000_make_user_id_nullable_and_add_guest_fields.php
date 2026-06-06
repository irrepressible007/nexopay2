<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('registrations', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id')->nullable()->change();
            
            if (!Schema::hasColumn('registrations', 'guest_name')) {
                $table->string('guest_name')->nullable()->after('user_id');
            }
            if (!Schema::hasColumn('registrations', 'guest_email')) {
                $table->string('guest_email')->nullable()->after('guest_name');
            }
        });
    }

    public function down(): void
    {
        Schema::table('registrations', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id')->nullable(false)->change();
            $table->dropColumn('guest_name');
            $table->dropColumn('guest_email');
        });
    }
};
