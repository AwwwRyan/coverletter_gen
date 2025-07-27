"use client";

import React, { useState } from "react";

function cleanLetter(letter: string, profile: Profile | null): string {
  if (!letter) return "";
  let cleaned = letter;
  if (profile) {
    cleaned = cleaned.replace(/\[Your Name( \([^)]+\))?\]/g, profile.name);
    cleaned = cleaned.replace(/\[Your Address( \([^)]+\))?\]/g, profile.location || "");
    cleaned = cleaned.replace(/\[Your Phone Number( \([^)]+\))?\]/g, profile.phone || "");
    cleaned = cleaned.replace(/\[Your Email( \([^)]+\))?\]/g, profile.email || "");
  }
  cleaned = cleaned.replace(/\[[^\]]*\]/g, '');
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  return cleaned.trim();
}

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

type Profile = {
  name: string;
  email: string;
  phone: string;
  location: string;
  experience: any[];
  education: any[];
  skills: string[];
};

export default function Home() {
  const [jobDescription, setJobDescription] = useState("");
  const [jobSource, setJobSource] = useState("");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [letter, setLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tone, setTone] = useState("formal");

  React.useEffect(() => {
    fetch("/myProfile.json")
      .then((res) => res.json())
      .then(setProfile)
      .catch(() => setError("Failed to load profile."));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLetter("");
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, jobDescription, jobSource, tone }),
      });
      const data = await res.json();
      if (res.ok) setLetter(data.letter);
      else setError(data.error || "Failed to generate letter.");
    } catch (err: any) {
      setError("Failed to generate letter.");
    } finally {
      setLoading(false);
    }
  };

  const getFinalLetter = () => cleanLetter(letter, profile);

  const handleCopy = () => {
    const finalLetter = getFinalLetter();
    if (finalLetter) navigator.clipboard.writeText(finalLetter);
  };

  const handleDownload = () => {
    const finalLetter = getFinalLetter();
    if (!finalLetter) return;
    const blob = new Blob([finalLetter], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cover_letter.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-10 px-2 text-gray-900 dark:text-gray-100">
      <h1 className="text-5xl font-black mb-8 text-center bg-gradient-to-r from-indigo-700 via-sky-500 to-teal-400 bg-clip-text text-transparent drop-shadow-2xl tracking-tight uppercase animate-pulse">
        Intelligent Cover Letter Generator
      </h1>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-6xl bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-xl p-8 flex flex-col gap-5 border border-gray-200 dark:border-gray-700 backdrop-blur"
      >
        <label className="font-bold text-lg text-indigo-700 dark:text-teal-300 tracking-wide mb-1">Paste Job Description:</label>
        <textarea
          className="border-2 border-indigo-400 dark:border-teal-400 rounded-xl p-4 min-h-[200px] h-56 resize-vertical focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-teal-500 bg-indigo-50 dark:bg-gray-900/60 text-base w-full shadow-inner placeholder-gray-400 dark:placeholder-gray-500"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          required
          placeholder="Paste the full job description here..."
        />
        <label className="font-bold text-lg text-indigo-700 dark:text-teal-300 tracking-wide mt-2 mb-1">
          Where did you find this job/internship?
          <span className="block font-normal text-sm text-gray-500 dark:text-gray-400 mt-1">e.g. Internshala, LinkedIn, company website</span>
        </label>
        <input
          className="border-2 border-sky-400 dark:border-teal-400 rounded-xl p-4 focus:outline-none focus:ring-4 focus:ring-sky-200 dark:focus:ring-teal-500 bg-sky-50 dark:bg-gray-900/60 text-base w-full shadow-inner placeholder-gray-400 dark:placeholder-gray-500"
          type="text"
          value={jobSource}
          onChange={(e) => setJobSource(e.target.value)}
          placeholder="Enter job source/platform"
          required
        />
        <label className="font-bold text-lg text-indigo-700 dark:text-teal-300 tracking-wide mt-2 mb-1">Tone:</label>
        <select
          className="border-2 border-sky-400 dark:border-teal-400 rounded-xl p-4 focus:outline-none focus:ring-4 focus:ring-sky-200 dark:focus:ring-teal-500 bg-sky-50 dark:bg-gray-900/60 text-base w-full shadow-inner text-indigo-700 dark:text-teal-200 appearance-none"
          value={tone}
          onChange={(e) => setTone(e.target.value)}
        >
          <option value="formal">Formal</option>
          <option value="confident">Confident</option>
          <option value="friendly">Friendly</option>
        </select>
        <button
          type="submit"
          className="bg-gradient-to-r from-indigo-500 via-sky-400 to-teal-400 text-white rounded-lg px-6 py-2 font-bold shadow hover:from-indigo-600 hover:to-teal-500 transition disabled:opacity-60"
          disabled={loading || !profile}
        >
          {loading ? "Generating..." : "Generate Cover Letter"}
        </button>
        {error && <div className="text-red-600 text-sm font-medium">{error}</div>}
      </form>

      {letter && (
        <div className="w-full max-w-6xl mt-10 bg-white/95 dark:bg-gray-800/95 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700 backdrop-blur-lg">
          <h2 className="text-2xl font-bold mb-4 text-indigo-600 dark:text-teal-300">Generated Cover Letter</h2>
          {profile && !letter.includes(profile.name) && (
            <div className="mb-4 text-base text-black dark:text-white">
              <div className="font-semibold">{profile.name}</div>
              {profile.location && <div>{profile.location}</div>}
              {profile.phone && <div>{profile.phone}</div>}
              {profile.email && <div>{profile.email}</div>}
              <br />
            </div>
          )}
          <pre className="whitespace-pre-wrap break-words text-black dark:text-white mb-6 text-base font-mono bg-gray-50 dark:bg-gray-900/60 rounded-lg p-4 border border-gray-100 dark:border-gray-700 overflow-x-auto">
            {getFinalLetter()}
          </pre>
          <div className="flex gap-4 justify-end">
            <button onClick={handleCopy} className="bg-sky-100 dark:bg-gray-700 text-sky-700 dark:text-sky-200 rounded-lg px-4 py-2 font-semibold shadow hover:bg-sky-200 dark:hover:bg-gray-600 transition">
              Copy
            </button>
            <button onClick={handleDownload} className="bg-teal-100 dark:bg-gray-700 text-teal-700 dark:text-teal-200 rounded-lg px-4 py-2 font-semibold shadow hover:bg-teal-200 dark:hover:bg-gray-600 transition">
              Download
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
