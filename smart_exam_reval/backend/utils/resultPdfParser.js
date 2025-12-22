const pdf = require("pdf-parse");
const tesseract = require("tesseract.js");

// Shared logic to extract students from text
const processExtractedText = (text) => {
    console.log(` Processing Text Length: ${text.length}`);
    console.log(" First 1000 chars RAW:", JSON.stringify(text.substring(0, 1000)));
    
    // Normalize text: remove extra spaces, newlines
    const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    console.log(` Total Lines: ${lines.length}`);
    if (lines.length > 0) {
        console.log(" First 5 lines:");
        lines.slice(0, 5).forEach((l, i) => console.log(`[${i}] ${l}`));
    }

    const students = [];
    let currentStudent = null;

    // Regex patterns based on the image provided
    // RegNo: 12 digits (e.g., 231191101001)
    const regNoPattern = /(\d{12})/;
    // Subject Code: 4 letters + 5 numbers/letters (e.g., EBCC22104)
    const subjectPattern = /([A-Z]{4}[A-Z0-9]{5,6})/; 
    // Grade: S, A, B, C, D, E, F, AB, RA, F*
    const gradePattern = /\b(H|S|A|B|C|D|E|F|AB|RA|F\*)\b/;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Check for new student line (starts with Seq No and Reg No)
        // Example: "1 231191101001 ABBAREDDY GANGADHAR RAO ..."
        const regMatch = line.match(regNoPattern);
        
        if (regMatch) {
            console.log(`Found RegNo: ${regMatch[1]} in line: ${line.substring(0, 50)}...`);
            const regNo = regMatch[1];
            
            // Split line by RegNo to find name
            const parts = line.split(regNo);
            if (parts.length > 1) {
                let remainder = parts[1].trim();
                
                // The name is the text before the first subject code
                const firstSubjectMatch = remainder.match(subjectPattern);
                let name = "Unknown";
                
                if (firstSubjectMatch) {
                    name = remainder.substring(0, firstSubjectMatch.index).trim();
                    // Clean up name (remove symbols like / if present)
                    name = name.replace(/[^a-zA-Z\s]/g, '').trim();
                }
                
                currentStudent = {
                    reg_no: regNo,
                    name: name,
                    marks: []
                };
                students.push(currentStudent);
                
                // Process the rest of the line for subjects
                extractSubjectsFromLine(remainder, currentStudent);
            }
        } else if (currentStudent) {
            // Continuation line? 
            // If the line contains subject codes but NO RegNo, it belongs to the current student.
            if (subjectPattern.test(line)) {
                // console.log(`  -> Continuation line for ${currentStudent.reg_no}`);
                extractSubjectsFromLine(line, currentStudent);
            }
        }
    }
    
    console.log(` Parsed ${students.length} students from text.`);
    if (students.length > 0) {
            console.log(`Example Student:`, JSON.stringify(students[0], null, 2));
    }
    return students;
};

function extractSubjectsFromLine(text, student) {
    // Strategy: Find all Subject-Grade pairs
    // Pattern: SubjectCode followed by Grade
    // Example: EBCC22104 C
    
    // We'll tokenize the string by spaces
    const tokens = text.split(/\s+/);
    
    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        
        // Is this a subject code?
        // Regex: Starts with 3-4 letters, followed by numbers. Length approx 8-10.
        if (/^[A-Z]{3,4}[A-Z0-9]{4,6}$/.test(token)) {
            // Look ahead for grade
            if (i + 1 < tokens.length) {
                const nextToken = tokens[i+1];
                // Is next token a grade?
                // Updated regex to include H, RA, F*
                if (/^(H|S|A|B|C|D|E|F|AB|RA|F\*)$/.test(nextToken)) {
                    student.marks.push({
                        subject_code: token,
                        grade: nextToken,
                        status: (['F', 'AB', 'RA', 'F*'].includes(nextToken)) ? 'Fail' : 'Pass'
                    });
                    i++; // Skip the grade token
                }
            }
        }
    }
}

const parseResultPDF = async (buffer) => {
    try {
        const data = await pdf(buffer);
        const text = data.text;
        
        if (text.trim().length < 50) {
            throw new Error("The uploaded PDF is a scanned image (no text found). Please convert it to an Image (JPG/PNG) or CSV and upload that.");
        }
        
        return processExtractedText(text);
    } catch (error) {
        console.error("PDF Parse Error:", error);
        throw error; // Re-throw to be caught by controller
    }
};

const parseResultImage = async (filePath) => {
    try {
        console.log(`Running Tesseract OCR on Image: ${filePath}...`);
        const { data: { text } } = await tesseract.recognize(filePath, 'eng');
        console.log(` OCR Text Length: ${text.length}`);
        return processExtractedText(text);
    } catch (error) {
        console.error("OCR Error:", error);
        throw new Error("Failed to process image. Ensure it is clear and readable.");
    }
};

module.exports = { parseResultPDF, parseResultImage };