export function query<T>(selectors: string): T;
export function query<T>(element: any, selectors: string): T;
export function query<T>(element: any, selectors?: string): T {
	if (selectors === undefined) {
		selectors = element;
		element = document;
	}
	return element.querySelector(selectors);
}

export async function querySync<T>(selectors: string): Promise<T>;
export async function querySync<T>(element: any, selectors: string): Promise<T>;
export async function querySync<T>(
	element: any,
	selectors?: string,
): Promise<T> {
	return new Promise<T>((resolve) => {
		if (selectors === undefined) {
			selectors = element;
			element = document;
		}

		let result = query<T>(element, selectors!);
		if (result) {
			resolve(result);
			return;
		}

		const observer = new MutationObserver(() => {
			result = query<T>(element, selectors!);
			if (result) {
				observer.disconnect();
				resolve(result);
			}
		});
		observer.observe(element, { childList: true, subtree: true });
	});
}
