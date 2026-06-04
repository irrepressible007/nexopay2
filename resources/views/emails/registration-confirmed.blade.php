<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Registration Confirmed</title>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f5; margin: 0; padding: 0; color: #18181b; }
        .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
        .header { background-color: #4f46e5; color: #ffffff; padding: 40px 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; font-weight: 800; }
        .content { padding: 40px 30px; }
        .greeting { font-size: 18px; margin-bottom: 20px; font-weight: 600; }
        .details-box { background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin-bottom: 30px; }
        .detail-row { margin-bottom: 10px; }
        .detail-label { font-weight: 600; color: #4b5563; }
        .detail-value { color: #111827; }
        .qr-section { text-align: center; margin-top: 40px; padding-top: 30px; border-top: 1px solid #e5e7eb; }
        .qr-code { margin: 20px auto; padding: 20px; background-color: white; border: 2px dashed #4f46e5; border-radius: 16px; display: inline-block; }
        .qr-help { font-size: 14px; color: #6b7280; }
        .footer { background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>{{ $registration->event->title }}</h1>
            <p style="margin-top: 10px; opacity: 0.9;">Registration Confirmed</p>
        </div>
        
        <div class="content">
            <div class="greeting">
                Hello {{ $registration->user ? $registration->user->name : $registration->guest_name }},
            </div>
            <p>Your registration and payment have been successfully verified by our finance team. You are officially on the guest list!</p>
            
            <div class="details-box">
                <div class="detail-row">
                    <span class="detail-label">Role:</span>
                    <span class="detail-value">{{ $registration->role->name }}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Total Paid:</span>
                    <span class="detail-value">৳{{ $registration->payable_amount }}</span>
                </div>
                @if($registration->event->start_date)
                <div class="detail-row">
                    <span class="detail-label">Date:</span>
                    <span class="detail-value">{{ \Carbon\Carbon::parse($registration->event->start_date)->format('F j, Y g:i A') }}</span>
                </div>
                @endif
            </div>

            @if(count($registration->selected_segments) > 0)
                <h3 style="margin-bottom: 15px; color: #1f2937;">Your Segments</h3>
                <ul style="margin-top: 0; padding-left: 20px; color: #374151; line-height: 1.6;">
                    @foreach($registration->event->segments as $seg)
                        @if(isset($registration->selected_segments[$seg['id']]))
                            @php $selection = $registration->selected_segments[$seg['id']]; @endphp
                            @if(isset($seg['pricing_mode']) && $seg['pricing_mode'] === 'global')
                                @if($selection === true)
                                    <li>{{ $seg['title'] }}</li>
                                @endif
                            @else
                                @if(is_array($selection))
                                    @foreach($selection as $subId)
                                        @php
                                            $sub = collect($seg['sub_segments'] ?? [])->firstWhere('id', $subId);
                                        @endphp
                                        @if($sub)
                                            <li>{{ $seg['title'] }} - {{ $sub['title'] }}</li>
                                        @endif
                                    @endforeach
                                @else
                                    @php
                                        $sub = collect($seg['sub_segments'] ?? [])->firstWhere('id', $selection);
                                    @endphp
                                    @if($sub)
                                        <li>{{ $seg['title'] }} - {{ $sub['title'] }}</li>
                                    @endif
                                @endif
                            @endif
                        @endif
                    @endforeach
                </ul>
            @endif

            <div class="qr-section">
                <h2 style="margin: 0; color: #111827;">Your Entrance Ticket</h2>
                <p class="qr-help">Please present this QR code at the entrance for scanning.</p>
                
                <div class="qr-code">
                    <img src="{!! $message->embedData(SimpleSoftwareIO\QrCode\Facades\QrCode::format('png')->size(250)->generate($registration->qr_uuid), 'ticket-qr.png') !!}" alt="Entrance QR Code">
                </div>
                
                <p style="font-family: monospace; font-size: 14px; background: #f3f4f6; padding: 10px; border-radius: 6px; color: #4b5563; display: inline-block;">
                    {{ $registration->qr_uuid }}
                </p>
            </div>
        </div>
        
        <div class="footer">
            &copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.
        </div>
    </div>
</body>
</html>
