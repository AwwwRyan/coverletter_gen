"use client";
import React, { useEffect, useState } from "react";
import { User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobSource, setJobSource] = useState("");
  const [tone, setTone] = useState("professional");
  const [generating, setGenerating] = useState(false);
  const [letter, setLetter] = useState("");
  const [genError, setGenError] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/");
      return;
    }
    // Only fetch profile if user is authenticated
    const fetchProfile = async () => {
      setLoading(true);
      setError("");
      try {
        const docRef = doc(db, "users", user.uid, "profile", "main");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data());
        } else {
          setError("Profile not found. Please register your profile.");
        }
      } catch (err: any) {
        setError("Failed to fetch profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user, authLoading, router]);


  if (authLoading || (!user && typeof window !== "undefined")) {
    // While checking auth or redirecting, show nothing (or a loader)
    return <div className="min-h-screen flex items-center justify-center text-xl">Loading...</div>;
  }
  if (!user) {
    // Don't render error if not authenticated, let redirect happen
    return null;
  }
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-xl">Loading...</div>;
  }
  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-600 text-lg">{error}</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-10 px-2 text-gray-900 dark:text-gray-100 relative">
      {/* Profile button top right */}
      <button
        onClick={() => router.push("/profile")}
        className="absolute top-6 right-6 bg-gradient-to-r from-indigo-500 via-sky-400 to-teal-400 text-white rounded-full p-3 shadow hover:from-indigo-600 hover:to-teal-500 transition flex items-center justify-center"
        title="Profile"
      >
        <User className="w-6 h-6" />
      </button>
      <h1 className="text-4xl font-extrabold mb-6 text-center bg-gradient-to-r from-indigo-500 via-sky-400 to-teal-400 bg-clip-text text-transparent drop-shadow-lg tracking-tight">Intelligent Cover Letter Generator</h1>
      <div className="w-full max-w-3xl bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700 mb-8">
        <h2 className="text-2xl font-bold mb-4 text-indigo-600 dark:text-teal-300">Generate Cover Letter</h2>
        <form
          className="flex flex-col gap-4"
          onSubmit={async e => {
            e.preventDefault();
            setGenError("");
            setLetter("");
            setGenerating(true);
            try {
              const res = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  profile,
                  jobDescription,
                  jobSource,
                  tone
                })
              });
              const data = await res.json();
              if (res.ok && data.letter) {
                setLetter(data.letter);
              } else {
                setGenError(data.error || "Failed to generate letter.");
              }
            } catch (err: any) {
              setGenError("Failed to generate letter.");
            } finally {
              setGenerating(false);
            }
          }}
        >
          <textarea
            className="border border-gray-300 dark:border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 dark:bg-gray-900/60 text-base"
            placeholder="Paste the job description here..."
            value={jobDescription}
            onChange={e => setJobDescription(e.target.value)}
            required
            rows={5}
          />
          <input
            className="border border-gray-300 dark:border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 dark:bg-gray-900/60 text-base"
            placeholder="Job Source (e.g. LinkedIn, Company Website)"
            value={jobSource}
            onChange={e => setJobSource(e.target.value)}
          />
          <select
            className="border border-gray-300 dark:border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50 dark:bg-gray-900/60 text-base"
            value={tone}
            onChange={e => setTone(e.target.value)}
          >
            <option value="professional">Professional</option>
            <option value="friendly">Friendly</option>
            <option value="enthusiastic">Enthusiastic</option>
            <option value="confident">Confident</option>
            <option value="humble">Humble</option>
          </select>
          <button
            type="submit"
            className="bg-gradient-to-r from-indigo-500 via-sky-400 to-teal-400 text-white rounded-lg px-6 py-2 font-bold shadow hover:from-indigo-600 hover:to-teal-500 transition disabled:opacity-60"
            disabled={generating || !profile}
          >
            {generating ? "Generating..." : "Generate Cover Letter"}
          </button>
        </form>
        {genError && <div className="text-red-600 text-sm mt-4 text-center font-medium">{genError}</div>}
        {letter && (
          <div className="mt-8">
            <h3 className="text-xl font-bold mb-2 text-indigo-600 dark:text-teal-300">Generated Cover Letter</h3>
            <pre className="whitespace-pre-wrap break-words text-black dark:text-white mb-4 text-base font-mono bg-gray-50 dark:bg-gray-900/60 rounded-lg p-4 border border-gray-100 dark:border-gray-700 overflow-x-auto">
              {letter}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
