import { querySync } from './libs/document';
import { locationObserver } from './libs/locationObserver';
import { sleep, timeToSec } from '@energypatrikhu/node-core-utils';

const apiUrl = 'http://127.0.0.1:2442/api/nowPlaying';

let reAlertTime = 49.2;
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

async function getTime(isYTM: boolean): Promise<string> {
	if (isYTM) {
		const element = await querySync<HTMLSpanElement>(
			'.time-info.style-scope.ytmusic-player-bar',
		);
		if (!element.textContent) {
			await sleep(100);
			return await getTime(isYTM);
		}
		if (!element.textContent.trim()) {
			await sleep(100);
			return await getTime(isYTM);
		}
		if (element.textContent.trim().split(' / ').length === 0) {
			await sleep(100);
			return await getTime(isYTM);
		}

		const textContent = element.textContent.trim().split(' / ')[1]!;
		if (timeToSec(textContent) === 0) {
			await sleep(100);
			return await getTime(isYTM);
		}

		return textContent;
	}

	const element = await querySync<HTMLDivElement>('.ytp-time-duration');
	if (!element.textContent) {
		await sleep(100);
		return await getTime(isYTM);
	}
	if (!element.textContent.trim()) {
		await sleep(100);
		return await getTime(isYTM);
	}

	const textContent = element.textContent.trim();
	if (timeToSec(textContent) === 0) {
		await sleep(100);
		return await getTime(isYTM);
	}

	return textContent;
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

	const isYTM = window.location.hostname == 'music.youtube.com';

	_vid = vid;

	const timeStr = await getTime(isYTM);

	const time = (Date.now() / 1000 + timeToSec(timeStr) + reAlertTime) * 1000;

	console.log(`VideoID changed from '${__vid}' to '${vid}'`);
	console.log(
		'Time:',
		timeStr,
		'| Seconds:',
		timeToSec(timeStr),
		'| reAlert:',
		time,
	);
	console.log('Data changed, sending new data to server');

	await postToApi(vid, time);

	__vid = vid;

	isChanged = false;
});
