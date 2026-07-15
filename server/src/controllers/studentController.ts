import { Request, Response } from 'express';
import Student from '../models/Student';
import {
  decryptBackend,
  decryptFrontend,
  encryptBackend,
  encryptFrontend,
} from '../utils/crypto';

function isDuplicateKeyError(error: unknown): boolean {
  return typeof error === 'object' && error !== null && 'code' in error && (error as { code: number }).code === 11000;
}

/**
 * POST /api/register
 * Frontend encrypt → decryptFrontend → validate → encryptBackend → Student.create
 */
export async function registerStudent(req: Request, res: Response): Promise<void> {
  try {
    const { fullName, email, phoneNumber, dateOfBirth, gender, address, courseEnrolled, password } =
      req.body;

    // 1. Decrypt every field sent from the frontend
    const plain = {
      fullName: decryptFrontend(fullName),
      email: decryptFrontend(email),
      phoneNumber: decryptFrontend(phoneNumber),
      dateOfBirth: decryptFrontend(dateOfBirth),
      gender: decryptFrontend(gender),
      address: decryptFrontend(address),
      courseEnrolled: decryptFrontend(courseEnrolled),
      password: decryptFrontend(password),
    };

    // 2. Validate decrypted plaintext
    if (
      !plain.fullName ||
      !plain.email ||
      !plain.phoneNumber ||
      !plain.dateOfBirth ||
      !plain.gender ||
      !plain.address ||
      !plain.courseEnrolled ||
      !plain.password
    ) {
      res.status(400).json({ success: false, message: 'All fields are required' });
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(plain.email)) {
      res.status(400).json({ success: false, message: 'Invalid email address' });
      return;
    }

    if (!['male', 'female', 'other'].includes(plain.gender.toLowerCase())) {
      res.status(400).json({ success: false, message: 'Gender must be male, female, or other' });
      return;
    }

    if (plain.password.length < 8) {
      res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
      return;
    }

    // 3. Encrypt with backend key before saving
    const encryptedForDb = {
      fullName: encryptBackend(plain.fullName),
      email: encryptBackend(plain.email.toLowerCase()),
      phoneNumber: encryptBackend(plain.phoneNumber),
      dateOfBirth: encryptBackend(plain.dateOfBirth),
      gender: encryptBackend(plain.gender.toLowerCase()),
      address: encryptBackend(plain.address),
      courseEnrolled: encryptBackend(plain.courseEnrolled),
      password: encryptBackend(plain.password),
    };

    const student = await Student.create(encryptedForDb);

    // _id stays plain — never encrypt MongoDB ids
    res.status(201).json({
      success: true,
      message: 'Student registered successfully',
      data: { _id: student._id },
    });
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      res.status(409).json({ success: false, message: 'Email already exists' });
      return;
    }
    const message = error instanceof Error ? error.message : 'Registration failed';
    res.status(400).json({ success: false, message });
  }
}

/**
 * GET /api/students
 * Student.find → decryptBackend → encryptFrontend → return
 */
export async function getStudents(_req: Request, res: Response): Promise<void> {
  try {
    const students = await Student.find();

    // Decrypt backend ciphertext, then encrypt for frontend. _id stays plain.
    const data = students.map((student) => ({
      _id: student._id,
      fullName: encryptFrontend(decryptBackend(student.fullName)),
      email: encryptFrontend(decryptBackend(student.email)),
      phoneNumber: encryptFrontend(decryptBackend(student.phoneNumber)),
      dateOfBirth: encryptFrontend(decryptBackend(student.dateOfBirth)),
      gender: encryptFrontend(decryptBackend(student.gender)),
      address: encryptFrontend(decryptBackend(student.address)),
      courseEnrolled: encryptFrontend(decryptBackend(student.courseEnrolled)),
    }));

    res.status(200).json({
      success: true,
      message: 'Students fetched successfully',
      data,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to fetch students';
    res.status(500).json({ success: false, message });
  }
}

/**
 * PUT /api/student/:id
 * Frontend encrypt → decryptFrontend → validate → encryptBackend → findByIdAndUpdate
 */
export async function updateStudent(req: Request, res: Response): Promise<void> {
  try {
    const id = String(req.params.id);
    const { fullName, email, phoneNumber, dateOfBirth, gender, address, courseEnrolled, password } =
      req.body;

    const plain = {
      fullName: decryptFrontend(fullName),
      email: decryptFrontend(email),
      phoneNumber: decryptFrontend(phoneNumber),
      dateOfBirth: decryptFrontend(dateOfBirth),
      gender: decryptFrontend(gender),
      address: decryptFrontend(address),
      courseEnrolled: decryptFrontend(courseEnrolled),
      password: password ? decryptFrontend(password) : '',
    };

    if (
      !plain.fullName ||
      !plain.email ||
      !plain.phoneNumber ||
      !plain.dateOfBirth ||
      !plain.gender ||
      !plain.address ||
      !plain.courseEnrolled
    ) {
      res.status(400).json({ success: false, message: 'All fields are required' });
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(plain.email)) {
      res.status(400).json({ success: false, message: 'Invalid email address' });
      return;
    }

    if (!['male', 'female', 'other'].includes(plain.gender.toLowerCase())) {
      res.status(400).json({ success: false, message: 'Gender must be male, female, or other' });
      return;
    }

    if (plain.password && plain.password.length < 8) {
      res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
      return;
    }

    const updatePayload: Record<string, string> = {
      fullName: encryptBackend(plain.fullName),
      email: encryptBackend(plain.email.toLowerCase()),
      phoneNumber: encryptBackend(plain.phoneNumber),
      dateOfBirth: encryptBackend(plain.dateOfBirth),
      gender: encryptBackend(plain.gender.toLowerCase()),
      address: encryptBackend(plain.address),
      courseEnrolled: encryptBackend(plain.courseEnrolled),
    };

    if (plain.password) {
      updatePayload.password = encryptBackend(plain.password);
    }

    const updated = await Student.findByIdAndUpdate(
      id,
      updatePayload,
      { new: true, runValidators: true },
    );

    if (!updated) {
      res.status(404).json({ success: false, message: 'Student not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Student updated successfully',
      data: {
        _id: updated._id,
        fullName: encryptFrontend(decryptBackend(updated.fullName)),
        email: encryptFrontend(decryptBackend(updated.email)),
        phoneNumber: encryptFrontend(decryptBackend(updated.phoneNumber)),
        dateOfBirth: encryptFrontend(decryptBackend(updated.dateOfBirth)),
        gender: encryptFrontend(decryptBackend(updated.gender)),
        address: encryptFrontend(decryptBackend(updated.address)),
        courseEnrolled: encryptFrontend(decryptBackend(updated.courseEnrolled)),
      },
    });
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      res.status(409).json({ success: false, message: 'Email already exists' });
      return;
    }
    const message = error instanceof Error ? error.message : 'Failed to update student';
    res.status(400).json({ success: false, message });
  }
}

/**
 * DELETE /api/student/:id
 * Delete by MongoDB _id only (id is never encrypted)
 */
export async function deleteStudent(req: Request, res: Response): Promise<void> {
  try {
    const id = String(req.params.id);

    const deleted = await Student.findByIdAndDelete(id);

    if (!deleted) {
      res.status(404).json({ success: false, message: 'Student not found' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'Student deleted successfully',
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete student';
    res.status(500).json({ success: false, message });
  }
}
