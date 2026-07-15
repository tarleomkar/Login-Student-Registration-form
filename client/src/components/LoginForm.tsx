import { GraduationCap, Lock, LogIn, Mail } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginFormErrors {
  email?: string;
  password?: string;
}

const initialForm: LoginFormData = {
  email: '',
  password: '',
};

interface LoginFormProps {
  onSubmit?: (data: LoginFormData) => void;
}

function validateLoginForm(values: LoginFormData): LoginFormErrors {
  const errors: LoginFormErrors = {};

  if (!values.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
    errors.email = 'Enter a valid email address';
  }

  if (!values.password) {
    errors.password = 'Password is required';
  } else if (values.password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }

  return errors;
}

export default function LoginForm({ onSubmit }: LoginFormProps) {
  const [form, setForm] = useState<LoginFormData>(initialForm);
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  function handleChange(field: keyof LoginFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));

    if (submitted) {
      setErrors(validateLoginForm({ ...form, [field]: value }));
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);

    const validationErrors = validateLoginForm(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      onSubmit?.(form);
    }
  }

  return (
    <Card className="w-full border-slate-200 bg-white shadow-sm">
      <CardHeader className="space-y-4 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-md shadow-violet-200">
          <GraduationCap className="h-8 w-8" />
        </div>
        <div className="space-y-1.5">
          <CardTitle className="text-2xl text-slate-900">Welcome back</CardTitle>
          <CardDescription className="text-slate-500">
            Sign in to manage student records
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-700">
              Email
            </Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(event) => handleChange('email', event.target.value)}
                className="border-slate-200 pl-10"
              />
            </div>
            {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-700">
              Password
            </Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="Enter your password"
                value={form.password}
                onChange={(event) => handleChange('password', event.target.value)}
                className="border-slate-200 pl-10"
              />
            </div>
            {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
          </div>

          <Button
            type="submit"
            className="w-full bg-violet-600 text-white shadow-md shadow-violet-200 hover:bg-violet-700"
            size="lg"
          >
            <LogIn className="h-4 w-4" />
            Login
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
