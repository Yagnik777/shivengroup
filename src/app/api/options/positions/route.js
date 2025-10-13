// /src/app/api/options/positions/route.js
import connectMongo from "@/lib/mongodb";
import Position from "@/models/Position";

export async function GET(req) {
  await connectMongo();
  const positions = await Position.find().sort({ name: 1 });
  return new Response(JSON.stringify(positions.map(p => p.name)), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req) {
  await connectMongo();
  const { name } = await req.json();

  if (!name) return new Response(JSON.stringify({ error: "Name is required" }), { status: 400, headers: { "Content-Type": "application/json" } });

  const exists = await Position.findOne({ name });
  if (exists) return new Response(JSON.stringify({ error: "Already exists" }), { status: 400, headers: { "Content-Type": "application/json" } });

  const position = new Position({ name });
  await position.save();
  return new Response(JSON.stringify(position), { status: 201, headers: { "Content-Type": "application/json" } });
}

export async function DELETE(req) {
  await connectMongo();
  const { name } = await req.json();
  await Position.deleteOne({ name });
  return new Response(JSON.stringify({ message: "Deleted" }), { status: 200, headers: { "Content-Type": "application/json" } });
}
