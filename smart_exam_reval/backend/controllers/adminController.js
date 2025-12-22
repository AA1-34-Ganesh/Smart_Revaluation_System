const { createClient } = require('@supabase/supabase-js');
const pool = require('../config/db'); // If you need direct DB access, though supabase-js might suffice

// Initialize Supabase Admin Client
// MUST use SERVICE_ROLE_KEY for admin actions like createUser
const supabaseAdmin = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY // Fallback (warning: anon key can't create users usually)
);

exports.createTeacher = async (req, res) => {
    const { email, password, full_name, department } = req.body;

    if (!email || !password || !full_name || !department) {
        return res.status(400).json({ error: "All fields are required" });
    }

    try {
        // 1. Create Auth User
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email: email,
            password: password,
            email_confirm: true, // Auto-confirm
            user_metadata: {
                full_name: full_name,
                role: 'teacher',
                department: department
            }
        });

        if (authError) throw authError;

        const userId = authData.user.id;

        // 2. Insert into public.users table (if not handled by Trigger)
        // Note: If you have a Trigger on auth.users -> public.users, this might be redundant or cause conflict.
        // However, the prompt asks to insert into public.users. 
        // Best practice: Update the record created by trigger OR insert if no trigger.
        // Let's assume standard upsert to be safe.

        // We use the admin client to bypass RLS for this insertion if needed.
        const { error: dbError } = await supabaseAdmin
            .from('users')
            .upsert({
                id: userId,
                email: email,
                full_name: full_name,
                department: department,
                role: 'teacher'
            });

        if (dbError) throw dbError;

        // 3. Add to 'allowed_teachers' whitelist (optional, based on previous context)
        const { error: whitelistError } = await supabaseAdmin
            .from('allowed_teachers')
            .insert([{ email: email }])
            .select();

        // Ignore duplicate key error for whitelist just in case
        if (whitelistError && whitelistError.code !== '23505') {
            console.warn("Whitelist insertion warning:", whitelistError.message);
        }

        res.status(201).json({ message: "Teacher account created successfully!", user: authData.user });

    } catch (error) {
        console.error("Create Teacher Error:", error);
        res.status(500).json({ error: error.message });
    }
};
