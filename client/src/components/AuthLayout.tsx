import { GraduationCap } from 'lucide-react';
import type { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
  footer?: ReactNode;
}

export default function AuthLayout({ children, footer }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="grid min-h-screen lg:grid-cols-[1fr_1fr]">
        <aside className="relative hidden flex-col justify-between border-r border-slate-200 bg-white lg:flex">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-slate-50" />

          <div className="relative z-10 p-10 xl:p-14">
            <div className="mb-10 inline-flex items-center gap-3 rounded-full border border-violet-100 bg-violet-50 px-4 py-2 text-sm font-medium text-violet-700">
              <GraduationCap className="h-4 w-4" />
              Student Management System
            </div>
            <h1 className="max-w-md text-4xl font-semibold leading-tight tracking-tight text-slate-900 xl:text-5xl">
              Manage student records with clarity and confidence.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-slate-600">
              Register students, sign in securely, and manage records from one clean dashboard
              built for your MERN assignment workflow.
            </p>
          </div>

          <div className="relative z-10 grid grid-cols-3 gap-4 p-10 xl:p-14">
            {[
              { label: 'Register', value: 'Create' },
              { label: 'Login', value: 'Access' },
              { label: 'Dashboard', value: 'Manage' },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <p className="text-xs uppercase tracking-wide text-slate-500">{item.label}</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">{item.value}</p>
              </div>
            ))}
          </div>
        </aside>

        <main className="flex items-center justify-center px-4 py-10 sm:px-8">
          <div className="w-full max-w-xl">
            <div className="mb-6 flex items-center gap-3 lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-md shadow-violet-200">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">Student Portal</p>
                <p className="text-xs text-slate-500">Secure student management</p>
              </div>
            </div>

            {children}
            {footer && <div className="mt-6 text-center">{footer}</div>}
          </div>
        </main>
      </div>
    </div>
  );
}
