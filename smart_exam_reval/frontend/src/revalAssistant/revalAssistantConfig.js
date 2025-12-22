// src/revalAssistant/revalAssistantConfig.js

export const ROLES = {
  STUDENT: "student",
  TEACHER: "teacher",
};

export const QUICK_REPLIES = {
  INITIAL: [
    { label: "I am a Student", payload: "role_student" },
    { label: "I am a Teacher", payload: "role_teacher" },
  ],
  STUDENT: [
    { label: "AI Grading Info", payload: "ai_grading_info" },
    { label: "Add Missing Subject", payload: "add_missing_subject_help" },
    { label: "Dashboard Overview", payload: "student_dashboard_layout" },
    { label: "Apply for Revaluation", payload: "student_apply_revaluation" },
    { label: "Track My Application", payload: "student_check_status_dynamic" },
  ],
  TEACHER: [
    { label: "Upload Answer Key", payload: "teacher_upload_key_help" },
    { label: "Smart Matching", payload: "smart_matching_info" },
    { label: "AI Grading Info", payload: "ai_grading_info" },
    { label: "Dashboard Overview", payload: "teacher_dashboard_layout" },
    { label: "Update Status", payload: "teacher_update_status" },
  ],
};

export function getAssistantReplyByPayload(payload, role) {
  switch (payload) {
    // ROLE SELECTION
    case "role_student":
      return {
        text:
          "Welcome, Student! 🎓\n\n" +
          "I can assist you with:\n" +
          "• **AI-Powered Revaluation** \n" +
          "• Applying for subjects (even missing ones)\n" +
          "• Tracking status in real-time\n" +
          "• Understanding your AI Score\n\n" +
          "Select a quick option below or ask me anything!",
        role: ROLES.STUDENT,
      };

    case "role_teacher":
      return {
        text:
          "Welcome, Professor! \n\n" +
          "I can help you with:\n" +
          "• **Smart Matching**: Auto-assigning requests\n" +
          "• **Answer Key Uploads**: Auto-processing PDFs\n" +
          "• **AI Grading**: Reviewing and publishing scores\n\n" +
          "How can I assist your workflow today?",
        role: ROLES.TEACHER,
      };

    // SHARED FLOWS
    case "ai_grading_info":
      return {
        text:
          " **ReValuate AI Engine**\n\n" +
          "We use Google's **Gemini 1.5 Flash Vision** model to grade answer scripts.\n\n" +
          "**How it works:**\n" +
          "1. Answer scripts are uploaded as PDFs and converted to images.\n" +
          "2. The AI compares student answers against the Teacher's uploaded **Answer Key**.\n" +
          "3. It generates a score (0-100) and detailed feedback (Strong/Weak points).\n" +
          "4. Teachers review the AI score before publishing it to you.",
      };

    // STUDENT FLOWS
    case "student_login_help":
      return {
        text:
          " **Student Access**\n\n" +
          "1. Click the **Login** button in the top right.\n" +
          "2. Select 'Student' as your role.\n" +
          "3. Enter your credentials. If you're new, click **Sign up** to create an account.\n\n" +
          "Once logged in, you'll be directed to your personal dashboard.",
      };

    case "add_missing_subject_help":
      return {
        text:
          " **Missing a Subject?**\n\n" +
          "If your subject isn't listed in 'Academic Performance':\n" +
          "1. Click the **+ Add Missing Subject** button on your dashboard.\n" +
          "2. Enter the Subject Code, Name, and Marks details.\n" +
          "3. It will instantly appear in your list, ready for revaluation application!",
      };

    case "student_dashboard_layout":
      return {
        text:
          " **Fully Responsive Dashboard**\n\n" +
          "Your dashboard works on Mobile, Tablet, and Desktop!\n\n" +
          "**Key Features:**\n" +
          "• **Grid Layout**: Responsive stats cards.\n" +
          "• **Mobile Menu**: Access everything via the top hamburger menu.\n" +
          "• **Scrollable Tables**: Swipe left/right to view detailed tables on small screens.",
      };

    case "student_apply_revaluation":
      return {
        text:
          " **Applying for Revaluation**\n\n" +
          "It's a simple process:\n" +
          "1. Navigate to the **Revaluation** tab or click 'Apply Reval' on a subject.\n" +
          "2. Review the fees (calculated automatically).\n" +
          "3. Click **Proceed to Payment**.\n" +
          "4. Once paid, your request is sent to the relevant department immediately.",
      };

    case "student_check_status_dynamic":
      // This response is a placeholder. The widget will intercept this payload
      // and fetch real data if the user is logged in.
      return {
        text: "Let me check your application status... 🔍",
        requiresAuth: true, // Custom flag to indicate this needs user data
      };

    case "payment_help":
      return {
        text: " **Payment Information**\n\n" +
          "We support secure payments via credit/debit cards and UPI.\n" +
          "• Fees are calculated per subject.\n" +
          "• You will receive a receipt via email immediately after success.\n" +
          "• If a payment fails, any deducted amount is usually refunded within 5-7 business days.",
      };

    // TEACHER FLOWS
    case "teacher_login_help":
      return {
        text:
          " **Teacher Access**\n\n" +
          "1. Click **Login** and select 'Teacher'.\n" +
          "2. Use your faculty credentials.\n" +
          "3. New teachers may need admin approval or can sign up if enabled.\n\n" +
          "Issues logging in? Contact the exam cell administrator.",
      };

    case "teacher_upload_key_help":
      return {
        text:
          " **Uploading Answer Keys**\n\n" +
          "1. Go to the **Answer Keys** tab.\n" +
          "2. Enter the **Subject Code** (e.g., CS101).\n" +
          "3. Upload the Answer Key **PDF**.\n\n" +
          "The system will process it for AI grading. Ensure the PDF is clear and readable!",
      };

    case "smart_matching_info":
      return {
        text:
          " **Smart Matching System**\n\n" +
          "ReValuate automatically assigns incoming requests to you based on:\n" +
          "1. **Subject Code**: Matches your specialization.\n" +
          "2. **Department**: Ensures cross-department security.\n\n" +
          "You will mainly see requests relevant to your field in the 'My Subjects' tab.",
      };

    case "teacher_dashboard_layout":
      return {
        text:
          " **Professor Power-Station**\n\n" +
          "Designed for productivity on any device:\n" +
          "• **Collapsible Sidebar**: More screen real estate for grading.\n" +
          "• **Split-View Grading**: On Desktop, view Answer Script & Scorecard side-by-side.\n" +
          "• **Smart Stats**: Track your 'My Subjects' vs Global requests.",
      };

    case "teacher_view_requests":
      return {
        text:
          " **Managing Requests**\n\n" +
          "Go to the **Revaluation** tab to see all requests.\n" +
          "You can filter by:\n" +
          "• **My Subjects**: Requests matching your expertise.\n" +
          "• **Status**: Pending, Processing, Completed.",
      };

    case "teacher_update_status":
      return {
        text:
          " **Updating Status**\n\n" +
          "1. Locate the student request.\n" +
          "2. Click the **Camera Icon** 📷 to open the Grading Workspace.\n" +
          "3. Review the AI Score and Feedback.\n" +
          "4. Click **Publish Result** to notify the student instantly!",
      };

    default:
      return {
        text:
          "I'm here to help! You can ask me about:\n" +
          "• AI Grading & Vision\n" +
          "• Mobile Dashboard Features\n" +
          "• Smart Subject Matching\n" +
          "• Revaluation Process\n\n" +
          "Or use the quick buttons below.",
      };
  }
}
