const { Pool } = require("pg");
const path = require("path");
const fs = require("fs");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

const hardenDatabase = async () => {
    try {
        console.log(" Starting Database Hardening...\n");

        // Read the SQL file
        const sqlPath = path.join(__dirname, "database_hardening.sql");
        const sql = fs.readFileSync(sqlPath, "utf8");

        // Split by semicolons to execute statement by statement
        const statements = sql
            .split(";")
            .map(s => s.trim())
            .filter(s => s.length > 0 && !s.startsWith("--") && !s.startsWith("NOTIFY"));

        console.log(` Found ${statements.length} SQL statements to execute\n`);

        let successCount = 0;
        let skipCount = 0;

        for (const [index, statement] of statements.entries()) {
            try {
                // Skip comments and verification queries for now
                if (statement.includes("SELECT") && statement.includes("FROM pg_")) {
                    skipCount++;
                    continue;
                }

                await pool.query(statement);
                successCount++;

                // Show progress
                if (statement.includes("ALTER TABLE")) {
                    const match = statement.match(/ALTER TABLE (\w+)/);
                    if (match) console.log(`   Updated table: ${match[1]}`);
                } else if (statement.includes("CREATE INDEX")) {
                    const match = statement.match(/CREATE INDEX.*?(\w+) ON/);
                    if (match) console.log(`   Created index: ${match[1]}`);
                } else if (statement.includes("CREATE TRIGGER")) {
                    const match = statement.match(/CREATE TRIGGER (\w+)/);
                    if (match) console.log(`   Created trigger: ${match[1]}`);
                }

            } catch (err) {
                // Some statements might fail if already exist - that's okay
                if (err.message.includes("already exists") ||
                    err.message.includes("duplicate") ||
                    err.message.includes("does not exist")) {
                    skipCount++;
                    // console.log(`    Skipped (already exists): Statement ${index + 1}`);
                } else {
                    console.error(`  Error on statement ${index + 1}:`, err.message);
                }
            }
        }

        console.log(`\n Execution Summary:`);
        console.log(`    Success: ${successCount}`);
        console.log(`     Skipped: ${skipCount}`);

        // Now run verification queries
        console.log("\n🔍 Verifying changes...\n");

        // Check constraints
        console.log("1. Checking Constraints:");
        const constraints = await pool.query(`
            SELECT conname, contype, pg_get_constraintdef(oid) as definition
            FROM pg_constraint
            WHERE conrelid IN ('users'::regclass, 'marks'::regclass)
            AND contype IN ('c', 'u')
            ORDER BY conrelid, contype;
        `);
        console.table(constraints.rows.slice(0, 10));

        // Check audit columns
        console.log("\n2. Checking Audit Columns in users:");
        const auditCols = await pool.query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_name = 'users'
            AND column_name IN ('updated_at', 'last_login', 'is_active')
            ORDER BY column_name;
        `);
        console.table(auditCols.rows);

        // Check indexes
        console.log("\n3. Checking Indexes:");
        const indexes = await pool.query(`
            SELECT tablename, indexname
            FROM pg_indexes
            WHERE schemaname = 'public'
            AND tablename IN ('users', 'marks', 'revaluation_requests')
            AND indexname LIKE 'idx_%'
            ORDER BY tablename, indexname;
        `);
        console.table(indexes.rows);

        console.log("\n  Database Hardening Complete!");

    } catch (err) {
        console.error("\n  Hardening Failed:");
        console.error(err);
    } finally {
        pool.end();
    }
};

hardenDatabase();
