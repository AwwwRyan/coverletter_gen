"use client"
import type React from "react"
import { useEffect, useState } from "react"
import { useAuth } from "../../context/AuthContext"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "../../firebase"
import { useRouter } from "next/navigation"
import {
  User,
  MapPin,
  Phone,
  Mail,
  Briefcase,
  GraduationCap,
  FolderOpen,
  Award,
  Code,
  Github,
  Linkedin,
  Plus,
  X,
  Save,
  LogOut,
  Loader2,
} from "lucide-react"

export default function ProfilePage() {
  const { user, loading: authLoading, logout } = useAuth()
  const [profile, setProfile] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      router.replace("/")
      return
    }
    const fetchProfile = async () => {
      setLoading(true)
      setError("")
      try {
        const docRef = doc(db, "users", user.uid, "profile", "main")
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          setProfile(docSnap.data())
        } else {
          setProfile({})
        }
      } catch (err: any) {
        setError("Failed to fetch profile.")
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [user, authLoading, router])

  // Handle simple field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value })
  }

  // Handle array field changes (experience, education, projects, skills, achievements)
  const handleArrayChange = (field: string, idx: number, key: string, value: string) => {
    setProfile((prev: any) => {
      const arr = Array.isArray(prev[field]) ? [...prev[field]] : []
      arr[idx] = { ...arr[idx], [key]: value }
      return { ...prev, [field]: arr }
    })
  }

  // Handle array of strings (skills, achievements)
  const handleStringArrayChange = (field: string, idx: number, value: string) => {
    setProfile((prev: any) => {
      const arr = Array.isArray(prev[field]) ? [...prev[field]] : []
      arr[idx] = value
      return { ...prev, [field]: arr }
    })
  }

  // Handle links
  const handleLinksChange = (key: string, value: string) => {
    setProfile((prev: any) => ({ ...prev, links: { ...prev.links, [key]: value } }))
  }

  // Add item to array field
  const handleAddArrayItem = (field: string, template: any = "") => {
    setProfile((prev: any) => {
      const arr = Array.isArray(prev[field]) ? [...prev[field]] : []
      arr.push(template)
      return { ...prev, [field]: arr }
    })
  }

  // Remove item from array field
  const handleRemoveArrayItem = (field: string, idx: number) => {
    setProfile((prev: any) => {
      const arr = Array.isArray(prev[field]) ? [...prev[field]] : []
      arr.splice(idx, 1)
      return { ...prev, [field]: arr }
    })
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    setSuccess("")
    try {
      if (!user) throw new Error("User not authenticated")
      const docRef = doc(db, "users", user.uid, "profile", "main")
      await setDoc(docRef, profile, { merge: true })
      setSuccess("Profile saved successfully!")
    } catch (err: any) {
      setError("Failed to save profile.")
    } finally {
      setSaving(false)
    }
  }

  if (authLoading || (!user && typeof window !== "undefined")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800">
        <div className="flex items-center space-x-3 text-xl text-gray-600 dark:text-gray-300">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800">
        <div className="flex items-center space-x-3 text-xl text-gray-600 dark:text-gray-300">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-500 via-sky-400 to-teal-400 bg-clip-text text-transparent drop-shadow-lg">
            Edit Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Customize your professional profile</p>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
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
                  placeholder="Full Name"
                  name="name"
                  value={profile.name || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent bg-gray-50/50 dark:bg-gray-900/50 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                  placeholder="Location"
                  name="location"
                  value={profile.location || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent bg-gray-50/50 dark:bg-gray-900/50 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                  placeholder="Phone Number"
                  name="phone"
                  value={profile.phone || ""}
                  onChange={handleChange}
                />
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent bg-gray-50/50 dark:bg-gray-900/50 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                  placeholder="Email"
                  name="email"
                  value={profile.email || ""}
                  onChange={handleChange}
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
                onClick={() => handleAddArrayItem("experience", { title: "", company: "", years: "", description: "" })}
              >
                <Plus className="w-4 h-4" />
                <span>Add Experience</span>
              </button>
            </div>
            <div className="space-y-4">
              {(profile.experience || []).map((exp: any, idx: number) => (
                <div
                  key={idx}
                  className="relative bg-gray-50/50 dark:bg-gray-900/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
                >
                  <button
                    type="button"
                    className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                    onClick={() => handleRemoveArrayItem("experience", idx)}
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <input
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                      placeholder="Job Title"
                      value={exp.title || ""}
                      onChange={(e) => handleArrayChange("experience", idx, "title", e.target.value)}
                    />
                    <input
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                      placeholder="Company"
                      value={exp.company || ""}
                      onChange={(e) => handleArrayChange("experience", idx, "company", e.target.value)}
                    />
                  </div>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 mb-4"
                    placeholder="Years (e.g., 2020-2023)"
                    value={exp.years || ""}
                    onChange={(e) => handleArrayChange("experience", idx, "years", e.target.value)}
                  />
                  <textarea
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 resize-none"
                    placeholder="Job Description"
                    rows={3}
                    value={exp.description || ""}
                    onChange={(e) => handleArrayChange("experience", idx, "description", e.target.value)}
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
                onClick={() => handleAddArrayItem("education", { degree: "", institution: "", years: "", cgpa: "" })}
              >
                <Plus className="w-4 h-4" />
                <span>Add Education</span>
              </button>
            </div>
            <div className="space-y-4">
              {(profile.education || []).map((edu: any, idx: number) => (
                <div
                  key={idx}
                  className="relative bg-gray-50/50 dark:bg-gray-900/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
                >
                  <button
                    type="button"
                    className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                    onClick={() => handleRemoveArrayItem("education", idx)}
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                      placeholder="Degree"
                      value={edu.degree || ""}
                      onChange={(e) => handleArrayChange("education", idx, "degree", e.target.value)}
                    />
                    <input
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                      placeholder="Institution"
                      value={edu.institution || ""}
                      onChange={(e) => handleArrayChange("education", idx, "institution", e.target.value)}
                    />
                    <input
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                      placeholder="Years"
                      value={edu.years || ""}
                      onChange={(e) => handleArrayChange("education", idx, "years", e.target.value)}
                    />
                    <input
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                      placeholder="CGPA / Percentage"
                      value={edu.cgpa || edu.percentage || ""}
                      onChange={(e) =>
                        handleArrayChange(
                          "education",
                          idx,
                          edu.cgpa !== undefined ? "cgpa" : "percentage",
                          e.target.value,
                        )
                      }
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
                onClick={() => handleAddArrayItem("projects", { title: "", description: "" })}
              >
                <Plus className="w-4 h-4" />
                <span>Add Project</span>
              </button>
            </div>
            <div className="space-y-4">
              {(profile.projects || []).map((proj: any, idx: number) => (
                <div
                  key={idx}
                  className="relative bg-gray-50/50 dark:bg-gray-900/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
                >
                  <button
                    type="button"
                    className="absolute top-4 right-4 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                    onClick={() => handleRemoveArrayItem("projects", idx)}
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <input
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 mb-4"
                    placeholder="Project Title"
                    value={proj.title || ""}
                    onChange={(e) => handleArrayChange("projects", idx, "title", e.target.value)}
                  />
                  <textarea
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 resize-none"
                    placeholder="Project Description"
                    rows={3}
                    value={proj.description || ""}
                    onChange={(e) => handleArrayChange("projects", idx, "description", e.target.value)}
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
                onClick={() => handleAddArrayItem("skills", "")}
              >
                <Plus className="w-4 h-4" />
                <span>Add Skill</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(profile.skills || []).map((skill: string, idx: number) => (
                <div key={idx} className="flex items-center space-x-3">
                  <input
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50/50 dark:bg-gray-900/50 text-gray-800 dark:text-gray-200"
                    placeholder="Skill"
                    value={skill}
                    onChange={(e) => handleStringArrayChange("skills", idx, e.target.value)}
                  />
                  <button
                    type="button"
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                    onClick={() => handleRemoveArrayItem("skills", idx)}
                  >
                    <X className="w-4 h-4" />
                  </button>
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
                onClick={() => handleAddArrayItem("achievements", "")}
              >
                <Plus className="w-4 h-4" />
                <span>Add Achievement</span>
              </button>
            </div>
            <div className="space-y-3">
              {(profile.achievements || []).map((ach: string, idx: number) => (
                <div key={idx} className="flex items-center space-x-3">
                  <input
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-gray-50/50 dark:bg-gray-900/50 text-gray-800 dark:text-gray-200"
                    placeholder="Achievement"
                    value={ach}
                    onChange={(e) => handleStringArrayChange("achievements", idx, e.target.value)}
                  />
                  <button
                    type="button"
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
                    onClick={() => handleRemoveArrayItem("achievements", idx)}
                  >
                    <X className="w-4 h-4" />
                  </button>
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
                  placeholder="GitHub Profile URL"
                  value={profile.links?.github || ""}
                  onChange={(e) => handleLinksChange("github", e.target.value)}
                />
              </div>
              <div className="relative">
                <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent bg-gray-50/50 dark:bg-gray-900/50 text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                  placeholder="LinkedIn Profile URL"
                  value={profile.links?.linkedin || ""}
                  onChange={(e) => handleLinksChange("linkedin", e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 pt-8">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-indigo-500 via-sky-400 to-teal-400 text-white rounded-xl font-bold shadow-lg hover:from-indigo-600 hover:via-sky-500 hover:to-teal-500 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-105"
            >
              {saving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  <span>Save Profile</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={logout}
              className="flex items-center space-x-3 px-6 py-3 text-red-600 dark:text-red-400 font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
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
      </div>
    </div>
  )
}
