<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Headers;

class CustomAdminMail extends Mailable
{
    use Queueable, SerializesModels;

    public $subjectLine;
    public $messageBody;
    public $fromAddress;
    public $senderId;
    public $parentId;

    /**
     * Create a new message instance.
     */
    public function __construct($subjectLine, $messageBody, $fromAddress = 'support@nexopay.com.bd', $senderId = null, $parentId = null)
    {
        $this->subjectLine = $subjectLine;
        $this->messageBody = $messageBody;
        $this->fromAddress = $fromAddress;
        $this->senderId = $senderId;
        $this->parentId = $parentId;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            from: new Address($this->fromAddress, config('app.name')),
            subject: $this->subjectLine,
        );
    }

    /**
     * Get the message headers.
     */
    public function headers(): Headers
    {
        $headers = [
            'X-Mail-Type' => 'custom',
        ];

        if ($this->senderId) {
            $headers['X-Sender-Id'] = (string) $this->senderId;
        }

        if ($this->parentId) {
            $headers['X-Parent-Id'] = (string) $this->parentId;
        }

        return new Headers(
            text: $headers,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.custom-admin',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
