<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Laravel') }}</title>
        <meta name="csrf-token" content="{{ csrf_token() }}">

        <!-- Fonts -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">

        <!-- Theme Variables -->
        @php
            $primaryColor = \Illuminate\Support\Facades\DB::table('site_settings')->where('key', 'primary_color')->value('value') ?? '#4f46e5';
            $lightColor = $primaryColor; // Fallback or generate a lighter shade if needed
            $darkColor = $primaryColor; // Fallback or generate a darker shade if needed
        @endphp
        <style>
            :root {
                --brand-color: {{ $primaryColor }};
                --brand-light: {{ $primaryColor }};
                --brand-dark: {{ $primaryColor }};
            }
        </style>

        <!-- Scripts -->
        <script>
            window.onerror = function(msg, url, lineNo, columnNo, error) {
                var div = document.createElement('div');
                div.style.position = 'absolute';
                div.style.top = '0';
                div.style.left = '0';
                div.style.width = '100%';
                div.style.backgroundColor = 'red';
                div.style.color = 'white';
                div.style.padding = '20px';
                div.style.zIndex = '999999';
                div.innerHTML = 'JS Error: ' + msg + '<br>Line: ' + lineNo + '<br>URL: ' + url;
                if (error && error.stack) {
                    div.innerHTML += '<pre style="margin-top:10px;font-size:12px">' + error.stack + '</pre>';
                }
                document.body.appendChild(div);
                return false;
            };
            window.addEventListener('unhandledrejection', function(event) {
                var div = document.createElement('div');
                div.style.position = 'absolute';
                div.style.top = '0';
                div.style.left = '0';
                div.style.width = '100%';
                div.style.backgroundColor = 'darkred';
                div.style.color = 'white';
                div.style.padding = '20px';
                div.style.zIndex = '999999';
                div.innerHTML = 'Unhandled Promise Rejection: ' + (event.reason ? event.reason.message : 'Unknown');
                if (event.reason && event.reason.stack) {
                    div.innerHTML += '<pre style="margin-top:10px;font-size:12px">' + event.reason.stack + '</pre>';
                }
                document.body.appendChild(div);
            });
        </script>
        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
