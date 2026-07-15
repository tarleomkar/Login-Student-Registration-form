import {
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Eye,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  UserRound,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { deleteStudent, fetchStudents, getApiErrorMessage } from '@/services/studentApi';
import type { Student } from '@/types/student';

export type { Student } from '@/types/student';

const PAGE_SIZE = 5;

function formatGender(gender: string): string {
  return gender.charAt(0).toUpperCase() + gender.slice(1);
}

export default function StudentList() {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [viewStudent, setViewStudent] = useState<Student | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Student | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadStudents() {
      try {
        const data = await fetchStudents();
        if (active) {
          setStudents(data);
          setError('');
        }
      } catch (err) {
        if (active) {
          setError(getApiErrorMessage(err, 'Failed to load students'));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadStudents();

    return () => {
      active = false;
    };
  }, []);

  const totalPages = Math.max(1, Math.ceil(students.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return students.slice(start, start + PAGE_SIZE);
  }, [students, currentPage]);

  const rangeStart = students.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(currentPage * PAGE_SIZE, students.length);

  async function handleDeleteConfirm() {
    if (!deleteTarget) return;

    setDeleting(true);
    try {
      await deleteStudent(deleteTarget._id);
      setStudents((prev) => prev.filter((s) => s._id !== deleteTarget._id));
      setDeleteTarget(null);
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to delete student'));
      setDeleteTarget(null);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Student Management</h1>
          <p className="mt-1 text-sm text-slate-500">View and manage registered students</p>
        </div>
        <Button
          asChild
          className="bg-violet-600 text-white shadow-md shadow-violet-200 hover:bg-violet-700"
        >
          <Link to="/students/add">
            <Plus className="h-4 w-4" />
            Add New Student
          </Link>
        </Button>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-24 text-slate-500">
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading students...
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
                  <tr>
                    <th scope="col" className="px-5 py-3.5 font-medium">
                      #
                    </th>
                    <th scope="col" className="px-5 py-3.5 font-medium">
                      Full Name
                    </th>
                    <th scope="col" className="px-5 py-3.5 font-medium">
                      Email
                    </th>
                    <th scope="col" className="px-5 py-3.5 font-medium">
                      Phone
                    </th>
                    <th scope="col" className="px-5 py-3.5 font-medium">
                      Course
                    </th>
                    <th scope="col" className="px-5 py-3.5 font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedStudents.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-16 text-center">
                        <div className="mx-auto flex max-w-sm flex-col items-center gap-3 text-slate-500">
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50">
                            <UserRound className="h-7 w-7 text-violet-400" />
                          </div>
                          <p className="text-base font-medium text-slate-700">No students yet</p>
                          <p className="text-sm">Add a student to get started.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    paginatedStudents.map((student, index) => (
                      <tr key={student._id} className="transition-colors hover:bg-slate-50/80">
                        <td className="whitespace-nowrap px-5 py-4 text-slate-500">
                          {(currentPage - 1) * PAGE_SIZE + index + 1}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 font-medium text-slate-900">
                          {student.fullName}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                          {student.email}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                          {student.phoneNumber}
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                          {student.courseEnrolled}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                              onClick={() => setViewStudent(student)}
                              title="View"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700"
                              onClick={() =>
                                navigate(`/students/edit/${student._id}`, { state: { student } })
                              }
                              title="Edit"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 hover:text-red-700"
                              onClick={() => setDeleteTarget(student)}
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {students.length > 0 && (
              <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-500">
                  Showing {rangeStart} to {rangeEnd} of {students.length} students
                </p>
                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 border-slate-200 bg-white p-0"
                    disabled={currentPage <= 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <Button
                      key={pageNum}
                      type="button"
                      variant={pageNum === currentPage ? 'default' : 'outline'}
                      size="sm"
                      className={cn(
                        'h-8 w-8 p-0',
                        pageNum === currentPage
                          ? 'bg-violet-600 hover:bg-violet-700'
                          : 'border-slate-200 bg-white',
                      )}
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 border-slate-200 bg-white p-0"
                    disabled={currentPage >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <Dialog open={!!viewStudent} onOpenChange={(open) => !open && setViewStudent(null)}>
        <DialogContent className="border-slate-200 bg-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-slate-900">Student Details</DialogTitle>
            <DialogDescription>Full information for this student record.</DialogDescription>
          </DialogHeader>
          {viewStudent && (
            <dl className="space-y-3 text-sm">
              {[
                ['Full Name', viewStudent.fullName],
                ['Email', viewStudent.email],
                ['Phone Number', viewStudent.phoneNumber],
                ['Date of Birth', viewStudent.dateOfBirth],
                ['Gender', formatGender(viewStudent.gender)],
                ['Address', viewStudent.address],
                ['Course Enrolled', viewStudent.courseEnrolled],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="grid grid-cols-3 gap-2 border-b border-slate-100 pb-2 last:border-0"
                >
                  <dt className="font-medium text-slate-500">{label}</dt>
                  <dd className="col-span-2 text-slate-900">{value}</dd>
                </div>
              ))}
            </dl>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              className="border-slate-200 bg-white"
              onClick={() => setViewStudent(null)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && !deleting && setDeleteTarget(null)}
      >
        <DialogContent className="border-slate-200 bg-white sm:max-w-md">
          <DialogHeader className="items-center text-center sm:items-center sm:text-center">
            <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100">
              <AlertTriangle className="h-7 w-7 text-amber-600" />
            </div>
            <DialogTitle className="text-slate-900">Delete Student</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &apos;{deleteTarget?.fullName}&apos;? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button
              type="button"
              variant="outline"
              className="border-slate-200 bg-white"
              disabled={deleting}
              onClick={() => setDeleteTarget(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-red-600 text-white hover:bg-red-700"
              disabled={deleting}
              onClick={() => void handleDeleteConfirm()}
            >
              {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
