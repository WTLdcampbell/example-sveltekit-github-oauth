import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

export async function createUser(github_id: number, email: string, username: string): Promise<User> {
	const newuser = await db.user.create({
		data: {
			github_id,
			email,
			username
		}
	})

	if (newuser === null) {
		throw new Error("Unexpected error");
	}
	const user = getUserFromGitHubId(github_id);

	return user;
}

export async function getUserFromGitHubId(gitHubId: number): Promise<User> {
	const result = await db.user.findFirst({
		where: {
			github_id: gitHubId
		}
	})

	if (result === null) {
		throw new Error("User not found");
	}
	const user: User = {
		id: result.id,
		gitHubId: result.github_id,
		email: result.email,
		username: result.username ?? "default_username"
	};
	return user;
}

export interface User {
	id: string;
	email: string;
	gitHubId: number;
	username: string;
}
