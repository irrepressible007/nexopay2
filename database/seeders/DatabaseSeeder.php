<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        // 1. Ensure Roles
        $adminRole = \App\Models\Role::firstOrCreate(['name' => 'Admin', 'slug' => 'admin']);
        $participantRole = \App\Models\Role::firstOrCreate(['name' => 'Participant', 'slug' => 'participant']);

        // 2. Ensure Admin User
        User::firstOrCreate(
            ['email' => 'admin@nexopay.test'],
            [
                'name' => 'Super Admin',
                'password' => bcrypt('password'),
                'global_role' => 'Admin'
            ]
        );

        // 3. Seed Professional Events
        $schema = [
            ['name' => 'institution', 'label' => 'Institution Name', 'type' => 'text', 'required' => true],
            ['name' => 'tshirt_size', 'label' => 'T-Shirt Size', 'type' => 'text', 'required' => true],
            ['name' => 'dietary', 'label' => 'Dietary Restrictions', 'type' => 'text', 'required' => false]
        ];

        \App\Models\Event::firstOrCreate(
            ['slug' => 'global-tech-summit-2026'],
            [
                'title' => 'Global Tech Summit 2026',
                'description' => 'Join the brightest minds in technology for a full day of keynotes, networking, and innovation showcases. Experience the future of web and AI.',
                'status' => 'upcoming',
                'participant_price' => 500,
                'ca_price' => 300,
                'volunteer_price' => 0,
                'form_schema' => $schema
            ]
        );

        \App\Models\Event::firstOrCreate(
            ['slug' => 'leadership-conference-winter'],
            [
                'title' => 'Leadership Conference: Winter Edition',
                'description' => 'A premier gathering for industry leaders to discuss the next wave of strategic growth, organizational culture, and global scaling.',
                'status' => 'ongoing',
                'participant_price' => 1500,
                'ca_price' => 1000,
                'volunteer_price' => 500,
                'form_schema' => $schema
            ]
        );

        // 4. Seed Dynamic Pages
        \App\Models\Page::firstOrCreate(
            ['slug' => 'about-us'],
            [
                'title' => 'About Us',
                'content' => '## Who We Are

Nexopay is a revolutionary event management platform designed to simplify ticketing, payments, and attendee management. We believe in providing a seamless, premium experience for both organizers and participants.

### Our Mission
To bridge the gap between complex event logistics and seamless user experiences through cutting-edge technology and robust infrastructure.',
                'is_published' => true
            ]
        );

        \App\Models\Page::firstOrCreate(
            ['slug' => 'contact-us'],
            [
                'title' => 'Contact Us',
                'content' => '## Get In Touch

Have questions about an upcoming event? Need support with your ticket? We are here to help.

**Email:** support@nexopay.test
**Phone:** +880 1700-000000
**Address:** 123 Innovation Avenue, Tech District

Our support team is available Monday through Friday, 9:00 AM to 6:00 PM.',
                'is_published' => true
            ]
        );

        \App\Models\Page::firstOrCreate(
            ['slug' => 'what-we-do'],
            [
                'title' => 'What We Do',
                'content' => '## Our Services

At Nexopay, we handle the heavy lifting of event management so you can focus on what matters: delivering an unforgettable experience.

- **Dynamic Ticketing:** Smart role-based pricing for participants, ambassadors, and volunteers.
- **Secure Check-ins:** Lightning-fast QR code verification at the entrance.
- **Finance Hub:** Transparent bKash manual verification and premium invoice delivery.',
                'is_published' => true
            ]
        );
    }
}
