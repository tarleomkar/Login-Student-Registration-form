import { Pencil, Trash2, UserRound, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

export type Gender = 'male' | 'female' | 'other';

export interface Student {
  _id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: Gender;
  address: string;
  courseEnrolled: string;
}

interface StudentListProps {
  students: Student[];
  onEdit?: (student: Student) => void;
  onDelete?: (studentId: string) => void;
}

function formatGender(gender: Gender): string {
  return gender.charAt(0).toUpperCase() + gender.slice(1);
}

function genderBadgeClass(gender: Gender): string {
  if (gender === 'male') return 'bg-sky-500/15 text-sky-300 ring-sky-500/20';
  if (gender === 'female') return 'bg-pink-500/15 text-pink-300 ring-pink-500/20';
  return 'bg-violet-500/15 text-violet-300 ring-violet-500/20';
}

export default function StudentList({ students, onEdit, onDelete }: StudentListProps) {
  return (
    <Card className="w-full overflow-hidden border-white/10 bg-slate-900/70 shadow-xl shadow-black/10 backdrop-blur-xl">
      <CardHeader className="space-y-4 border-b border-white/5 bg-white/[0.02]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/20">
              <Users className="h-6 w-6" />
            </div>
            <div className="space-y-1.5">
              <CardTitle className="text-xl text-white">Student List</CardTitle>
              <CardDescription className="text-slate-400">
                View and manage registered students
              </CardDescription>
            </div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/40 px-4 py-3 text-sm">
            <p className="text-slate-400">Total Students</p>
            <p className="text-2xl font-semibold text-white">{students.length}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-950/50 text-slate-300">
              <tr>
                <th scope="col" className="px-5 py-4 font-medium">
                  Full Name
                </th>
                <th scope="col" className="px-5 py-4 font-medium">
                  Email
                </th>
                <th scope="col" className="px-5 py-4 font-medium">
                  Phone Number
                </th>
                <th scope="col" className="px-5 py-4 font-medium">
                  Date of Birth
                </th>
                <th scope="col" className="px-5 py-4 font-medium">
                  Gender
                </th>
                <th scope="col" className="px-5 py-4 font-medium">
                  Course Enrolled
                </th>
                <th scope="col" className="px-5 py-4 font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {students.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center">
                    <div className="mx-auto flex max-w-sm flex-col items-center gap-3 text-slate-400">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-800/80">
                        <UserRound className="h-7 w-7" />
                      </div>
                      <p className="text-base font-medium text-slate-300">No students yet</p>
                      <p className="text-sm">Add a student using the form above to populate this list.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr
                    key={student._id}
                    className="transition-colors hover:bg-white/[0.03]"
                  >
                    <td className="whitespace-nowrap px-5 py-4 font-medium text-white">
                      {student.fullName}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-slate-300">{student.email}</td>
                    <td className="whitespace-nowrap px-5 py-4 text-slate-300">
                      {student.phoneNumber}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-slate-300">
                      {student.dateOfBirth}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <span
                        className={cn(
                          'inline-flex rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset',
                          genderBadgeClass(student.gender),
                        )}
                      >
                        {formatGender(student.gender)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-slate-300">
                      {student.courseEnrolled}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex min-w-[9rem] flex-wrap gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="border-amber-400/20 bg-amber-400/10 text-amber-200 hover:bg-amber-400/20 hover:text-amber-100"
                          onClick={() => onEdit?.(student)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="border-red-400/20 bg-red-400/10 text-red-200 hover:bg-red-400/20 hover:text-red-100"
                          onClick={() => onDelete?.(student._id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
