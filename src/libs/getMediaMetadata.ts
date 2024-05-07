import checkEqual from './checkEqual';

interface Metadata {
	title: string;
	artist: string;
	album: string;
	artwork: string;
	duration: number;
}

let previousMetadata: Metadata | null = null;

function getMediaDuration() {
	return new Promise<number>((resolve) => {
		const _getMediaDuration_interval = setInterval(() => {
			const videoElements = Array.from(
				document.querySelectorAll('video'),
			);
			const audioElements = Array.from(
				document.querySelectorAll('audio'),
			);

			const mediaElements = [...videoElements, ...audioElements];

			for (const media of mediaElements) {
				if (
					!media.paused &&
					media.duration &&
					!Number.isNaN(media.duration)
				) {
					clearInterval(_getMediaDuration_interval);
					resolve(media.duration);
					return;
				}
			}
		}, 0);
	});
}

export default async function getMediaMetadataSync() {
	if (!navigator.mediaSession) {
		return null;
	}

	return new Promise<Metadata>((resolve) => {
		const _interval = setInterval(async () => {
			const metadata = navigator.mediaSession.metadata;

			if (metadata) {
				const newMetadata: Metadata = {
					title: metadata.title,
					artist: metadata.artist,
					album: metadata.album,
					artwork: metadata.artwork
						? Array.from(metadata.artwork).pop()?.src!
						: '',
					duration: await getMediaDuration(),
				};

				if (
					!previousMetadata ||
					!checkEqual(previousMetadata, newMetadata)
				) {
					previousMetadata = newMetadata;
					clearInterval(_interval);
					resolve(newMetadata);
				}
			}
		}, 0);
	});
}
