declare module "arr-union" {

	function union<T>(...arrays: T[]): T;

	namespace union { }

	export = union;
}
