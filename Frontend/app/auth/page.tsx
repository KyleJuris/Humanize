import { OtpAuthForm } from "@/components/otp-auth-form"

export default function AuthPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-100 to-green-50 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-700 text-white font-bold text-sm">
              HP
            </div>
            <span className="font-bold text-xl text-slate-900">HumanizePro</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome</h1>
          <p className="text-slate-600 mt-2">Sign in or create an account</p>
        </div>
        <OtpAuthForm />
      </div>
    </div>
  )
}
