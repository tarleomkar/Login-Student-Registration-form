import mongoose, { Document, Schema } from 'mongoose';

export interface IStudent extends Document {
  fullName: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  courseEnrolled: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

// Fields are stored as AES ciphertext strings (validated in the controller as plaintext).
const studentSchema = new Schema<IStudent>(
  {
    fullName: { 
      type: String,
      required: true
    },
    email: { 
      type: String,
      required: true,
      unique: true
    },
    phoneNumber: {
      type: String,
      required: true
    },
    dateOfBirth: { 
      type: String,
      required: true
    },
    gender: { 
      type: String,
      required: true
    },
    address: { 
      type: String,
      required: true
    },
    courseEnrolled: { 
      type: String,
      required: true
    },
    password: { 
      type: String,
      required: true, 
      select: false 
    },
  },
  { timestamps: true },
);

const Student = mongoose.model<IStudent>('Student', studentSchema);

export default Student;
