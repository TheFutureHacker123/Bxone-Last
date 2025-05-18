<?php


namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class RawHtmlMail extends Mailable
{
    use Queueable, SerializesModels;

    protected $subjectLine;
    protected $htmlContent;

    public function __construct($subjectLine, $htmlContent)
    {
        $this->subjectLine = $subjectLine;
        $this->htmlContent = $htmlContent;
    }

    public function build()
    {
        return $this->subject($this->subjectLine)
                    ->html($this->htmlContent);
    }
}
