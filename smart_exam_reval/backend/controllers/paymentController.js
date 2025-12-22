const crypto = require("crypto");
const { supabase } = require("../config/supabaseClient"); // Standard client for now, or use admin if needed for specific logic

/**
 * MOCK Payment Controller
 * Handles secure payment state transitions without a real gateway.
 */

// 1. Create Mock Payment Intent (Optional step in real flow, essentially "prepare checkout")
exports.createPaymentIntent = async (req, res) => {
  // In a real Stripe app, this would return a Client Secret.
  // Here we just return a success signal to ID the transaction.
  const transactionId = crypto.randomUUID();

  res.json({
    clientSecret: `mock_secret_${transactionId}`,
    transactionId
  });
};

// 2. Confirm Payment Logic
exports.confirmPayment = async (req, res) => {
  const { request_id } = req.body;

  // Validate Input
  if (!request_id) {
    return res.status(400).json({ error: "Missing request_id" });
  }

  try {
    // A. Idempotency Check
    // Ensure this request hasn't already been paid to prevent double-charging logic.
    const { data: existingRequest, error: fetchError } = await supabase
      .from('revaluation_requests')
      .select('payment_status')
      .eq('id', request_id)
      .single();

    if (fetchError) throw fetchError;

    if (existingRequest.payment_status === 'paid') {
      return res.status(400).json({ error: "This request is already paid." });
    }

    // B. Generate Unique Transaction ID
    // Uses crypto.randomUUID() for collision resistance.
    const paymentRef = `txn_${crypto.randomUUID()}`;

    // C. Update Database
    // Set status to 'submitted' (or 'processing' if auto-start) and payment_status to 'paid'.
    const { data, error } = await supabase
      .from('revaluation_requests')
      .update({
        payment_status: 'paid',
        payment_id: paymentRef,
        status: 'submitted', // Move to submitted state
        updated_at: new Date()
      })
      .eq('id', request_id)
      .select();

    if (error) throw error;

    // D. Return Success
    return res.json({
      success: true,
      message: "Payment verified successfully",
      paymentRef: paymentRef,
      data: data
    });

  } catch (error) {
    console.error("Payment Confirmation Error:", error);
    return res.status(500).json({ error: "Payment verification failed" });
  }
};