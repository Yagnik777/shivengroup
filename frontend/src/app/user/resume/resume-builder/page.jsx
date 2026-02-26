//src/app/user/resume/resume-builder/page.jsx
"use client";
import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";

export default function ResumeBuilder() {
  const [step, setStep] = useState("form");
  const [template, setTemplate] = useState(null);

  const {
    register,
    control,
    watch,
    setValue,
    handleSubmit,
  } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      education: {
        tenth: { school: "", marks: "", total: 100, percent: 0 },
        twelfth: { school: "", marks: "", total: 100, percent: 0 },
        college: { school: "", course: "", marks: "", total: 100, percent: 0 },
        pg: { school: "", course: "", marks: "", total: 100, percent: 0 },
      },
      skills: [{ name: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "skills",
  });

  const data = watch();

  // 🔥 Clean Percentage Logic
  useEffect(() => {
    const calculate = (section) => {
      const marks = Number(section.marks);
      const total = Number(section.total);
      if (!marks || !total) return 0;
      return ((marks / total) * 100).toFixed(2);
    };

    Object.keys(data.education).forEach((key) => {
      const percent = calculate(data.education[key]);
      setValue(`education.${key}.percent`, percent);
    });
  }, [data.education, setValue]);

  const onSubmit = () => setStep("templates");

  if (step === "form") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 py-10">
        <div className="max-w-4xl mx-auto bg-white p-10 rounded-2xl shadow-xl">

          <h1 className="text-3xl font-bold mb-8 text-center">
            Build Your Resume
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

            {/* Personal Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <input
                {...register("fullName")}
                placeholder="Full Name"
                className="input-style"
              />
              <input
                {...register("email")}
                placeholder="Email Address"
                className="input-style"
              />
            </div>

            {/* Education */}
            {["tenth", "twelfth", "college", "pg"].map((edu) => (
              <div key={edu} className="card-style">
                <h3 className="section-title capitalize">{edu}</h3>

                <div className="grid md:grid-cols-4 gap-4">
                  <input
                    {...register(`education.${edu}.school`)}
                    placeholder="Institution Name"
                    className="input-style md:col-span-2"
                  />
                  <input
                    {...register(`education.${edu}.marks`)}
                    type="number"
                    placeholder="Marks"
                    className="input-style"
                  />
                  <div className="percent-box">
                    {data.education[edu].percent}%
                  </div>
                </div>
              </div>
            ))}

            {/* Skills */}
            <div className="card-style">
              <h3 className="section-title">Technical Skills</h3>

              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-3 mb-3">
                  <input
                    {...register(`skills.${index}.name`)}
                    className="input-style flex-1"
                    placeholder="Skill name"
                  />
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-500 font-bold"
                  >
                    ✕
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => append({ name: "" })}
                className="btn-secondary"
              >
                + Add Skill
              </button>
            </div>

            <button className="btn-primary w-full">
              Choose Template →
            </button>

          </form>
        </div>
      </div>
    );
  }

  // TEMPLATE SELECTION
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-6xl mx-auto">

        <h2 className="text-3xl font-bold text-center mb-10">
          Select Resume Style
        </h2>

        {!template ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((t) => (
              <div
                key={t}
                onClick={() => setTemplate(t)}
                className="template-card"
              >
                Template {t}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center">

            <div className="mb-6 flex gap-4">
              <button
                onClick={() => setTemplate(null)}
                className="btn-secondary"
              >
                Back
              </button>
              <button
                onClick={() => window.print()}
                className="btn-primary"
              >
                Download PDF
              </button>
            </div>

            <div className="resume-preview">
              <h1 className="text-4xl font-bold">
                {data.fullName}
              </h1>
              <p className="mb-6">{data.email}</p>

              <h3 className="preview-title">Education</h3>
              {Object.keys(data.education).map((key) => (
                data.education[key].school && (
                  <p key={key}>
                    {data.education[key].school} — {data.education[key].percent}%
                  </p>
                )
              ))}

              <h3 className="preview-title mt-6">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {data.skills.map((s, i) => (
                  <span key={i} className="skill-chip">
                    {s.name}
                  </span>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
