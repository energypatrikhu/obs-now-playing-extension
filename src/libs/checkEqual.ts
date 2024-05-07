interface Metadata {
	title: string;
	artist: string;
	album: string;
	artwork: string;
	duration: number;
}

export default function checkEqual(metadata1: Metadata, metadata2: Metadata) {
	return (
		metadata1.title === metadata2.title &&
		metadata1.artist === metadata2.artist &&
		metadata1.album === metadata2.album &&
		metadata1.artwork === metadata2.artwork
	);
}
