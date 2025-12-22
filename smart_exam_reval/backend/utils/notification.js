const OneSignal = require('onesignal-node');

const client = new OneSignal.Client(
    process.env.ONESIGNAL_APP_ID,
    process.env.ONESIGNAL_API_KEY
);

/**
 * Send a push notification to a specific user (by Email acting as External ID)
 * @param {string} email - The user's email (used as External ID in OneSignal)
 * @param {string} title - Notification Title
 * @param {string} message - Notification Body
 * @param {object} data - Optional data payload
 */
const sendNotification = async (email, title, message, data = {}) => {
    if (!process.env.ONESIGNAL_APP_ID) {
        console.warn("⚠️ OneSignal Not Configured: Skipping Notification");
        return;
    }

    const notification = {
        headings: { en: title },
        contents: { en: message },
        // Target specific user by External ID (Email)
        include_external_user_ids: [email],
        data: data,
        // Web Push specific settings
        url: process.env.FRONT_URL + '/student/dashboard'
    };

    try {
        const response = await client.createNotification(notification);
        console.log(` Notification Sent to ${email}: ${response.body.id}`);
        return response.body;
    } catch (e) {
        if (e instanceof OneSignal.HTTPError) {
            console.error(" OneSignal Error:", e.statusCode, e.body);
        } else {
            console.error(" Notification Failed:", e);
        }
    }
};

module.exports = sendNotification;
