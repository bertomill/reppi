// Register page component - Displays the registration form in a centered layout
import RegisterForm from "@/features/auth/components/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <RegisterForm />
    </div>
  );
} 