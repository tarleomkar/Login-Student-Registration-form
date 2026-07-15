import axios from 'axios';
import type { ApiResponse, EncryptedStudent, Student, StudentFormData } from '@/types/student';
import { decryptFrontend, encryptFrontend } from '@/utils/crypto';
import api from './api';

function encryptUpdateData(data: StudentFormData): Record<string, string> {
  const payload: Record<string, string> = {
    fullName: encryptFrontend(data.fullName),
    email: encryptFrontend(data.email),
    phoneNumber: encryptFrontend(data.phoneNumber),
    dateOfBirth: encryptFrontend(data.dateOfBirth),
    gender: encryptFrontend(data.gender),
    address: encryptFrontend(data.address),
    courseEnrolled: encryptFrontend(data.courseEnrolled),
  };

  if (data.password.trim()) {
    payload.password = encryptFrontend(data.password);
  }

  return payload;
}

function encryptFormData(data: StudentFormData): Record<string, string> {
  return {
    ...encryptUpdateData(data),
    password: encryptFrontend(data.password),
  };
}

function decryptStudent(record: EncryptedStudent): Student {
  return {
    _id: record._id,
    fullName: decryptFrontend(record.fullName),
    email: decryptFrontend(record.email),
    phoneNumber: decryptFrontend(record.phoneNumber),
    dateOfBirth: decryptFrontend(record.dateOfBirth),
    gender: decryptFrontend(record.gender) as Student['gender'],
    address: decryptFrontend(record.address),
    courseEnrolled: decryptFrontend(record.courseEnrolled),
  };
}

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const message = (error.response?.data as ApiResponse | undefined)?.message;
    return message ?? fallback;
  }
  return error instanceof Error ? error.message : fallback;
}

let studentsRequest: Promise<Student[]> | null = null;

async function requestStudents(): Promise<Student[]> {
  const response = await api.get<ApiResponse<EncryptedStudent[]>>('/students');
  const records = response.data.data ?? [];
  return records.map(decryptStudent);
}

export function invalidateStudentsCache(): void {
  studentsRequest = null;
}

export async function fetchStudents(force = false): Promise<Student[]> {
  if (!force && studentsRequest) {
    return studentsRequest;
  }

  studentsRequest = requestStudents().finally(() => {
    studentsRequest = null;
  });

  return studentsRequest;
}

export async function registerStudent(data: StudentFormData): Promise<void> {
  await api.post<ApiResponse>('/register', encryptFormData(data));
  invalidateStudentsCache();
}

export async function updateStudent(id: string, data: StudentFormData): Promise<Student> {
  const response = await api.put<ApiResponse<EncryptedStudent>>(`/student/${id}`, encryptUpdateData(data));
  invalidateStudentsCache();
  if (!response.data.data) {
    throw new Error('Update response missing student data');
  }
  return decryptStudent(response.data.data);
}

export async function deleteStudent(id: string): Promise<void> {
  await api.delete<ApiResponse>(`/student/${id}`);
  invalidateStudentsCache();
}
