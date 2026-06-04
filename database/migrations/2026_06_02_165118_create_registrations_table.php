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
        Schema::create('registrations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->restrictOnDelete();
            $table->foreignId('event_id')->constrained()->restrictOnDelete();
            $table->foreignId('role_id')->constrained()->restrictOnDelete();
            $table->string('bkash_txid')->nullable();
            $table->string('status')->default('pending'); // pending, approved, rejected
            $table->json('form_data')->nullable(); // User's answers for dynamic fields
            $table->uuid('qr_uuid')->nullable()->unique();
            $table->string('progress_status')->nullable();
            $table->integer('position')->nullable();
            $table->string('prize_won')->nullable();
            $table->boolean('is_checked_in')->default(false);
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['event_id', 'bkash_txid'], 'unique_txid_per_event');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('registrations');
    }
};
