<x-mail::message>
# Registration Issue

Hi {{ $registration->user ? $registration->user->name : $registration->guest_name }},

We encountered an issue while verifying your payment for **{{ $registration->event->title }}**.

Our finance team was unable to verify the bKash Transaction ID you provided: **{{ $registration->bkash_txid }}**. 

Your registration status has been marked as **Rejected**.

If you believe this is a mistake, or if you need to provide a new Transaction ID, please contact our support team.

<x-mail::button :url="route('dashboard')">
View Dashboard
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
