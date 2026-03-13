import mongoose from "mongoose";

// ૧. સબસ્ક્રાઇબર્સ લિસ્ટ
const SubscriberSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, default: "User" },
  status: { type: String, enum: ["active", "unsubscribed"], default: "active" },
}, { timestamps: true });

// ૨. મેઈલ ટેમ્પલેટ્સ
const TemplateSchema = new mongoose.Schema({
  title: String,
  subject: String,
  content: String, // HTML Content
}, { timestamps: true });

export const Subscriber = mongoose.models.Subscriber || mongoose.model("Subscriber", SubscriberSchema);
export const MailTemplate = mongoose.models.MailTemplate || mongoose.model("MailTemplate", TemplateSchema);