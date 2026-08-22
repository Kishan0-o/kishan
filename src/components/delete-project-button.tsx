"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { AnimatePresence, m } from "framer-motion";
import { Trash2, X, Loader2, Lock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getStoredAdminPassword,
  setStoredAdminPassword,
  clearStoredAdminPassword,
} from "@/lib/admin-session";

type Stage = "closed" | "password" | "confirm";

interface DeleteProjectButtonProps {
  projectId: string;
  projectTitle: string;
}

export default function DeleteProjectButton({
  projectId,
  projectTitle,
}: DeleteProjectButtonProps) {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("closed");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [checking, setChecking] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Portals need `document` to exist, which is only true after mount on the client.
  useEffect(() => {
    setMounted(true);
  }, []);

  const openFlow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const stored = getStoredAdminPassword();
    if (stored) {
      setPassword(stored);
      setStage("confirm");
    } else {
      setStage("password");
    }
  };

  const close = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setStage("closed");
    setPasswordError("");
  };

  const handlePasswordCheck = async () => {
    if (!password.trim()) {
      setPasswordError("Enter your password.");
      return;
    }
    setChecking(true);
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
      setStoredAdminPassword(password);
      setStage("confirm");
    } catch (err) {
      console.error(err);
      setPasswordError("Couldn't reach the server. Try again.");
    } finally {
      setChecking(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch("/api/projects", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, id: projectId }),
      });
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401) {
          clearStoredAdminPassword();
          setStage("password");
          setPasswordError("Incorrect password. Try again.");
        } else {
          toast.error(data.error || "Something went wrong.");
        }
        return;
      }

      toast.success("Project deleted.");
      setStage("closed");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Couldn't reach the server. Try again.");
    } finally {
      setDeleting(false);
    }
  };

  const modal = (
    <AnimatePresence>
      {stage !== "closed" && (
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={close}
        >
          <m.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm rounded-2xl border border-white/10 bg-[#0a0a0a] p-6 shadow-2xl"
          >
            <button
              onClick={close}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X size={20} />
            </button>

            {stage === "password" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-white">
                  <Lock size={18} />
                  <h3 className="text-lg font-semibold">Admin Access</h3>
                </div>
                <p className="text-sm text-gray-400">
                  Enter your admin password to delete this project.
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
                  disabled={checking}
                  className="w-full bg-white text-black hover:bg-gray-200"
                >
                  {checking ? (
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

            {stage === "confirm" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-white">
                  <Trash2 size={18} className="text-red-400" />
                  <h3 className="text-lg font-semibold">Delete project?</h3>
                </div>
                <p className="text-sm text-gray-400">
                  You&apos;re about to permanently delete{" "}
                  <span className="text-white font-medium">
                    &quot;{projectTitle}&quot;
                  </span>
                  . This can&apos;t be undone.
                </p>
                {passwordError && (
                  <p className="text-sm text-red-400">{passwordError}</p>
                )}
                <div className="flex gap-2">
                  <Button
                    onClick={close}
                    variant="outline"
                    className="flex-1"
                    disabled={deleting}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleDelete}
                    disabled={deleting}
                    className="flex-1 bg-red-600 text-white hover:bg-red-700"
                  >
                    {deleting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      "Delete"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <button
        onClick={openFlow}
        aria-label="Delete project"
        className="absolute top-3 left-3 z-10 p-2 rounded-full bg-black/60 backdrop-blur-md text-gray-300 opacity-0 group-hover:opacity-100 hover:bg-red-600 hover:text-white transition-all duration-200"
      >
        <Trash2 size={14} />
      </button>

      {mounted && createPortal(modal, document.body)}
    </>
  );
}
