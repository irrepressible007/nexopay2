<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Registration Received</title>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f5; margin: 0; padding: 0; color: #18181b; }
        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
        .header { background-color: #4f46e5; color: #ffffff; padding: 40px 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 800; }
        .content { padding: 40px 30px; }
        .greeting { font-size: 18px; margin-bottom: 20px; font-weight: 600; }
        .info-box { background-color: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; border-radius: 8px; padding: 20px; margin-bottom: 30px; font-weight: 500; }
        .payment-box { background-color: #fffbeb; border: 1px solid #fde68a; color: #92400e; border-radius: 8px; padding: 20px; margin-bottom: 30px; }
        .footer { background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>{{ $registration->event->title }}</h1>
            <p style="margin-top: 10px; opacity: 0.9;">Registration Received</p>
        </div>
        
        <div class="content">
            <div class="greeting">
                Hello {{ $registration->user ? $registration->user->name : $registration->guest_name }},
            </div>
            
            @php
                $roleName = $registration->role ? $registration->role->name : 'Participant';
            @endphp
            
            <p>Thank you for submitting your registration for <strong>{{ $registration->event->title }}</strong> as a <strong>{{ $roleName }}</strong>.</p>
            
            @if($roleName === 'Campus Ambassador')
                <div class="info-box">
                    We have received your application to become a Campus Ambassador! Our team will review your profile. You do not need to make any payment for this registration. Once reviewed, we will contact you with further details.
                </div>
            @elseif($roleName === 'Volunteer')
                <div class="info-box">
                    Thank you for applying to be a Volunteer! We have received your submission. You do not need to make any payment. Our team will review your registration and get back to you soon.
                </div>
            @else
                @if($registration->payable_amount > 0)
                    <div class="payment-box">
                        <p style="margin-top: 0;"><strong>Payment Verification Pending</strong></p>
                        <p style="margin-bottom: 0;">We have received your bKash Transaction ID (<strong>{{ $registration->bkash_txid }}</strong>) for the amount of ৳{{ $registration->payable_amount }}. Our finance team will verify the payment and officially approve your ticket soon.</p>
                    </div>
                @else
                    <div class="info-box">
                        Your free registration has been received successfully! Our team will approve it shortly and you will receive your ticket in a separate email.
                    </div>
                @endif
            @endif

            <p>If you have any questions in the meantime, feel free to contact our support team.</p>
        </div>
        
        <div class="footer">
            &copy; {{ date('Y') }} {{ config('app.name', 'Nexopay') }}. All rights reserved.
        </div>
    </div>
</body>
</html>
