// Login page component - Displays the login form in a centered layout
import LoginForm from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <LoginForm />
    </div>
  );
} 