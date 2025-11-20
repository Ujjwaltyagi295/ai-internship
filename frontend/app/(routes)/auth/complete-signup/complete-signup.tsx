"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebaseClient";
import { signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

export default function CompleteSignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedName = localStorage.getItem("pendingName");
      const storedEmail = localStorage.getItem("pendingEmail");
      setForm((prev) => ({
        ...prev,
        name: storedName || prev.name,
        email: storedEmail || prev.email,
      }));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);

      // 1️⃣ Sign in via Firebase (same credentials as signup)
      const cred = await signInWithEmailAndPassword(
        auth,
        form.email.trim(),
        form.password
      );

      const user = cred.user;

      if (!user.emailVerified) {
        toast.error(
          "Your email is not verified yet. Please click the verification link sent to your college email."
        );
        return;
      }

      // 2️⃣ Get Firebase ID token
      const firebaseToken = await user.getIdToken();

      // 3️⃣ Call Node backend to create Student + set JWT cookie
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // IMPORTANT for cookies
        body: JSON.stringify({
          firebaseToken,
          name: form.name,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Error completing signup.");
        return;
      }

      // 4️⃣ Success!
      toast.success("Signup completed! Redirecting to dashboard...");
      if (typeof window !== "undefined") {
        localStorage.removeItem("pendingName");
        localStorage.removeItem("pendingEmail");
      }

      router.push("/dashboard/job");
    } catch (err: any) {
      console.error(err);
      toast.error(
        err?.message || "Error completing signup. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6 max-w-xl mx-auto mt-10")}>
      <Card className="overflow-hidden p-0">
        <CardContent className="p-6 md:p-8">
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Complete your signup</h1>
                <p className="text-muted-foreground text-balance">
                  Verify your email, then link your account to the placement portal.
                </p>
              </div>

              <Field>
                <FieldLabel>Name</FieldLabel>
                <Input
                  id="name"
                  placeholder="Ujjwal Tyagi"
                  value={form.name}
                  required
                  onChange={handleChange}
                />
              </Field>

              <Field>
                <FieldLabel>College Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@bennett.edu.in"
                  value={form.email}
                  required
                  onChange={handleChange}
                />
              </Field>

              <Field>
                <FieldLabel>Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  value={form.password}
                  required
                  onChange={handleChange}
                />
              </Field>

              <Field>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Completing..." : "Complete Signup"}
                </Button>
              </Field>

              <FieldDescription className="text-center">
                Make sure you have clicked the verification link sent to your
                college Outlook email before continuing.
              </FieldDescription>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
