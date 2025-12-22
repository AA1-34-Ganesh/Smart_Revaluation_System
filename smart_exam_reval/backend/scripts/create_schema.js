const { Pool } = require("pg");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false } // Required for Supabase
});

const createTables = async () => {
    try {
        console.log(" Creating Database Schema on Supabase...");

        // 1. Users Table (Mirrors Supabase Auth)
        // Note: We use UUID because Supabase Auth IDs are UUIDs.
        await pool.query(`
            CREATE TABLE IF NOT EXISTS public.users (
                id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
                full_name VARCHAR(255),
                email VARCHAR(255) UNIQUE NOT NULL,
                role VARCHAR(20) CHECK (role IN ('student', 'teacher', 'admin')),
                department VARCHAR(100),
                reg_no VARCHAR(50),
                subject_specialization VARCHAR(100),
                avatar_url TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log(" Table 'users' ready.");

        // 2. Marks Table (Linked to Users)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS marks (
                id SERIAL PRIMARY KEY,
                student_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
                subject_name VARCHAR(100),
                subject_code VARCHAR(20),
                score INTEGER,
                grade VARCHAR(20),
                status VARCHAR(20),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log("Table 'marks' ready.");

        // 3. Revaluation Requests Table
        await pool.query(`
            DROP TYPE IF EXISTS request_status;
            -- CREATE TYPE request_status AS ENUM ('draft', 'paid', 'processing', 'teacher_review', 'published', 'appealed');
            -- Note: Using VARCHAR for simplicity/compatibility if enum exists or not
            
            CREATE TABLE IF NOT EXISTS revaluation_requests (
                id SERIAL PRIMARY KEY,
                student_id UUID REFERENCES public.users(id),
                subject_id INTEGER REFERENCES marks(id),
                teacher_id UUID REFERENCES public.users(id),
                status VARCHAR(20) DEFAULT 'draft',
                payment_status VARCHAR(20) DEFAULT 'unpaid',
                stripe_payment_id VARCHAR(255),
                amount_paid DECIMAL(10, 2),
                file_url TEXT,
                ocr_data TEXT,
                ai_feedback JSONB,
                teacher_notes TEXT,
                appeal_reason TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log(" Table 'revaluation_requests' ready.");

        // 4. Answer Keys Table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS answer_keys (
                id SERIAL PRIMARY KEY,
                teacher_id UUID REFERENCES public.users(id),
                subject_code VARCHAR(50) NOT NULL,
                file_url TEXT,
                extracted_text TEXT,
                embeddings_path TEXT,
                status VARCHAR(20) DEFAULT 'pending',
                error_message TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log(" Table 'answer_keys' ready.");

        // 5. Allowed Teachers (For Pre-Approval Workflow)
        await pool.query(`
            CREATE TABLE IF NOT EXISTS public.allowed_teachers (
                email TEXT PRIMARY KEY,
                created_at TIMESTAMPTZ DEFAULT NOW()
            );
        `);
        console.log("Table 'allowed_teachers' ready.");

        console.log(" Schema Initialization Complete!");
    } catch (err) {
        console.error(" Schema Init Failed:", err);
    } finally {
        pool.end();
    }
};

createTables();
