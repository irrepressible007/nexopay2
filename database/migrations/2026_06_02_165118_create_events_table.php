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
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('cover_image')->nullable();
            $table->dateTime('start_date')->nullable();
            $table->dateTime('end_date')->nullable();
            $table->string('status')->default('upcoming'); // draft, upcoming, ongoing, past
            $table->decimal('participant_price', 8, 2)->default(0);
            $table->decimal('ca_price', 8, 2)->default(0);
            $table->decimal('volunteer_price', 8, 2)->default(0);
            $table->integer('capacity')->nullable();
            $table->json('form_schema')->nullable(); // Admin defined fields for registration
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
