"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TemplateOne, TemplateTwo, TemplateThree, TemplateFour, TemplateFive, TemplateSix } from "@/components/Templates";

export default function TemplateSelection() {
  const router = useRouter();
  const [data, setData] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("resumeData");
    if (stored) setData(JSON.parse(stored));
  }, []);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center font-bold text-xl">
        No Resume Data Found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4">
     <div className="flex justify-center items-center gap-4 mb-12">
      <h1 className="text-3xl font-bold"> Choose Your Resume Template </h1>
      <button
       onClick={() => router.push("/user/resumebuilder")}
        className="px-6 py-2 bg-indigo-600 text-white rounded"
      >
      Edit Resume
      </button>
     </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {[1, 2, 3, 4, 5, 6].map((num) => (
          <div
            key={num}
            onClick={() => router.push(`/user/resumebuilder/resumepreview/${num}`)}
            className="cursor-pointer bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105"
          >
            <div
              className="relative bg-slate-200 flex justify-center items-start overflow-hidden"
              style={{ height: "350px" }}
            >
              <div
                className="origin-top"
                style={{
                  transform: "scale(0.35)",
                  transformOrigin: "top center",
                  width: "210mm"
                }}
              >
                {num === 1 && <TemplateOne data={data} />}
                {num === 2 && <TemplateTwo data={data} />}
                {num === 3 && <TemplateThree data={data} />}
                {num === 4 && <TemplateFour data={data} />}
                {num === 5 && <TemplateFive data={data} />}
                {num === 6 && <TemplateSix data={data} />}




              </div>
            </div>
            <div className="py-4 text-center font-bold text-xs uppercase tracking-widest text-slate-600 bg-white border-t">
              Template {num}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}