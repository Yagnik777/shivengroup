import connectMongo from "@/lib/mongodb";
import Notification from "@/models/Notification";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

async function getSessionSafe() {
  try {
    const session = await getServerSession(authOptions);
    return session || null;
  } catch (err) {
    console.error("getServerSession error:", err);
    return null;
  }
}

// ======================================================
// ✅ GET — Fetch Notifications (Broadcast + User-specific)
// ======================================================
export async function GET() {
  try {
    await connectMongo();
    const session = await getSessionSafe();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    const userId = new mongoose.Types.ObjectId(session.user.id);

    // FINAL FIXED FETCH LOGIC
    const notifications = await Notification.find({
      $or: [
        { user: userId },  // User-specific
        { user: null }     // Broadcast
      ],
    })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, notifications });
  } catch (err) {
    console.error("GET notifications error:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

// ======================================================
// ✅ PATCH — Mark ALL notifications as read
// ======================================================
export async function PATCH() {
  try {
    await connectMongo();
    const session = await getSessionSafe();

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    const userId = new mongoose.Types.ObjectId(session.user.id);

    await Notification.updateMany(
      {
        $or: [
          { user: userId },
          { user: null },
        ],
      },
      { $set: { read: true } }
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PATCH notifications error:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}

// ======================================================
// ✅ POST — Create Notification
// 1) Broadcast
// 2) Multiple users
// 3) Single user
// ======================================================
export async function POST(req) {
  try {
    await connectMongo();

    const session = await getSessionSafe();
    if (!session) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    const { userId, userIds, title, message, broadcast } = await req.json();

    if (!message) {
      return NextResponse.json(
        { success: false, message: "Message is required" },
        { status: 400 }
      );
    }

    // --------------------------------------
    // 🔹 1) Broadcast to ALL users (FIXED)
    // --------------------------------------
    if (broadcast) {
      await Notification.create({
        user: null,                 // FIXED: Broadcast stored as null
        title: title || "Admin Broadcast",
        message,
      });

      return NextResponse.json({
        success: true,
        message: "✅ Broadcast sent to all users",
      });
    }

    // --------------------------------------
    // 🔹 2) Multiple users
    // --------------------------------------
    if (Array.isArray(userIds) && userIds.length > 0) {
      const data = userIds.map((id) => ({
        user: new mongoose.Types.ObjectId(id),
        title: title || "Notification",
        message,
      }));

      await Notification.insertMany(data);

      return NextResponse.json({
        success: true,
        message: `✅ Sent to ${userIds.length} users.`,
      });
    }

    // --------------------------------------
    // 🔹 3) Single user
    // --------------------------------------
    if (userId) {
      await Notification.create({
        user: new mongoose.Types.ObjectId(userId),
        title: title || "Notification",
        message,
      });

      return NextResponse.json({
        success: true,
        message: "✅ Notification sent.",
      });
    }

    // --------------------------------------
    // ❌ No valid target
    // --------------------------------------
    return NextResponse.json(
      { success: false, message: "No valid target provided" },
      { status: 400 }
    );
  } catch (err) {
    console.error("POST notifications error:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
