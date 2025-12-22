const { Pool } = require("pg");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const enableIDs = async () => {
    try {
        console.log("Enabling Row Level Security (RLS) Policies...");

        // 1. Enable RLS on all tables
        const tables = ['users', 'marks', 'revaluation_requests', 'answer_keys'];
        for (const table of tables) {
            await pool.query(`ALTER TABLE public.${table} ENABLE ROW LEVEL SECURITY;`);
            console.log(` RLS Enabled on '${table}'`);
        }

        // --- USERS Policies ---
        // Users can read their own profile
        await pool.query(`
            DROP POLICY IF EXISTS "Users can read own profile" ON public.users;
            CREATE POLICY "Users can read own profile" ON public.users FOR SELECT USING (auth.uid() = id);
        `);
        // Admins/Service keys might bypass RLS, or we can add specific admin policies if needed.

        // --- MARKS Policies ---
        // Students can view their own marks
        await pool.query(`
            DROP POLICY IF EXISTS "Students view own marks" ON marks;
            CREATE POLICY "Students view own marks" ON marks FOR SELECT USING (auth.uid() = student_id);
        `);

        // --- REVALUATION REQUESTS Policies ---
        // Students can view/insert own requests
        await pool.query(`
            DROP POLICY IF EXISTS "Students view own requests" ON revaluation_requests;
            CREATE POLICY "Students view own requests" ON revaluation_requests FOR SELECT USING (auth.uid() = student_id);

            DROP POLICY IF EXISTS "Students insert own requests" ON revaluation_requests;
            CREATE POLICY "Students insert own requests" ON revaluation_requests FOR INSERT WITH CHECK (auth.uid() = student_id);
        `);

        // Teachers can view assigned requests
        await pool.query(`
            DROP POLICY IF EXISTS "Teachers view assigned requests" ON revaluation_requests;
            CREATE POLICY "Teachers view assigned requests" ON revaluation_requests FOR SELECT USING (auth.uid() = teacher_id);
        `);

        // --- ANSWER KEYS Policies ---
        // Teachers can manage their own keys
        await pool.query(`
            DROP POLICY IF EXISTS "Teachers manage own keys" ON answer_keys;
            CREATE POLICY "Teachers manage own keys" ON answer_keys FOR ALL USING (auth.uid() = teacher_id);
        `);

        console.log(" All Security Policies Applied Successfully!");

    } catch (err) {
        console.error(" RLS Setup Failed:", err);
    } finally {
        pool.end();
    }
};

enableIDs();
