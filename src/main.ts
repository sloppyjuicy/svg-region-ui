import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {}
});

export default app;

(window as any).debug = true;
console.log('Debug');
