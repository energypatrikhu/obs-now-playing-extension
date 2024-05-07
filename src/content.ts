import getMediaMetadataSync from './libs/getMediaMetadata';
import { logger, sleep } from '@energypatrikhu/node-utils';
import { isEqual } from 'lodash';

interface Metadata {
	info: {
		title: string;
		artist: string;
		artwork: string;
	};
	duration: number;
}

(async () => {
	const apiUrl = 'http://127.0.0.1:2442/api/nowPlaying';

	let _metadata: Metadata | null = null;
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
					`Retrying to send data to server after ${retries +
						1} second`,
				);
				await sleep(1000 * retries + 1);
				return await sendMetadataToApi(metadata, time, retries + 1);
			}

			console.error('Max retries reached');
			return Promise.reject(error);
		}
	}

	(async function autoChecker() {
		try {
			const metadata = await getMediaMetadataSync();

			if (metadata === null) {
				setTimeout(autoChecker, 1000);
				return;
			}

			if (_metadata) {
				// @ts-ignore
				if (isEqual(metadata.info, _metadata.info)) {
					setTimeout(autoChecker, 1000);
					return;
				}
			}

			if (isChanged) {
				setTimeout(autoChecker, 1000);
				return;
			}
			isChanged = true;

			logger('info', 'Metadata changed, sending new data to server');

			logger('info', metadata);

			await sendMetadataToApi(metadata, Date.now());

			_metadata = metadata;

			isChanged = false;
		} catch (error) {
			console.error('Error in auto checker', error);
		}

		setTimeout(autoChecker, 1000);
	})();
})();
