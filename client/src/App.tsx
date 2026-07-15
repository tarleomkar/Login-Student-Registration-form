import AuthLayout from '@/components/AuthLayout';
import DashboardLayout from '@/components/DashboardLayout';
import LoginForm from '@/components/LoginForm';
import StudentForm from '@/components/StudentForm';
import StudentList from '@/components/StudentList';
import type { Student } from '@/types/student';
import {
  BrowserRouter,
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';

function studentToFormValues(student: Student) {
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

function LoginRoute() {
  const navigate = useNavigate();

  return (
    <AuthLayout
      footer={
        <p className="text-sm text-slate-500">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-medium text-violet-600 hover:text-violet-700 hover:underline">
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
  return (
    <AuthLayout
      footer={
        <p className="text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-violet-600 hover:text-violet-700 hover:underline">
            Login
          </Link>
        </p>
      }
    >
      <StudentForm mode="register" submitLabel="Register" />
    </AuthLayout>
  );
}

function AddStudentRoute() {
  return (
    <StudentForm mode="create" variant="dashboard" showHeader={false} submitLabel="Save Student" />
  );
}

function EditStudentRoute() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const stateStudent = (location.state as { student?: Student } | null)?.student ?? null;

  if (!id) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600">Student not found</p>
        <button
          type="button"
          className="mt-4 text-sm text-violet-600 hover:underline"
          onClick={() => navigate('/students')}
        >
          Back to student list
        </button>
      </div>
    );
  }

  if (!stateStudent) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-600">Open edit from the student list.</p>
        <button
          type="button"
          className="mt-4 text-sm text-violet-600 hover:underline"
          onClick={() => navigate('/students')}
        >
          Back to student list
        </button>
      </div>
    );
  }

  return (
    <StudentForm
      key={stateStudent._id}
      mode="update"
      studentId={id}
      variant="dashboard"
      showHeader={false}
      initialValues={studentToFormValues(stateStudent)}
      submitLabel="Update"
    />
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginRoute />} />
        <Route path="/register" element={<RegisterRoute />} />
        <Route path="/students" element={<DashboardLayout />}>
          <Route index element={<StudentList />} />
          <Route path="add" element={<AddStudentRoute />} />
          <Route path="edit/:id" element={<EditStudentRoute />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
