import { Link } from 'react-router-dom';
import StudentForm from '@/components/StudentForm';

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <div className="flex w-full max-w-3xl flex-col items-center gap-4">
        <StudentForm submitLabel="Register" />
        <p className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
