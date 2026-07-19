import { AuthForm } from "@/components/AuthForm";

export default function SignUpPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
      <AuthForm mode="sign-up" />
    </main>
  );
}
