>Fork of [Blake Watson's minimal-character-sheet](https://github.com/blakewatson/minimal-character-sheet). I have swapped the Postmark API with the [Brevo API](https://github.com/getbrevo/brevo-php). 

This repo was created mostly for personal use because I wanted to use Brevo which I already had configured and because I wanted to host this service on my own homelab so that I have control over my own data. 

If using docker you will want to create a volume mapping to /var/www/html/data to ensure that accounts, and character and such persist after a reset.
