"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, m } from "framer-motion";
import { X, Loader2, Lock, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const CATEGORY_OPTIONS = ["Featured", "Shorts", "Meta Ads"];
const SOFTWARE_OPTIONS = [
  "Premiere Pro",
  "After Effects",
  "DaVinci Resolve",
  "Photoshop",
  "Illustrator",
  "Audition",
];

const SESSION_KEY = "portfolio_admin_unlocked";

type Step = "password" | "form";

interface AddProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddProjectModal({ isOpen, onClose }: AddProjectModalProps) {
  const router = useRouter();

  const getInitialStep = (): Step => {
    const unlocked =
      typeof window !== "undefined" &&
      sessionStorage.getItem(SESSION_KEY) === "true";
    return unlocked ? "form" : "password";
  };

  const [step, setStep] = useState<Step>(getInitialStep);
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [checkingPassword, setCheckingPassword] = useState(false);

  const [form, setForm] = useState({
    video_title: "",
    video_link: "",
    video_description: "",
    client_name: "",
    category: ["Featured"] as string[],
    duration: "",
    software_used: [] as string[],
    tags: "",
  });
  const [customCategory, setCustomCategory] = useState("");
  const [extraCategories, setExtraCategories] = useState<string[]>([]);
  const [customSoftware, setCustomSoftware] = useState("");
  const [extraSoftware, setExtraSoftware] = useState<string[]>([]);

  const handleClose = () => {
    setPasswordError("");
    onClose();
  };

  const handlePasswordCheck = async () => {
    if (!password.trim()) {
      setPasswordError("Enter your password.");
      return;
    }

    setCheckingPassword(true);
    setPasswordError("");

    try {
      const res = await fetch("/api/verify-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();

      if (!res.ok || !data.valid) {
        setPasswordError("Incorrect password.");
        setPassword("");
        return;
      }

      sessionStorage.setItem(SESSION_KEY, "true");
      setStep("form");
    } catch (err) {
      console.error(err);
      setPasswordError("Couldn't reach the server. Try again.");
    } finally {
      setCheckingPassword(false);
    }
  };

  const updateField = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleCategory = (cat: string) => {
    setForm((prev) => {
      const has = prev.category.includes(cat);
      return {
        ...prev,
        category: has
          ? prev.category.filter((c) => c !== cat)
          : [...prev.category, cat],
      };
    });
  };

  const addCustomCategory = () => {
    const trimmed = customCategory.trim();
    if (!trimmed) return;
    if (!CATEGORY_OPTIONS.includes(trimmed) && !extraCategories.includes(trimmed)) {
      setExtraCategories((prev) => [...prev, trimmed]);
    }
    if (!form.category.includes(trimmed)) {
      setForm((prev) => ({ ...prev, category: [...prev.category, trimmed] }));
    }
    setCustomCategory("");
  };

  const toggleSoftware = (item: string) => {
    setForm((prev) => {
      const has = prev.software_used.includes(item);
      return {
        ...prev,
        software_used: has
          ? prev.software_used.filter((s) => s !== item)
          : [...prev.software_used, item],
      };
    });
  };

  const addCustomSoftware = () => {
    const trimmed = customSoftware.trim();
    if (!trimmed) return;
    if (!SOFTWARE_OPTIONS.includes(trimmed) && !extraSoftware.includes(trimmed)) {
      setExtraSoftware((prev) => [...prev, trimmed]);
    }
    if (!form.software_used.includes(trimmed)) {
      setForm((prev) => ({
        ...prev,
        software_used: [...prev.software_used, trimmed],
      }));
    }
    setCustomSoftware("");
  };

  const resetForm = () => {
    setForm({
      video_title: "",
      video_link: "",
      video_description: "",
      client_name: "",
      category: ["Featured"],
      duration: "",
      software_used: [],
      tags: "",
    });
    setCustomCategory("");
    setExtraCategories([]);
    setCustomSoftware("");
    setExtraSoftware([]);
  };

  const handleSubmit = async () => {
    if (!form.video_title.trim() || !form.video_link.trim()) {
      toast.error("Video title and YouTube link are required.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          sessionStorage.removeItem(SESSION_KEY);
          setStep("password");
          setPasswordError("Incorrect password. Try again.");
        } else {
          toast.error(data.error || "Something went wrong.");
        }
        return;
      }

      toast.success("Project added!");
      resetForm();
      handleClose();
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Couldn't reach the server. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={handleClose}
        >
          <m.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md max-h-[85vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 shadow-2xl"
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            {step === "password" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-white">
                  <Lock size={18} />
                  <h3 className="text-lg font-semibold">Admin Access</h3>
                </div>
                <p className="text-sm text-gray-400">
                  Enter your admin password to add a new project.
                </p>
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handlePasswordCheck()}
                  autoFocus
                />
                {passwordError && (
                  <p className="text-sm text-red-400">{passwordError}</p>
                )}
                <Button
                  onClick={handlePasswordCheck}
                  disabled={checkingPassword}
                  className="w-full bg-white text-black hover:bg-gray-200"
                >
                  {checkingPassword ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Checking...
                    </>
                  ) : (
                    "Continue"
                  )}
                </Button>
              </div>
            )}

            {step === "form" && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">
                  Add New Project
                </h3>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-200">
                    YouTube Link *
                  </label>
                  <Input
                    placeholder="https://youtube.com/shorts/..."
                    value={form.video_link}
                    onChange={(e) => updateField("video_link", e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-200">
                    Video Title *
                  </label>
                  <Input
                    placeholder="Project title"
                    value={form.video_title}
                    onChange={(e) => updateField("video_title", e.target.value)}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-200">Description</label>
                  <Textarea
                    placeholder="Short description (optional)"
                    value={form.video_description}
                    onChange={(e) =>
                      updateField("video_description", e.target.value)
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-200">
                      Client Name
                    </label>
                    <Input
                      placeholder="e.g. RaazMD"
                      value={form.client_name}
                      onChange={(e) =>
                        updateField("client_name", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-200">Duration</label>
                    <Input
                      placeholder="e.g. 0:45"
                      value={form.duration}
                      onChange={(e) => updateField("duration", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-200">Category</label>
                  <div className="flex flex-wrap gap-2">
                    {[...CATEGORY_OPTIONS, ...extraCategories].map((cat) => {
                      const selected = form.category.includes(cat);
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => toggleCategory(cat)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
                            selected
                              ? "bg-white text-black border-white"
                              : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          {selected && <Check size={12} strokeWidth={3} />}
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[11px] text-gray-500 pt-1">
                    {form.category.length > 0
                      ? `Selected: ${form.category.join(", ")}`
                      : "Nothing selected yet"}
                  </p>
                  <div className="flex gap-2 pt-1">
                    <Input
                      placeholder="Add a new category..."
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addCustomCategory();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={addCustomCategory}
                      variant="outline"
                      className="shrink-0"
                    >
                      Add
                    </Button>
                  </div>
                  <p className="text-[11px] text-gray-500">
                    Type a category not listed above, then hit &quot;Add&quot; to create and select it as a new chip.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-200">
                    Software Used
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[...SOFTWARE_OPTIONS, ...extraSoftware].map((item) => {
                      const selected = form.software_used.includes(item);
                      return (
                        <button
                          key={item}
                          type="button"
                          onClick={() => toggleSoftware(item)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
                            selected
                              ? "bg-white text-black border-white"
                              : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          {selected && <Check size={12} strokeWidth={3} />}
                          {item}
                        </button>
                      );
                    })}
                  </div>
                  <p className="text-[11px] text-gray-500 pt-1">
                    {form.software_used.length > 0
                      ? `Selected: ${form.software_used.join(", ")}`
                      : "Nothing selected yet"}
                  </p>
                  <div className="flex gap-2 pt-1">
                    <Input
                      placeholder="Add software not listed..."
                      value={customSoftware}
                      onChange={(e) => setCustomSoftware(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addCustomSoftware();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={addCustomSoftware}
                      variant="outline"
                      className="shrink-0"
                    >
                      Add
                    </Button>
                  </div>
                </div>

                <Button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full bg-white text-black hover:bg-gray-200"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    "Add Project"
                  )}
                </Button>
              </div>
            )}
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );
}
