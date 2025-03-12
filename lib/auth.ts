// lib/auth.ts
import { compare, hash } from 'bcryptjs'

// Συνάρτηση για τη δημιουργία hash του password
export async function hashPassword(password: string): Promise<string> {
  return await hash(password, 12)
}

// Συνάρτηση για τον έλεγχο του password
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return await compare(password, hashedPassword)
}