"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { createClient } from "@/utils/supabase/client";

type AuthMode = "sign-in" | "sign-up";

export function AuthForm({ mode }: { mode: AuthMode }) {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSignUp = mode === "sign-up";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    const fullName = String(formData.get("fullName") ?? "");
    const supabase = createClient();

    const result = isSignUp
      ? await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        })
      : await supabase.auth.signInWithPassword({ email, password });

    setIsSubmitting(false);

    if (result.error) {
      setError(result.error.message);
      return;
    }

    setMessage(isSignUp ? "Account created. Check your email if confirmation is enabled." : "Signed in successfully.");
  }

  return (
    <div className="rounded-[2rem] border border-rose-100 bg-white p-8 shadow-sm">
      <p className="text-sm font-bold uppercase tracking-[0.3em] text-rose-700">Customer account</p>
      <h1 className="mt-3 text-3xl font-black text-stone-950">{isSignUp ? "Create an account" : "Sign in"}</h1>
      <p className="mt-3 leading-7 text-stone-600">
        {isSignUp
          ? "Create a buyer account for order history, saved addresses, and a smoother handmade checkout experience."
          : "Sign in to view order history, saved addresses, and faster checkout."}
      </p>

      <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
        {isSignUp ? (
          <label className="block text-sm font-bold text-stone-800" htmlFor="fullName">
            Full name
            <input id="fullName" name="fullName" type="text" autoComplete="name" required className="mt-2 w-full rounded-2xl border border-stone-200 px-4 py-3 font-normal outline-none focus:border-rose-600 focus:ring-4 focus:ring-rose-100" />
          </label>
        ) : null}
        <label className="block text-sm font-bold text-stone-800" htmlFor="email">
          Email address
          <input id="email" name="email" type="email" autoComplete="email" required className="mt-2 w-full rounded-2xl border border-stone-200 px-4 py-3 font-normal outline-none focus:border-rose-600 focus:ring-4 focus:ring-rose-100" />
        </label>
        <label className="block text-sm font-bold text-stone-800" htmlFor="password">
          Password
          <input id="password" name="password" type="password" autoComplete={isSignUp ? "new-password" : "current-password"} minLength={isSignUp ? 8 : undefined} required className="mt-2 w-full rounded-2xl border border-stone-200 px-4 py-3 font-normal outline-none focus:border-rose-600 focus:ring-4 focus:ring-rose-100" />
        </label>
        {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p> : null}
        {message ? <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">{message}</p> : null}
        <button className="w-full rounded-full bg-stone-950 px-5 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-60" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Please wait..." : isSignUp ? "Create account" : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-stone-600">
        {isSignUp ? "Already have an account? " : "New to Crochetella? "}
        <Link className="font-bold text-rose-700" href={isSignUp ? "/auth/sign-in" : "/auth/sign-up"}>
          {isSignUp ? "Sign in" : "Create an account"}
        </Link>
      </p>
    </div>
  );
}
