import LoginForm from "./login-form";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8">
      <h1 className="text-3xl font-bold">Monitor - Outbound</h1>
      <LoginForm />
    </div>
  );
}
