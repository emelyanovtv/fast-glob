declare module "multistream" {

	import { Stream } from 'stream';

	function multistream(streams: Stream[]): Stream;

	namespace multistream {}

	export = multistream;
}
