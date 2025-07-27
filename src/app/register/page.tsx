"use client"
import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { saveUserProfile } from "../../utils/saveProfile"
import {
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  FolderOpen,
  Code,
  Award,
  Github,
  Linkedin,
  Plus,
  X,
  UserPlus,
  Loader2,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react"

const initialProfile = {
  name: "",
  email: "",
  phone: "",
  location: "",
  experience: [{ title: "", company: "", years: "", description: "" }],
  education: [{ degree: "", institution: "", years: "", cgpa: "", percentage: "" }],
  projects: [{ title: "", description: "" }],
  skills: [""],
  achievements: [""],
  links: { github: "", linkedin: "" },
}

export default function Register() {
  const [profile, setProfile] = useState(initialProfile)
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string,
    idx?: number,
    subfield?: string,
  ) => {
    if (field in profile) {
      if (Array.isArray(profile[field as keyof typeof profile]) && typeof idx === "number") {
        const arr = [...(profile[field as keyof typeof profile] as any[])]
        if (subfield) {
          arr[idx][subfield] = e.target.value
        } else {
          arr[idx] = e.target.value
        }
        setProfile({ ...profile, [field]: arr })
      } else {
        setProfile({ ...profile, [field]: e.target.value })
      }
    } else if (field === "github" || field === "linkedin") {
      setProfile({ ...profile, links: { ...profile.links, [field]: e.target.value } })
    }
  }

  const handleSkillChange = (idx: number, value: string) => {
    const arr = [...profile.skills]
    arr[idx] = value
    setProfile({ ...profile, skills: arr })
  }

  const handleAchievementChange = (idx: number, value: string) => {
    const arr = [...profile.achievements]
    arr[idx] = value
    setProfile({ ...profile, achievements: arr })
  }

  const addArrayItem = (field: string, template: any) => {
    setProfile({ ...profile, [field]: [...(profile as any)[field], template] })
  }

  const removeArrayItem = (field: string, idx: number) => {
    const arr = [...(profile as any)[field]]
    arr.splice(idx, 1)
    setProfile({ ...profile, [field]: arr })
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)
    try {
      const auth = getAuth()
      const userCredential = await createUserWithEmailAndPassword(auth, profile.email, password)
      const user = userCredential.user
      await saveUserProfile(user.uid, profile)
      setSuccess("Registration successful! Profile saved.")
      router.replace("/home")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setError("")
    setSuccess("")
    setLoading(true)
    try {
      const auth = getAuth()
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const user = result.user
      // Pre-fill email and name if available
      setProfile((p) => ({ ...p, email: user.email || "", name: user.displayName || "" }))
      await saveUserProfile(user.uid, { ...profile, email: user.email || "", name: user.displayName || "" })
      setSuccess("Google sign-in successful! Profile saved.")
      router.replace("/home")
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-sky-50 to-teal-100 dark:from-[#0a0a23] dark:to-[#232946] py-8 px-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-indigo-200/20 dark:bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-teal-200/20 dark:bg-teal-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-200/10 dark:bg-sky-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Header */}

        <h1 className="text-4xl font-extrabold mb-6 text-center bg-gradient-to-r from-indigo-500 via-sky-400 to-teal-400 bg-clip-text text-transparent drop-shadow-lg tracking-tight">Intelligent Cover Letter Generator</h1>

        <form onSubmit={handleRegister} className="space-y-8">
          {/* Google Sign Up */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8">
            <button
              type="button"
              onClick={handleGoogle}
              disabled={loading}
              className="w-full flex items-center justify-center space-x-3 py-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl font-semibold text-gray-700 dark:text-gray-200 shadow-md hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-500 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <svg className="w-5 h-5" viewBox="0 0 48 48">
                <g>
                  <path
                    fill="#4285F4"
                    d="M24 9.5c3.54 0 6.7 1.22 9.19 3.23l6.85-6.85C36.68 2.7 30.77 0 24 0 14.82 0 6.71 5.82 2.69 14.09l7.98 6.2C12.13 13.16 17.57 9.5 24 9.5z"
                  />
                  <path
                    fill="#34A853"
                    d="M46.1 24.55c0-1.64-.15-3.22-.42-4.74H24v9.01h12.42c-.54 2.9-2.18 5.36-4.64 7.04l7.19 5.59C43.93 37.36 46.1 31.41 46.1 24.55z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.67 28.29a14.5 14.5 0 0 1 0-8.58l-7.98-6.2A23.94 23.94 0 0 0 0 24c0 3.77.9 7.34 2.69 10.49l7.98-6.2z"
                  />
                  <path
                    fill="#EA4335"
                    d="M24 48c6.48 0 11.93-2.15 15.9-5.85l-7.19-5.59c-2.01 1.35-4.6 2.15-8.71 2.15-6.43 0-11.87-3.66-14.33-8.79l-7.98 6.2C6.71 42.18 14.82 48 24 48z"
                  />
                </g>
              </svg>
              <span>Continue with Google</span>
            </button>

            
          </div>

          {/* Basic Information */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8">
            <div className="flex items-center mb-6">
              <User className="w-6 h-6 text-indigo-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Basic Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent bg-gray-50/50 dark:bg-gray-900/50 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                  type="text"
                  placeholder="Full Name"
                  value={profile.name}
                  onChange={(e) => handleChange(e, "name")}
                  required
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent bg-gray-50/50 dark:bg-gray-900/50 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                  type="email"
                  placeholder="Email Address"
                  value={profile.email}
                  onChange={(e) => handleChange(e, "email")}
                  required
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  className="w-full pl-12 pr-12 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent bg-gray-50/50 dark:bg-gray-900/50 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent bg-gray-50/50 dark:bg-gray-900/50 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                  type="text"
                  placeholder="Phone Number"
                  value={profile.phone}
                  onChange={(e) => handleChange(e, "phone")}
                />
              </div>
              <div className="relative md:col-span-2">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent bg-gray-50/50 dark:bg-gray-900/50 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                  type="text"
                  placeholder="Location"
                  value={profile.location}
                  onChange={(e) => handleChange(e, "location")}
                />
              </div>
            </div>
          </div>

          {/* Experience */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Briefcase className="w-6 h-6 text-indigo-500 mr-3" />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Experience</h2>
              </div>
              <button
                type="button"
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg"
                onClick={() => addArrayItem("experience", { title: "", company: "", years: "", description: "" })}
              >
                <Plus className="w-4 h-4" />
                <span>Add Experience</span>
              </button>
            </div>
            <div className="space-y-4">
              {profile.experience.map((exp, idx) => (
                <div
                  key={idx}
                  className="relative bg-gray-50/50 dark:bg-gray-900/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
                >
                  {profile.experience.length > 1 && (
                    <button
                      type="button"
                      className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                      onClick={() => removeArrayItem("experience", idx)}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
                      type="text"
                      placeholder="Job Title"
                      value={exp.title}
                      onChange={(e) => handleChange(e, "experience", idx, "title")}
                    />
                    <input
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
                      type="text"
                      placeholder="Company"
                      value={exp.company}
                      onChange={(e) => handleChange(e, "experience", idx, "company")}
                    />
                  </div>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 mb-4"
                    type="text"
                    placeholder="Years (e.g., 2020-2023)"
                    value={exp.years}
                    onChange={(e) => handleChange(e, "experience", idx, "years")}
                  />
                  <textarea
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                    placeholder="Job Description"
                    rows={3}
                    value={exp.description}
                    onChange={(e) => handleChange(e, "experience", idx, "description")}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <GraduationCap className="w-6 h-6 text-indigo-500 mr-3" />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Education</h2>
              </div>
              <button
                type="button"
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg"
                onClick={() =>
                  addArrayItem("education", { degree: "", institution: "", years: "", cgpa: "", percentage: "" })
                }
              >
                <Plus className="w-4 h-4" />
                <span>Add Education</span>
              </button>
            </div>
            <div className="space-y-4">
              {profile.education.map((edu, idx) => (
                <div
                  key={idx}
                  className="relative bg-gray-50/50 dark:bg-gray-900/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
                >
                  {profile.education.length > 1 && (
                    <button
                      type="button"
                      className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                      onClick={() => removeArrayItem("education", idx)}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
                      type="text"
                      placeholder="Degree"
                      value={edu.degree}
                      onChange={(e) => handleChange(e, "education", idx, "degree")}
                    />
                    <input
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
                      type="text"
                      placeholder="Institution"
                      value={edu.institution}
                      onChange={(e) => handleChange(e, "education", idx, "institution")}
                    />
                    <input
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
                      type="text"
                      placeholder="Years"
                      value={edu.years}
                      onChange={(e) => handleChange(e, "education", idx, "years")}
                    />
                    <input
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
                      type="text"
                      placeholder="CGPA / Percentage"
                      value={edu.cgpa || edu.percentage || ""}
                      onChange={(e) => handleChange(e, "education", idx, "cgpa")}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Projects */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <FolderOpen className="w-6 h-6 text-indigo-500 mr-3" />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Projects</h2>
              </div>
              <button
                type="button"
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg"
                onClick={() => addArrayItem("projects", { title: "", description: "" })}
              >
                <Plus className="w-4 h-4" />
                <span>Add Project</span>
              </button>
            </div>
            <div className="space-y-4">
              {profile.projects.map((proj, idx) => (
                <div
                  key={idx}
                  className="relative bg-gray-50/50 dark:bg-gray-900/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
                >
                  {profile.projects.length > 1 && (
                    <button
                      type="button"
                      className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                      onClick={() => removeArrayItem("projects", idx)}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <input
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 mb-4"
                    type="text"
                    placeholder="Project Title"
                    value={proj.title}
                    onChange={(e) => handleChange(e, "projects", idx, "title")}
                  />
                  <textarea
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                    placeholder="Project Description"
                    rows={3}
                    value={proj.description}
                    onChange={(e) => handleChange(e, "projects", idx, "description")}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Code className="w-6 h-6 text-indigo-500 mr-3" />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Skills</h2>
              </div>
              <button
                type="button"
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg"
                onClick={() => addArrayItem("skills", "")}
              >
                <Plus className="w-4 h-4" />
                <span>Add Skill</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.skills.map((skill, idx) => (
                <div key={idx} className="flex items-center space-x-3">
                  <input
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50/50 dark:bg-gray-900/50 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
                    type="text"
                    placeholder="Skill"
                    value={skill}
                    onChange={(e) => handleSkillChange(idx, e.target.value)}
                  />
                  {profile.skills.length > 1 && (
                    <button
                      type="button"
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                      onClick={() => removeArrayItem("skills", idx)}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Award className="w-6 h-6 text-indigo-500 mr-3" />
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Achievements</h2>
              </div>
              <button
                type="button"
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg"
                onClick={() => addArrayItem("achievements", "")}
              >
                <Plus className="w-4 h-4" />
                <span>Add Achievement</span>
              </button>
            </div>
            <div className="space-y-3">
              {profile.achievements.map((ach, idx) => (
                <div key={idx} className="flex items-center space-x-3">
                  <input
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50/50 dark:bg-gray-900/50 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400"
                    type="text"
                    placeholder="Achievement"
                    value={ach}
                    onChange={(e) => handleAchievementChange(idx, e.target.value)}
                  />
                  {profile.achievements.length > 1 && (
                    <button
                      type="button"
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                      onClick={() => removeArrayItem("achievements", idx)}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-8">
            <div className="flex items-center mb-6">
              <Github className="w-6 h-6 text-indigo-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Social Links</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative">
                <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent bg-gray-50/50 dark:bg-gray-900/50 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                  type="text"
                  placeholder="GitHub Profile URL"
                  value={profile.links.github}
                  onChange={(e) => handleChange(e, "github")}
                />
              </div>
              <div className="relative">
                <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent bg-gray-50/50 dark:bg-gray-900/50 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                  type="text"
                  placeholder="LinkedIn Profile URL"
                  value={profile.links.linkedin}
                  onChange={(e) => handleChange(e, "linkedin")}
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-8">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-indigo-500 via-sky-400 to-teal-400 text-white rounded-xl font-bold shadow-lg hover:from-indigo-600 hover:via-sky-500 hover:to-teal-500 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-105"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  <span>Create Account & Save Profile</span>
                </>
              )}
            </button>
          </div>

          {/* Status Messages */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-center">
              <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
            </div>
          )}
          {success && (
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 text-center">
              <p className="text-green-600 dark:text-green-400 font-medium">{success}</p>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="text-center mt-8">
          <div className="flex items-center justify-center space-x-2 text-gray-500 dark:text-gray-400">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm">Secure registration powered by Firebase</span>
          </div>
        </div>
      </div>
    </div>
  )
}
