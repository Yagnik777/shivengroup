import connectMongo from "@/lib/mongodb";
import ServiceForm from "@/models/serviceform";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const getSession = async () => {
  try {
    return await getServerSession(authOptions);
  } catch (err) {
    return null;
  }
};

// 1. POST - નવી સર્વિસ બનાવવા માટે
export async function POST(req) {
  try {
    await connectMongo();
    const session = await getSession();

    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    if (!body.title || !body.price) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const newService = await ServiceForm.create({
      title: body.title,
      category: body.category,
      price: Number(body.price),
      description: body.description,
      providerName: body.providerName || session.user.name || "Unknown",
      providerMobile: body.providerMobile || "N/A",
      providerEmail: session.user.email,
    });

    return NextResponse.json({ success: true, data: newService }, { status: 201 });
  } catch (error) {
    console.error("POST ERROR:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 2. GET - ડેટા મેળવવા માટે (ફક્ત એક જ વાર રાખ્યું છે)
export async function GET(req) {
  try {
    await connectMongo();
    const session = await getSession();
    const { searchParams } = new URL(req.url);
    const getAll = searchParams.get("all");

    // જો રિક્વેસ્ટમાં ?all=true હોય (જેમ કે કાઉન્સેલિંગ પેજ પર), તો બધા ડેટા બતાવો
    if (getAll === "true") {
      const allServices = await ServiceForm.find({}).sort({ createdAt: -1 });
      return NextResponse.json({ success: true, services: allServices || [] });
    }

    // બાકીના કિસ્સામાં (Dashboard માટે), ફક્ત લોગિન યુઝરનો ડેટા બતાવો
    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const userServices = await ServiceForm.find({ providerEmail: session.user.email }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, services: userServices || [] });
  } catch (error) {
    console.error("GET ERROR:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 3. PUT - અપડેટ કરવા માટે
export async function PUT(req) {
  try {
    await connectMongo();
    const session = await getSession();

    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Service ID is required" }, { status: 400 });
    }

    const cleanedData = {
      title: updateData.title,
      category: updateData.category,
      price: Number(updateData.price),
      description: updateData.description
    };

    const updatedService = await ServiceForm.findOneAndUpdate(
      { _id: id, providerEmail: session.user.email },
      { $set: cleanedData },
      { new: true }
    );

    if (!updatedService) {
      return NextResponse.json({ success: false, error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updatedService });
  } catch (error) {
    console.error("PUT ERROR:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// 4. DELETE - ડિલીટ કરવા માટે
export async function DELETE(req) {
  try {
    await connectMongo();
    const session = await getSession();

    if (!session || !session.user?.email) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "ID required" }, { status: 400 });
    }

    const deleted = await ServiceForm.findOneAndDelete({ 
      _id: id, 
      providerEmail: session.user.email 
    });

    if (!deleted) {
      return NextResponse.json({ success: false, error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE ERROR:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}