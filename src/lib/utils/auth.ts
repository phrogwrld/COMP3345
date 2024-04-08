import prisma from '$lib/database/prisma';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';
import { LoginStatus } from '@prisma/client';

export function createSession(userId: number, role: string) {
	const token = jwt.sign({ userId, role }, JWT_SECRET, {
		expiresIn: '1h'
	});

	return token;
}

export function verifySession(token: string) {
	try {
		const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; role: string };
		return decoded;
	} catch {
		return null;
	}
}

export async function getUserByUsername(username: string) {
	return await prisma.user.findUnique({
		where: { username }
	});
}

export async function createLoginAttempt(userId: number, status: LoginStatus) {
	await prisma.loginAttempt.create({
		data: {
			userId: userId,
			status: status
		}
	});
}

export async function createLogoutAttempt(userId: number) {
	await prisma.loginAttempt.create({
		data: {
			userId: userId,
			status: LoginStatus.LOGOUT
		}
	});
}

export async function getUserLoginAttempts(userId: number) {
	return await prisma.loginAttempt.findMany({
		where: { userId }
	});
}

export async function blockUser(userId: number) {
	await prisma.user.update({
		where: { id: userId },
		data: { disabled: true }
	});
}

export async function unblockUser(userId: number) {
	await prisma.user.update({
		where: { id: userId },
		data: { disabled: false }
	});
}

export async function getLoginAttempts() {
	return await prisma.loginAttempt.findMany();
}

export async function saveColorPreference(colorPreference: string | null) {
	await prisma.user.update({
		where: { id: userId },
		data: { colorPreference }
	});
}
