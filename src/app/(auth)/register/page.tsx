"use client";

import { FormEvent, useState } from "react";

export default function RegisterPage() {
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      name: form.get("name"),
      email: form.get("email"),
      password: form.get("password"),
      role: form.get("role"),
    };
    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage("Account created. Check your email for verification. You can now log in.");
    } else {
      setMessage(data.message || "Registration failed");
    }
  }

  return (
    <div className="mx-auto max-w-md space-y-4 card p-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Join AccFlipper</h1>
        <p className="text-sm text-slate-600">Create a buyer or seller account with email verification.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="name" required placeholder="Full name" className="input" />
        <input name="email" type="email" required placeholder="Email" className="input" />
        <input name="password" type="password" required placeholder="Password" className="input" />
        <select name="role" className="input" defaultValue="buyer">
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
        </select>
        <button type="submit" className="btn w-full">Create account</button>
      </form>
      {message && <p className="text-sm text-brand-700">{message}</p>}
    </div>
  );
}
