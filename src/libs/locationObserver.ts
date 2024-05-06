let href: string;
export function locationObserver(callback?: (href: string) => void) {
	new MutationObserver(() => {
		const newHref = location.href;
		if (href !== newHref) {
			href = newHref;
			if (callback) callback(href);
		}
	}).observe(document.body, { childList: true, subtree: true });
}
