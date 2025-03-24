// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user?: {
				authenticated: boolean;
				id?: string;
				name?: string;
				role?: string;
			} | null;
		}
		// interface PageData {}
		// interface Platform {}
	};
}

export {};
