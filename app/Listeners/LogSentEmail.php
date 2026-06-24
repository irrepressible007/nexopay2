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

            $senderId = null;
            if ($message->getHeaders()->has('X-Sender-Id')) {
                $senderId = $message->getHeaders()->get('X-Sender-Id')->getBodyAsString();
            }

            $parentId = null;
            if ($message->getHeaders()->has('X-Parent-Id')) {
                $parentId = $message->getHeaders()->get('X-Parent-Id')->getBodyAsString();
            }

            $htmlBody = $message->getHtmlBody();
            if (!$htmlBody) {
                $htmlBody = $message->getTextBody();
            }

            EmailLog::create([
                'recipient' => implode(', ', $recipients),
                'sender_id' => $senderId,
                'parent_id' => $parentId,
                'subject' => $subject,
                'body' => $htmlBody,
                'status' => 'sent',
                'type' => $type,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to log email: ' . $e->getMessage());
        }
    }
}
