<?php

namespace App\Listeners;

use Illuminate\Mail\Events\MessageSent;
use App\Models\EmailLog;
use Illuminate\Support\Facades\Log;

class LogSentEmail
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(MessageSent $event): void
    {
        try {
            $message = $event->message;
            
            $recipients = [];
            foreach ($message->getTo() as $address) {
                $recipients[] = $address->getAddress();
            }
            
            $subject = $message->getSubject();
            
            $type = 'automated';
            if ($message->getHeaders()->has('X-Mail-Type') && $message->getHeaders()->get('X-Mail-Type')->getBodyAsString() === 'custom') {
                $type = 'custom';
            }

            EmailLog::create([
                'recipient' => implode(', ', $recipients),
                'subject' => $subject,
                'status' => 'sent',
                'type' => $type,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to log email: ' . $e->getMessage());
        }
    }
}
