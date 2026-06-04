<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [\App\Http\Controllers\PublicEventController::class, 'index'])->name('home');
Route::get('/events', [\App\Http\Controllers\PublicEventController::class, 'eventsIndex'])->name('events.index');
Route::get('/event/{event:slug}', [\App\Http\Controllers\PublicEventController::class, 'show'])->name('event.show');
Route::post('/event/{event:slug}/register', [\App\Http\Controllers\PublicEventController::class, 'register'])->name('event.register')->middleware('auth');

// Public secure export route for Google Sheets (=IMPORTDATA)
Route::get('/api/export/registrations', [\App\Http\Controllers\Admin\FinanceController::class, 'export'])->name('api.export.registrations');

Route::get('/dashboard', function () {
    $registrations = \App\Models\Registration::with(['event', 'role'])->where('user_id', auth()->id())->get();
    return Inertia::render('Dashboard', [
        'registrations' => $registrations
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::get('/registration/{registration}/id-card', function (\App\Models\Registration $registration) {
    if ($registration->user_id !== auth()->id() || $registration->status !== 'approved') {
        abort(403);
    }
    $registration->load(['event', 'user', 'role']);
    return Inertia::render('IDCard', [
        'registration' => $registration
    ]);
})->middleware(['auth', 'verified'])->name('registration.id-card');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'is_admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');
    Route::get('/settings', [\App\Http\Controllers\Admin\SettingsController::class, 'index'])->name('settings.index');
    Route::post('/settings', [\App\Http\Controllers\Admin\SettingsController::class, 'update'])->name('settings.update');
    Route::resource('events', \App\Http\Controllers\Admin\EventController::class);
    Route::resource('partners', \App\Http\Controllers\Admin\PartnerController::class)->except(['create', 'show', 'edit']);
    
    Route::get('/finance', [\App\Http\Controllers\Admin\FinanceController::class, 'index'])->name('finance.index');
    Route::post('/finance/{registration}/approve', [\App\Http\Controllers\Admin\FinanceController::class, 'approve'])->name('finance.approve');
    Route::post('/finance/{registration}/reject', [\App\Http\Controllers\Admin\FinanceController::class, 'reject'])->name('finance.reject');

    Route::get('/checkin', [\App\Http\Controllers\Admin\CheckInController::class, 'index'])->name('checkin.index');
    Route::post('/checkin', [\App\Http\Controllers\Admin\CheckInController::class, 'process'])->name('checkin.process');
    
    Route::resource('pages', \App\Http\Controllers\Admin\PageController::class)->except('show');
});

Route::get('/p/{slug}', [\App\Http\Controllers\PublicPageController::class, 'show'])->name('page.show');
Route::post('/contact', [\App\Http\Controllers\PublicContactController::class, 'store'])->name('contact.store');

require __DIR__.'/auth.php';
