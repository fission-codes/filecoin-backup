/// <reference types="@sveltejs/kit" />

declare namespace Intl {
	interface DateTimeFormatOptions {
		dateStyle: 'full' | 'long' | 'medium' | 'short';
		timeStyle: 'full' | 'long' | 'medium' | 'short';
	}
}