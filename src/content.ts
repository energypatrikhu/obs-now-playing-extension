import { locationObserver } from './libs/locationObserver';
import { sleep } from '@energypatrikhu/node-core-utils';

const apiUrl = 'http://127.0.0.1:2442/api/nowPlaying';

let [_vid, __vid, vid]: [string | null, string | null, string | null] = [
	null,
	null,
	null,
];
let isChanged = false;

async function postToApi(videoId: string, time: number, retries = 0) {
	try {
		await fetch(apiUrl, {
			method: 'POST',
			body: JSON.stringify({ videoId, time }),
			headers: {
				'Content-Type': 'application/json',
			},
		});
	} catch (error) {
		console.error('Error while sending data to server', error);

		if (retries < 3) {
			console.log(
				`Retrying to send data to server after ${retries + 1} second`,
			);
			await sleep(1000 * retries + 1);
			await postToApi(videoId, time, retries + 1);
		}
	}
}

locationObserver(async (href) => {
	try {
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
	} catch (error) {
		console.error('Error in locationObserver', error);
	}
});
