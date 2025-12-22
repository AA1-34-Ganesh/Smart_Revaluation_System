const { supabase } = require("../config/supabaseClient");

/* 
 * PUBLIC CONTROLLER
 * Handles unauthenticated requests with strict privacy filters.
 */

exports.getPublicStatus = async (req, res) => {
    const { applicationId } = req.params;

    try {

        // Using Admin connection inside controller (safe on server) to fetch name
        const { createClient } = require('@supabase/supabase-js');
        const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

        const { data: request, error } = await supabaseAdmin
            .from('revaluation_requests')
            .select(`
                id,
                status,
                created_at,
                subject_id,
                student_id,
                subjects ( code, name ),
                users ( full_name ) 
            `)
            .eq('id', applicationId)
            .single();

        if (error || !request) {
            return res.status(404).json({ error: "Application not found" });
        }

        // 2. Privacy Masking Logic (Mask PII)
        const studentName = request.users?.full_name || "Unknown Student";
        const maskedName = maskName(studentName);

        // 3. Construct Safe Response
        // DO NOT include student_id, user email, or internal metadata.
        const responseData = {
            id: request.id,
            status: request.status, // e.g., 'processing', 'published'
            application_date: request.created_at,
            masked_name: maskedName,
            subject_code: request.subjects?.code || "SUB-XXX",
            subject_name: request.subjects?.name || "Unknown Subject"
        };

        return res.json(responseData);

    } catch (error) {
        console.error("Public Status Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

/**
 * Helper: Masks a full name.
 * "Ganesh Kumar" -> "G***** K****"
 * "John" -> "J***"
 */
function maskName(fullName) {
    if (!fullName) return "Unknown";
    return fullName.replace(/\b(\w)(\w+)/g, (match, firstChar, rest) => {
        return firstChar + '*'.repeat(rest.length);
    });
}
