import {
  BookOpen,
  CalendarDays,
  Eye,
  EyeOff,
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
import {
  getApiErrorMessage,
  registerStudent,
  updateStudent,
} from '@/services/studentApi';
import type { StudentFormData } from '@/types/student';

export type { StudentFormData } from '@/types/student';

type StudentFormErrors = Partial<Record<keyof StudentFormData, string>>;

export type StudentFormMode = 'register' | 'create' | 'update';

interface StudentFormProps {
  mode?: StudentFormMode;
  studentId?: string;
  initialValues?: Partial<StudentFormData>;
  submitLabel?: string;
  showHeader?: boolean;
  variant?: 'auth' | 'dashboard';
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

function validateStudentForm(values: StudentFormData, isUpdate = false): StudentFormErrors {
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

  if (!isUpdate) {
    if (!values.password) {
      errors.password = 'Password is required';
    } else if (values.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
  }

  return errors;
}

export default function StudentForm({
  mode = 'create',
  studentId,
  initialValues,
  submitLabel,
  showHeader = true,
  variant = 'auth',
  onSubmit,
  onReset,
}: StudentFormProps) {
  const navigate = useNavigate();
  const isDashboard = variant === 'dashboard';
  const isUpdateMode = mode === 'update';
  const resolvedSubmitLabel =
    submitLabel ??
    (mode === 'register' ? 'Register' : mode === 'update' ? 'Update' : 'Save Student');

  const [form, setForm] = useState<StudentFormData>(() => toFormValues(initialValues));
  const [errors, setErrors] = useState<StudentFormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setForm(toFormValues(initialValues));
    setErrors({});
    setSubmitted(false);
    setApiError('');
  }, [initialValues]);

  async function submitToApi(data: StudentFormData) {
    setLoading(true);
    setApiError('');

    try {
      if (mode === 'update' && studentId) {
        await updateStudent(studentId, data);
        navigate('/students');
        return;
      }

      await registerStudent(data);

      if (mode === 'register') {
        navigate('/login');
      } else {
        navigate('/students');
      }
    } catch (error) {
      setApiError(getApiErrorMessage(error, 'Request failed'));
    } finally {
      setLoading(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    setApiError('');

    const validationErrors = validateStudentForm(form, isUpdateMode);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      if (mode === 'register' || mode === 'create' || mode === 'update') {
        void submitToApi(form);
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

  function handleCancel() {
    if (isDashboard) {
      navigate('/students');
      return;
    }
    handleReset();
  }

  const fieldClassName =
    'flex w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 ring-offset-background placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

  const inputClassName = 'border-slate-200 pl-10';
  const labelClassName = 'text-slate-700';
  const iconClassName = 'text-slate-400';

  function handleChange(field: keyof StudentFormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));

    if (submitted) {
      setErrors(validateStudentForm({ ...form, [field]: value }, isUpdateMode));
    }
  }

  const title =
    mode === 'update'
      ? 'Edit Student'
      : mode === 'register'
        ? 'Student Registration'
        : 'Add Student';

  const description =
    mode === 'update'
      ? 'Update student information'
      : 'Enter student details to create a new record';

  return (
    <div className={isDashboard ? 'p-6 lg:p-8' : undefined}>
      {isDashboard && (
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        </div>
      )}

      <Card className="w-full border-slate-200 bg-white shadow-sm">
        {showHeader && !isDashboard && (
          <CardHeader className="space-y-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-600 text-white shadow-md shadow-violet-200">
              <UserRound className="h-8 w-8" />
            </div>
            <div className="space-y-1.5">
              <CardTitle className="text-2xl text-slate-900">{title}</CardTitle>
              <CardDescription className="text-slate-500">{description}</CardDescription>
            </div>
          </CardHeader>
        )}

        <CardContent className={showHeader && !isDashboard ? undefined : 'pt-6'}>
          {apiError && (
            <p className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {apiError}
            </p>
          )}
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullName" className={labelClassName}>Full Name</Label>
                <div className="relative">
                  <UserRound className={cn('pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2', iconClassName)} />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter full name"
                    value={form.fullName}
                    onChange={(event) => handleChange('fullName', event.target.value)}
                    className={inputClassName}
                    disabled={loading}
                  />
                </div>
                {errors.fullName && <p className="text-sm text-red-600">{errors.fullName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="student-email" className={labelClassName}>Email</Label>
                <div className="relative">
                  <Mail className={cn('pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2', iconClassName)} />
                  <Input
                    id="student-email"
                    type="email"
                    autoComplete="email"
                    placeholder="student@example.com"
                    value={form.email}
                    onChange={(event) => handleChange('email', event.target.value)}
                    className={inputClassName}
                    disabled={loading}
                  />
                </div>
                {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber" className={labelClassName}>Phone Number</Label>
                <div className="relative">
                  <Phone className={cn('pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2', iconClassName)} />
                  <Input
                    id="phoneNumber"
                    type="tel"
                    inputMode="numeric"
                    placeholder="9876543210"
                    value={form.phoneNumber}
                    onChange={(event) => handleChange('phoneNumber', event.target.value)}
                    className={inputClassName}
                    disabled={loading}
                  />
                </div>
                {errors.phoneNumber && <p className="text-sm text-red-600">{errors.phoneNumber}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth" className={labelClassName}>Date of Birth</Label>
                <div className="relative">
                  <CalendarDays className={cn('pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2', iconClassName)} />
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={form.dateOfBirth}
                    onChange={(event) => handleChange('dateOfBirth', event.target.value)}
                    className={inputClassName}
                    disabled={loading}
                  />
                </div>
                {errors.dateOfBirth && <p className="text-sm text-red-600">{errors.dateOfBirth}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender" className={labelClassName}>Gender</Label>
                <div className="relative">
                  <Users className={cn('pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2', iconClassName)} />
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
                <Label htmlFor="courseEnrolled" className={labelClassName}>Course Enrolled</Label>
                <div className="relative">
                  <BookOpen className={cn('pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2', iconClassName)} />
                  <Input
                    id="courseEnrolled"
                    type="text"
                    placeholder="MERN Stack"
                    value={form.courseEnrolled}
                    onChange={(event) => handleChange('courseEnrolled', event.target.value)}
                    className={inputClassName}
                    disabled={loading}
                  />
                </div>
                {errors.courseEnrolled && (
                  <p className="text-sm text-red-600">{errors.courseEnrolled}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className={labelClassName}>Address</Label>
              <div className="relative">
                <MapPin className={cn('pointer-events-none absolute left-3 top-3 h-4 w-4', iconClassName)} />
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

            {!isUpdateMode && (
              <div className="space-y-2">
                <Label htmlFor="student-password" className={labelClassName}>Password</Label>
                <div className="relative">
                  <Lock className={cn('pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2', iconClassName)} />
                  <Input
                    id="student-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="Minimum 8 characters"
                    value={form.password}
                    onChange={(event) => handleChange('password', event.target.value)}
                    className={cn(inputClassName, 'pr-10')}
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className={cn('absolute right-3 top-1/2 -translate-y-1/2 hover:text-slate-700', iconClassName)}
                    onClick={() => setShowPassword((prev) => !prev)}
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
              </div>
            )}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                className="border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="lg"
                disabled={loading}
                className="bg-violet-600 text-white shadow-md shadow-violet-200 hover:bg-violet-700"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {loading
                  ? mode === 'register'
                    ? 'Registering...'
                    : mode === 'update'
                      ? 'Updating...'
                      : 'Saving...'
                  : resolvedSubmitLabel}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
