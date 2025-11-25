"use client";

import { FormEvent, useState } from "react";

export default function LoginPage() {
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      email: form.get("email"),
      password: form.get("password"),
    };
    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      setMessage("Signed in. Redirecting...");
      window.location.href = "/orders";
    } else {
      const data = await res.json();
      setMessage(data.message || "Login failed");
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-4 card p-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Welcome back</h1>
        <p className="text-sm text-slate-600">Access your dashboard and ongoing deals.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="email" type="email" required placeholder="Email" className="input" />
        <input name="password" type="password" required placeholder="Password" className="input" />
        <button type="submit" className="btn w-full">Sign in</button>
      </form>
      {message && <p className="text-sm text-amber-600">{message}</p>}
      <p className="text-sm text-slate-600">
        New here? <a className="text-brand-700 underline" href="/auth/register">Create an account</a>
      </p>
    </div>
  );
}
