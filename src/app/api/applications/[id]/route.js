import connectMongo from "@/lib/mongodb";
import Application from "@/models/Application";

export async function DELETE(req, { params }) {
  await connectMongo();

  // Make sure ID is correctly extracted
  const id = params.id;

  try {
    // Use findByIdAndDelete with the correct ID
    const deleted = await Application.findByIdAndDelete(id);

    if (!deleted) {
      return new Response(
        JSON.stringify({ success: false, message: "Application not found" }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "Application deleted successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ success: false, message: "Server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
