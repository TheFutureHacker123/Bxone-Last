<?php

return [

    'paths' => ['api/*', 'vendor/*', 'sanctum/csrf-cookie'], // added vendor/*

    'allowed_methods' => ['*'],
    'allowed_origins' => ['*'],
    
    // 'allowed_origins' => ['http://localhost:3000'], // safer, only allow your frontend

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,

];
