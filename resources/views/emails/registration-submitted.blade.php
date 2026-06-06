<!DOCTYPE html>
<html>
<head>
    <title>Registration Received</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
    <div style="max-w: 600px; margin: 0 auto; background: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <h2 style="color: #4f46e5;">Registration Received</h2>
        <p>Hi {{ $registration->user ? $registration->user->name : $registration->guest_name }},</p>
        <p>Thank you for registering for <strong>{{ $registration->event->title }}</strong>.</p>
        <p>We have successfully received your registration details. Your current status is <strong>Pending Approval</strong>.</p>
        <p>If you made a payment via bKash, our finance team will verify the Transaction ID (<strong>{{ $registration->bkash_txid }}</strong>) and approve your registration soon.</p>
        <p>Once approved, you will receive another email containing your official ticket.</p>
        <br>
        <p>Thank you,<br>The {{ config('app.name', 'Nexopay') }} Team</p>
    </div>
</body>
</html>
