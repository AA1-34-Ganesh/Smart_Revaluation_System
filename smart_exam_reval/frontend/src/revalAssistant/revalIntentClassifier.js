// src/revalAssistant/revalIntentClassifier.js

import { ROLES } from "./revalAssistantConfig";

export async function classifyIntent(message, role) {
  const text = message.toLowerCase();

  // 1) Detect role if not chosen
  if (!role) {
    if (text.includes("student")) return "role_student";
    if (text.includes("teacher")) return "role_teacher";
  }

  // 2) Shared Intents (AI, General Help)
  if (
    text.includes("ai") ||
    text.includes("vision") ||
    text.includes("grading") ||
    text.includes("gemini") ||
    text.includes("how it works")
  ) {
    return "ai_grading_info";
  }

  // 3) Student intents
  if (role === ROLES.STUDENT || text.includes("student")) {
    if (text.includes("login") || text.includes("sign in") || text.includes("signup")) {
      return "student_login_help";
    }
    if (
      text.includes("missing") ||
      text.includes("subject not found") ||
      text.includes("add subject") ||
      text.includes("performance")
    ) {
      return "add_missing_subject_help";
    }
    if (
      text.includes("dashboard") ||
      text.includes("layout") ||
      text.includes("mobile") ||
      text.includes("phone")
    ) {
      return "student_dashboard_layout";
    }
    if (
      text.includes("apply") ||
      text.includes("reval") ||
      text.includes("form")
    ) {
      return "student_apply_revaluation";
    }
    if (
      text.includes("status") ||
      text.includes("track") ||
      text.includes("check") ||
      text.includes("application")
    ) {
      return "student_check_status_dynamic";
    }
    if (text.includes("pay") || text.includes("fee") || text.includes("cost")) {
      return "payment_help";
    }
  }

  // 4) Teacher intents
  if (role === ROLES.TEACHER || text.includes("teacher")) {
    if (text.includes("login") || text.includes("sign in")) {
      return "teacher_login_help";
    }
    if (
      text.includes("key") ||
      text.includes("answer") ||
      text.includes("upload") ||
      text.includes("solution")
    ) {
      return "teacher_upload_key_help";
    }
    if (
      text.includes("match") ||
      text.includes("assign") ||
      text.includes("allocation") ||
      text.includes("my subject")
    ) {
      return "smart_matching_info";
    }
    if (text.includes("dashboard") || text.includes("screen")) {
      return "teacher_dashboard_layout";
    }
    if (
      text.includes("view") ||
      text.includes("request") ||
      text.includes("list")
    ) {
      return "teacher_view_requests";
    }
    if (
      text.includes("update") ||
      text.includes("publish") ||
      text.includes("approve") ||
      text.includes("reject")
    ) {
      return "teacher_update_status";
    }
  }

  // 5) Fallback General
  if (text.includes("pay") || text.includes("fee")) {
    return "payment_help";
  }

  return "fallback";
}
