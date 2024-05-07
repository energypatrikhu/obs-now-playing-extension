import checkEqual from './libs/checkEqual';
import getMediaMetadataSync from './libs/getMediaMetadata';
import { locationObserver } from './libs/locationObserver';
import { sleep } from '@energypatrikhu/node-utils';

interface Metadata {
	title: string;
	artist: string;
	album: string;
	artwork: string;
	duration: number;
}

const apiUrl = 'http://127.0.0.1:2442/api/nowPlaying';

let [_metadata, __metadata, metadata]: [
	Metadata | null,
	Metadata | null,
	Metadata | null,
] = [null, null, null];
let isChanged = false;

async function sendMetadataToApi(
	metadata: Metadata,
	time: number,
	retries = 0,
): Promise<Response> {
	try {
		return await fetch(apiUrl, {
			method: 'POST',
			body: JSON.stringify({ metadata, time }),
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
			return await sendMetadataToApi(metadata, time, retries + 1);
		}

		console.error('Max retries reached');
		return Promise.reject(error);
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

		metadata = await getMediaMetadataSync();

		if (metadata === null) {
			return;
		}

		if (__metadata && checkEqual(metadata, __metadata)) {
			return;
		}

		_metadata = metadata;

		console.log('Metadata changed from', __metadata, 'to', metadata);
		console.log('Data changed, sending new data to server');

		await sendMetadataToApi(metadata, Date.now());

		__metadata = metadata;

		isChanged = false;
	} catch (error) {
		console.error('Error in locationObserver', error);
	}
});
