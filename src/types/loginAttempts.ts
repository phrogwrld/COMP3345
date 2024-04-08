export interface LoginAttempt {
	id: string;
	username: string;
	status: LoginStatus;
	timestamp: string;
}

export type LoginStatus = 'SUCCESS' | 'FAILED' | 'LOGOUT';
