import {
  BookOpen,
  CalendarDays,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Phone,
  Save,
  UserRound,
  Users,
} from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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
import { cn } from '@/lib/utils';
import api from '@/services/api';
import { encryptFrontend } from '@/utils/crypto';

type Gender = 'male' | 'female' | 'other' | '';

export interface StudentFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: Gender;
  address: string;
  courseEnrolled: string;
  password: string;
}

type StudentFormErrors = Partial<Record<keyof StudentFormData, string>>;

interface StudentFormProps {
  initialValues?: Partial<StudentFormData>;
  submitLabel?: string;
  showHeader?: boolean;
  onSubmit?: (data: StudentFormData) => void;
  onReset?: () => void;
}

const emptyForm: StudentFormData = {
  fullName: '',
  email: '',
  phoneNumber: '',
  dateOfBirth: '',
  gender: '',
  address: '',
  courseEnrolled: '',
  password: '',
};

function toFormValues(initialValues?: Partial<StudentFormData>): StudentFormData {
  return {
    ...emptyForm,
    ...initialValues,
  };
}

function validateStudentForm(values: StudentFormData): StudentFormErrors {
  const errors: StudentFormErrors = {};

  if (!values.fullName.trim()) {
    errors.fullName = 'Full name is required';
  }

  if (!values.email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
    errors.email = 'Enter a valid email address';
  }

  if (!values.phoneNumber.trim()) {
    errors.phoneNumber = 'Phone number is required';
  } else if (!/^\d{10}$/.test(values.phoneNumber)) {
    errors.phoneNumber = 'Phone number must be 10 digits';
  }

  if (!values.dateOfBirth) {
    errors.dateOfBirth = 'Date of birth is required';
  }

  if (!values.gender) {
    errors.gender = 'Gender is required';
  } else if (!['male', 'female', 'other'].includes(values.gender)) {
    errors.gender = 'Select a valid gender';
  }

  if (!values.address.trim()) {
    errors.address = 'Address is required';
  }

  if (!values.courseEnrolled.trim()) {
    errors.courseEnrolled = 'Course enrolled is required';
  }

  if (!values.password) {
    errors.password = 'Password is required';
  } else if (values.password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }

  return errors;
}

interface ApiResponse {
  success: boolean;
  message: string;
}

function encryptFormData(data: StudentFormData): Record<string, string> {
  return {
    fullName: encryptFrontend(data.fullName),
    email: encryptFrontend(data.email),
    phoneNumber: encryptFrontend(data.phoneNumber),
    dateOfBirth: encryptFrontend(data.dateOfBirth),
    gender: encryptFrontend(data.gender),
    address: encryptFrontend(data.address),
    courseEnrolled: encryptFrontend(data.courseEnrolled),
    password: encryptFrontend(data.password),
  };
}

function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const message = (error.response?.data as ApiResponse | undefined)?.message;
    return message ?? fallback;
  }
  return error instanceof Error ? error.message : fallback;
}

export default function StudentForm({
  initialValues,
  submitLabel = 'Save Student',
  showHeader = true,
  onSubmit,
  onReset,
}: StudentFormProps) {
  const navigate = useNavigate();
  const isRegistration = submitLabel === 'Register';
  const [form, setForm] = useState<StudentFormData>(() => toFormValues(initialValues));
  const [errors, setErrors] = useState<StudentFormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    setForm(toFormValues(initialValues));
    setErrors({});
    setSubmitted(false);
    setApiError('');
  }, [initialValues]);

  async function registerStudent(data: StudentFormData) {
    setLoading(true);
    setApiError('');

    try {
      await api.post<ApiResponse>('/register', encryptFormData(data));
      navigate('/login');
    } catch (error) {
      setApiError(getApiErrorMessage(error, 'Registration failed'));
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    setApiError('');

    const validationErrors = validateStudentForm(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      if (isRegistration) {
        void registerStudent(form);
        return;
      }

      onSubmit?.(form);
    }
  }

  function handleReset() {
    setForm(toFormValues(initialValues));
    setErrors({});
    setSubmitted(false);
    setApiError('');
    onReset?.();
  }

  const fieldClassName =
    'flex w-full rounded-md border border-input bg-slate-950/40 px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

  function handleChange(field: keyof StudentFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));

    if (submitted) {
      setErrors(validateStudentForm({ ...form, [field]: value }));
    }
  }

  return (
    <Card className="w-full border-white/10 bg-slate-900/70 shadow-xl shadow-black/10 backdrop-blur-xl">
      {showHeader && (
        <CardHeader className="space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30">
            <UserRound className="h-8 w-8" />
          </div>
          <div className="space-y-1.5">
            <CardTitle className="text-2xl text-white">Student Registration</CardTitle>
            <CardDescription className="text-slate-400">
              Enter student details to create or update a record
            </CardDescription>
          </div>
        </CardHeader>
      )}

      <CardContent className={showHeader ? undefined : 'pt-6'}>
        {apiError && (
          <p className="mb-5 rounded-lg border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
            {apiError}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <div className="relative">
                <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter full name"
                  value={form.fullName}
                  onChange={(event) => handleChange('fullName', event.target.value)}
                  className="pl-10"
                  disabled={loading}
                />
              </div>
              {errors.fullName && <p className="text-sm text-red-600">{errors.fullName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="student-email">Email</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="student-email"
                  type="email"
                  autoComplete="email"
                  placeholder="student@example.com"
                  value={form.email}
                  onChange={(event) => handleChange('email', event.target.value)}
                  className="pl-10"
                  disabled={loading}
                />
              </div>
              {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <div className="relative">
                <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="phoneNumber"
                  type="tel"
                  inputMode="numeric"
                  placeholder="9876543210"
                  value={form.phoneNumber}
                  onChange={(event) => handleChange('phoneNumber', event.target.value)}
                  className="pl-10"
                  disabled={loading}
                />
              </div>
              {errors.phoneNumber && <p className="text-sm text-red-600">{errors.phoneNumber}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <div className="relative">
                <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={form.dateOfBirth}
                  onChange={(event) => handleChange('dateOfBirth', event.target.value)}
                  className="pl-10"
                  disabled={loading}
                />
              </div>
              {errors.dateOfBirth && <p className="text-sm text-red-600">{errors.dateOfBirth}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <div className="relative">
                <Users className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <select
                  id="gender"
                  value={form.gender}
                  onChange={(event) => handleChange('gender', event.target.value)}
                  className={cn(fieldClassName, 'h-10 appearance-none pl-10')}
                  disabled={loading}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              {errors.gender && <p className="text-sm text-red-600">{errors.gender}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="courseEnrolled">Course Enrolled</Label>
              <div className="relative">
                <BookOpen className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="courseEnrolled"
                  type="text"
                  placeholder="MERN Stack"
                  value={form.courseEnrolled}
                  onChange={(event) => handleChange('courseEnrolled', event.target.value)}
                  className="pl-10"
                  disabled={loading}
                />
              </div>
              {errors.courseEnrolled && (
                <p className="text-sm text-red-600">{errors.courseEnrolled}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <textarea
                id="address"
                rows={3}
                placeholder="City, State"
                value={form.address}
                onChange={(event) => handleChange('address', event.target.value)}
                className={cn(fieldClassName, 'min-h-24 resize-y pl-10 pt-2.5')}
                disabled={loading}
              />
            </div>
            {errors.address && <p className="text-sm text-red-600">{errors.address}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="student-password">Password</Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="student-password"
                type="password"
                autoComplete="new-password"
                placeholder="Minimum 8 characters"
                value={form.password}
                onChange={(event) => handleChange('password', event.target.value)}
                className="pl-10"
                disabled={loading}
              />
            </div>
            {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
          </div>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              className="border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white"
              onClick={handleReset}
              disabled={loading}
            >
              Reset
            </Button>
            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/25 hover:from-blue-500 hover:to-indigo-500"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {loading ? (isRegistration ? 'Registering...' : 'Saving...') : submitLabel}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
