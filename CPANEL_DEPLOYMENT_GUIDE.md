# Nexopay - cPanel Deployment Guide

## 1. Uploading Files
Since we are using React with Inertia.js, all frontend assets are now pre-compiled.
1. Create a ZIP file of this entire directory (excluding `/node_modules`, `/.git`, and `/.gemini`).
2. Go to your **cPanel > File Manager** and upload the ZIP file to your target directory (e.g., `public_html`).
3. Extract the ZIP file.

## 2. Database Setup
1. In cPanel, go to **MySQL Databases**.
2. Create a new Database (e.g., `nexo_db`).
3. Create a new User (e.g., `nexo_user`) with a strong password.
4. Add the User to the Database and grant **ALL PRIVILEGES**.
5. Go to **phpMyAdmin** and import your local SQL dump if you have existing data. Otherwise, you will need SSH access to run `php artisan migrate --seed` (or you can export your local DB via XAMPP phpMyAdmin and import it to cPanel phpMyAdmin).

## 3. Environment Variables (.env)
Edit the `.env` file in the cPanel File Manager and update these specific keys:

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-domain.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_cpanel_db_name
DB_USERNAME=your_cpanel_db_user
DB_PASSWORD="your_strong_password"

# Resend API
RESEND_API_KEY="re_hzd5zbwP_2doyFMBXUPBhWtTdN5w7GUEx"
MAIL_MAILER=resend
MAIL_FROM_ADDRESS="onboarding@resend.dev" # Change this to your domain later once verified in Resend
MAIL_FROM_NAME="${APP_NAME}"
```

## 4. Final Steps
If your cPanel server's document root points to `public_html`, you must make sure that it points to the `public_html/public` folder (since Laravel's entry point is in the `/public` folder). 
If you cannot change the document root, you can create a `.htaccess` file in the main directory to route all traffic to the `/public` folder:

```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^(.*)$ public/$1 [L]
</IfModule>
```
