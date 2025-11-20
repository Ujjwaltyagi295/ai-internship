
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
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import useAuthStore from "@/store/authStore";
import { toast } from "sonner";

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

  const { signup, loading } = useAuthStore();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await signup(form);

    if (!res.success) {
      toast.error("Signup failed. Please check your details.");
      return;
    }

    toast.success("Signup successful! Redirecting...");
    router.push("/dashboard/job");
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
                  placeholder="m@example.com"
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
                <Button disabled={loading} type="submit">
                  {loading ? "Signing up..." : "Sign Up"}
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
