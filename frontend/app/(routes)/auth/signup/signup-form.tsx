"use client";

import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

// NEW: firebase
import { auth } from "@/lib/firebaseClient";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";

// (optional) you can still keep useAuthStore for login only
// import useAuthStore from "@/store/authStore";

function isBennettEmail(email: string) {
  return email.trim().toLowerCase().endsWith("@bennett.edu.in");
}

export function Signup({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false); // local loading instead of store

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isBennettEmail(form.email)) {
      toast.error("Please use your @bennett.edu.in college email.");
      return;
    }

    try {
      setLoading(true);

      // 1️⃣ Create Firebase user
      const userCred = await createUserWithEmailAndPassword(
        auth,
        form.email.trim(),
        form.password
      );

      // 2️⃣ Send verification email
      await sendEmailVerification(userCred.user);

      // 3️⃣ Store name/email so we can prefill in the next step
      if (typeof window !== "undefined") {
        localStorage.setItem("pendingName", form.name);
        localStorage.setItem("pendingEmail", form.email.trim());
      }

      toast.success(
        "Account created. Verification email sent to your college inbox. Please verify, then complete signup."
      );

      // 4️⃣ Go to the second step
      router.push("/auth/complete-signup");
    } catch (err: any) {
      console.error(err);
      toast.error(
        err?.message || "Signup failed. Please check your details."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Create your account</h1>
                <p className="text-muted-foreground text-balance">
                  Sign up to access your dashboard
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
                <FieldLabel>Email</FieldLabel>
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
                <Button disabled={loading} type="submit" className="w-full">
                  {loading ? "Creating account..." : "Sign Up"}
                </Button>
              </Field>

              <div className="text-center mt-4 text-sm">
                Already have an account?{" "}
                <button
                  type="button"
                  className="underline hover:text-primary"
                  onClick={() => router.push("/auth/login")}
                >
                  Login
                </button>
              </div>
            </FieldGroup>
          </form>

          <div className="bg-muted relative hidden md:block">
            <img
              src="/formimg.jpg"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>

      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our{" "}
        <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
