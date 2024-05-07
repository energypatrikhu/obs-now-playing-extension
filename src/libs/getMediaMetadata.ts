interface Metadata {
	info: {
		title: string;
		artist: string;
		artwork: string;
	};
	duration: number;
}

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
					info: {
						title: metadata.title,
						artist: metadata.artist,
						artwork: metadata.artwork
							? Array.from(metadata.artwork).pop()?.src!
							: '',
					},
					duration: await getMediaDuration(),
				};

				clearInterval(_interval);
				resolve(newMetadata);
			}
		}, 0);
	});
}
