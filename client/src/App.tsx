import AuthLayout from '@/components/AuthLayout';
import LoginForm from '@/components/LoginForm';
import StudentForm, { type StudentFormData } from '@/components/StudentForm';
import StudentList, { type Student } from '@/components/StudentList';
import { LayoutDashboard, LogOut, UserPlus, Users } from 'lucide-react';
import { useMemo, useState } from 'react';
import { BrowserRouter, Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

function studentToFormValues(student: Student): Partial<StudentFormData> {
  return {
    fullName: student.fullName,
    email: student.email,
    phoneNumber: student.phoneNumber,
    dateOfBirth: student.dateOfBirth,
    gender: student.gender,
    address: student.address,
    courseEnrolled: student.courseEnrolled,
    password: '',
  };
}

function formDataToStudent(data: StudentFormData, id: string): Student {
  return {
    _id: id,
    fullName: data.fullName,
    email: data.email,
    phoneNumber: data.phoneNumber,
    dateOfBirth: data.dateOfBirth,
    gender: data.gender as Student['gender'],
    address: data.address,
    courseEnrolled: data.courseEnrolled,
  };
}

function LoginRoute() {
  const navigate = useNavigate();

  return (
    <AuthLayout
      footer={
        <p className="text-sm text-slate-400">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-medium text-blue-400 hover:text-blue-300 hover:underline">
            Register
          </Link>
        </p>
      }
    >
      <LoginForm onSubmit={() => navigate('/students')} />
    </AuthLayout>
  );
}

function RegisterRoute() {
  const navigate = useNavigate();

  function handleRegister(_data: StudentFormData) {
    navigate('/login');
  }

  return (
    <AuthLayout
      footer={
        <p className="text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-blue-400 hover:text-blue-300 hover:underline">
            Login
          </Link>
        </p>
      }
    >
      <StudentForm submitLabel="Register" onSubmit={handleRegister} />
    </AuthLayout>
  );
}

function StudentsRoute() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const formInitialValues = useMemo(
    () => (editingStudent ? studentToFormValues(editingStudent) : undefined),
    [editingStudent],
  );

  function handleFormSubmit(data: StudentFormData) {
    if (editingStudent) {
      setStudents((prev) =>
        prev.map((student) =>
          student._id === editingStudent._id
            ? formDataToStudent(data, editingStudent._id)
            : student,
        ),
      );
      setEditingStudent(null);
      return;
    }

    setStudents((prev) => [...prev, formDataToStudent(data, String(Date.now()))]);
  }

  function handleFormReset() {
    setEditingStudent(null);
  }

  function handleEdit(student: Student) {
    setEditingStudent(student);
  }

  function handleDelete(studentId: string) {
    setStudents((prev) => prev.filter((student) => student._id !== studentId));

    if (editingStudent?._id === studentId) {
      setEditingStudent(null);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.18),transparent_35%),radial-gradient(circle_at_top_right,rgba(99,102,241,0.15),transparent_40%)]" />

      <div className="relative border-b border-white/10 bg-slate-900/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">Student Dashboard</h1>
              <p className="text-sm text-slate-400">Manage student registration and records</p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            className="border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white"
            onClick={() => navigate('/login')}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-xl">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/15 text-blue-300">
              <Users className="h-5 w-5" />
            </div>
            <p className="text-sm text-slate-400">Total Students</p>
            <p className="mt-1 text-3xl font-semibold text-white">{students.length}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-xl">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/15 text-indigo-300">
              <UserPlus className="h-5 w-5" />
            </div>
            <p className="text-sm text-slate-400">Form Mode</p>
            <p className="mt-1 text-lg font-semibold text-white">
              {editingStudent ? 'Update Student' : 'Create Student'}
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 backdrop-blur-xl sm:col-span-2 xl:col-span-1">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            <p className="text-sm text-slate-400">Current Action</p>
            <p className="mt-1 text-lg font-semibold text-white">
              {editingStudent ? `Editing ${editingStudent.fullName}` : 'Ready to add students'}
            </p>
          </div>
        </div>

        <div className="grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-medium text-white">
                {editingStudent ? 'Update Student' : 'Student Registration Form'}
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Reuse the same form to create a new student or update an existing record.
              </p>
            </div>
            <StudentForm
              key={editingStudent?._id ?? 'create'}
              showHeader={false}
              initialValues={formInitialValues}
              submitLabel={editingStudent ? 'Update Student' : 'Save Student'}
              onSubmit={handleFormSubmit}
              onReset={handleFormReset}
            />
          </section>

          <section className="space-y-4">
            <div>
              <h2 className="text-lg font-medium text-white">Student List</h2>
              <p className="mt-1 text-sm text-slate-400">
                Browse records, edit details, or remove students from the dashboard.
              </p>
            </div>
            <StudentList students={students} onEdit={handleEdit} onDelete={handleDelete} />
          </section>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginRoute />} />
        <Route path="/register" element={<RegisterRoute />} />
        <Route path="/students" element={<StudentsRoute />} />
      </Routes>
    </BrowserRouter>
  );
}
