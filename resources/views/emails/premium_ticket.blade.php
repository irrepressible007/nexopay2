<x-mail::message>
# Registration Approved!

Hi {{ $registration->user->name }},

Great news! Your payment for **{{ $registration->event->title }}** has been verified and your registration is now approved.

**Role:** {{ $registration->role->name }}
**Transaction ID:** {{ $registration->bkash_txid }}

Here is your **Premium Ticket**. Please keep this QR Code ready for check-in at the event entrance.

<div style="text-align: center; margin: 30px 0;">
    <!-- In a real app we'd generate a real QR image, but we can use a free QR API for the UUID -->
    <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data={{ $registration->qr_uuid }}" alt="Your QR Ticket" style="border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <br><br>
    <small>Ticket ID: {{ $registration->qr_uuid }}</small>
</div>

<x-mail::button :url="route('dashboard')">
View Dashboard
</x-mail::button>

See you at the event!<br>
{{ config('app.name') }}
</x-mail::message>
