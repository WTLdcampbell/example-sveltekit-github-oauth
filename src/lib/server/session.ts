import { PrismaClient } from '@prisma/client';

import { encodeBase32, encodeHexLowerCase } from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";

import type { RequestEvent } from "@sveltejs/kit";

const db = new PrismaClient();

export async function validateSessionToken(token: string): Promise<SessionValidationResult> {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	
	const session = await db.session.findFirst({
		where: {
			id: sessionId
		}
	});

	let user = null;
	if (session) {
		user = await db.user.findFirst({
			where: {
				id: session.user_id
			}
		});

		if (Date.now() >= (new Date(session.expires_at * 1000)).getTime()) {
			db.session.delete({
				where: {
					id: sessionId
				}
			});
			//db.execute("DELETE FROM session WHERE id = ?", [session.id]);
			//return { session: null, user: null };
		}
		if (Date.now() >= (new Date(session.expires_at * 1000)).getTime()) {
			db.session.update({
				where: {
					id: sessionId
				},
				data: {
					expires_at: Date.now() + 1000 * 60 * 60 * 24 * 30
				}
			})
		}
	}
	return { session, user };
}

export function invalidateSession(sessionId: string): void {
	db.session.delete({
		where: {
			id: sessionId
		}
	})
	//db.execute("DELETE FROM session WHERE id = ?", [sessionId]);
}

export function invalidateUserSessions(userId: string): void {
	db.session.delete({
		where: {
			id: userId
		}
	})
	//db.execute("DELETE FROM session WHERE user_id = ?", [userId]);
}

export function setSessionTokenCookie(event: RequestEvent, token: string, expiresAt: number): void {
	event.cookies.set("session", token, {
		httpOnly: true,
		path: "/",
		secure: import.meta.env.PROD,
		sameSite: "lax",
		expires: new Date(expiresAt * 1000)
	});
}

export function deleteSessionTokenCookie(event: RequestEvent): void {
	event.cookies.set("session", "", {
		httpOnly: true,
		path: "/",
		secure: import.meta.env.PROD,
		sameSite: "lax",
		maxAge: 0
	});
}

export function generateSessionToken(): string {
	const tokenBytes = new Uint8Array(20);
	crypto.getRandomValues(tokenBytes);
	const token = encodeBase32(tokenBytes).toLowerCase();
	return token;
}

export function createSession(token: string, userId: string): Session {
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
	const session: Session = {
		id: sessionId,
		userId,
		expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 30
	};
	db.session.create({
		data: {
			id: session.id,
			user_id: session.userId,
			expires_at: session.expiresAt
		}
	});
	/*
	db.execute("INSERT INTO session (id, user_id, expires_at) VALUES (?, ?, ?)", [
		session.id,
		session.userId,
		Math.floor(session.expiresAt.getTime() / 1000)
	]);
	*/
	return session;
}

export interface Session {
	id: string;
	expiresAt: number;
	userId: string;
}

type SessionValidationResult = { session: any ; user: any };
