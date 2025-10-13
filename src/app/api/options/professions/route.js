// src/app/api/options/professions/route.js
import connectMongo from "@/lib/mongodb";
import Profession from "@/models/Profession";
export const dynamic = "force-dynamic";


export async function GET(req) {
  await connectMongo();
  const professions = await Profession.find().sort({ name: 1 });
  return new Response(JSON.stringify(professions.map(p => p.name)), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req) {
  await connectMongo();
  const { name } = await req.json();

  if (!name)
    return new Response(JSON.stringify({ error: "Name is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });

  const exists = await Profession.findOne({ name });
  if (exists)
    return new Response(JSON.stringify({ error: "Already exists" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });

  const profession = new Profession({ name });
  await profession.save();
  return new Response(JSON.stringify(profession), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}

export async function DELETE(req) {
  await connectMongo();
  const { name } = await req.json();
  await Profession.deleteOne({ name });
  return new Response(JSON.stringify({ message: "Deleted" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
