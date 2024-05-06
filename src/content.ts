import { locationObserver } from './libs/locationObserver';

const apiUrl = 'http://127.0.0.1:2442/api/nowPlaying';

let [_vid, __vid, vid]: [string | null, string | null, string | null] = [
	null,
	null,
	null,
];
let isChanged = false;

async function postToApi(videoId: string, time: number) {
	await fetch(apiUrl, {
		method: 'POST',
		body: JSON.stringify({ videoId, time }),
		headers: {
			'Content-Type': 'application/json',
		},
	});
}

locationObserver(async (href) => {
	if (!href.includes('watch')) {
		return;
	}

	if (isChanged) {
		return;
	}
	isChanged = true;

	const searchParams = new URLSearchParams(window.location.search);
	vid = searchParams.get('v');

	if (vid === null) {
		return;
	}

	if (vid === _vid) {
		return;
	}

	_vid = vid;

	console.log(`VideoID changed from '${__vid}' to '${vid}'`);
	console.log('Data changed, sending new data to server');

	await postToApi(vid, Date.now());

	__vid = vid;

	isChanged = false;
});
