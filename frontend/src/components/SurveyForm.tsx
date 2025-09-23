import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface Question {
  name: string;
  label: string;
  description: string;
  type: string;
  required: boolean;
}

interface SurveyFormProps {
  userEmail: string;
  jwtToken: string | null;
}

const questions: Question[] = [
  {
    name: "name",
    label: "Name",
    description: "Please enter your full name.",
    type: "text",
    required: true,
  },
  {
    name: "age",
    label: "Age",
    description: "Enter your age (13-99).",
    type: "number",
    required: true,
  },
  {
    name: "email",
    label: "Email",
    description: "We’ll use this to contact you if needed.",
    type: "email",
    required: true,
  },
];

const SurveyForm: React.FC<SurveyFormProps> = ({ userEmail, jwtToken }) => {
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [current, setCurrent] = useState(0);
  const [error, setError] = useState("");
  const [review, setReview] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const navigate = useNavigate();

  const validate = (name: string, value: string) => {
    if (name === "name") {
      if (!value.trim()) return "Name is required.";
      if (!/^[A-Za-z ]{2,}$/.test(value.trim()))
        return "Name must be at least 2 letters and only contain letters and spaces.";
    }
    if (name === "age") {
      if (!value) return "Age is required.";
      const ageNum = Number(value);
      if (!/^[0-9]+$/.test(value)) return "Age must be a whole number.";
      if (isNaN(ageNum)) return "Age must be a number.";
      if (!Number.isInteger(ageNum)) return "Age must be an integer.";
      if (ageNum < 13 || ageNum > 99) return "Age must be between 13 and 99.";
    }
    if (name === "email" && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value))
      return "Valid email is required.";
    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnswers({ ...answers, [questions[current].name]: e.target.value });
    setError("");
  };

  const handleNext = () => {
    const q = questions[current];
    const value = answers[q.name] || "";
    const err = validate(q.name, value);
    if (err) {
      setError(err);
      return;
    }
    setCurrent(current + 1);
    setError("");
  };

  const handlePrev = () => {
    setCurrent(current - 1);
    setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    for (const q of questions) {
      const err = validate(q.name, answers[q.name] || "");
      if (err) {
        setError(err);
        return;
      }
    }
    setReview(true);
  };

  const handleFinalSubmit = async () => {
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/userform`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {}),
        },
        body: JSON.stringify({ ...answers, userEmail }),
      });

      if (res.ok) {
        setReview(false);
        setAnswers({});
        setCurrent(0);
        navigate("/thankyou", { state: { answers } });
      } else {
        const data = await res.json();
        setSubmitError(data.message || "Submission failed");
      }
    } catch (err) {
      setSubmitError("Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const q = questions[current];
  const progress = ((current + 1) / questions.length) * 100;

  if (review) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white shadow rounded-2xl space-y-5">
        <h2 className="text-xl font-bold mb-4">Review Your Answers</h2>
        <ul className="space-y-2 mb-4">
          {questions.map((q) => (
            <li key={q.name} className="bg-gray-100 p-2 rounded">
              <span className="font-semibold capitalize">{q.label}:</span>{" "}
              {answers[q.name]}
              <div className="text-gray-500 text-xs">{q.description}</div>
            </li>
          ))}
        </ul>
        {submitError && <p className="text-red-500 text-sm">{submitError}</p>}
        <div className="flex gap-2">
          <button
            className="bg-gray-300 px-4 py-2 rounded-lg"
            onClick={() => setReview(false)}
            disabled={submitting}
          >
            Edit
          </button>
          <button
            className="bg-green-600 text-white px-4 py-2 rounded-lg"
            onClick={handleFinalSubmit}
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-6 bg-white shadow rounded-2xl space-y-5"
    >
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
        <div
          className="bg-blue-600 h-2.5 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <label className="block font-semibold">{q.label}</label>
      <div className="text-gray-500 text-xs mb-2">{q.description}</div>
      <input
        type={q.type}
        name={q.name}
        value={answers[q.name] || ""}
        onChange={handleChange}
        className="w-full p-2 border rounded-lg"
        required={q.required}
        {...(q.name === "age" ? { min: 13, max: 99, step: 1 } : {})}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex justify-between">
        {current > 0 && (
          <button
            type="button"
            onClick={handlePrev}
            className="bg-gray-300 px-4 py-2 rounded-lg"
          >
            Prev
          </button>
        )}
        {current < questions.length - 1 ? (
          <button
            type="button"
            onClick={handleNext}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Next
          </button>
        ) : (
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Review
          </button>
        )}
      </div>
    </form>
  );
};

export default SurveyForm;
