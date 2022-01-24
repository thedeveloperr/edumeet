export const setVodConfig = (config) =>
	({
		type    : 'SET_VOD_CONFIG',
		payload : { config }
	});

export const addVodFile = (name, type, size, url, hash) =>
	({
		type    : 'ADD_VOD_FILE',
		payload : { name, type, size, url, hash }
	});

export const addVodFileProgress = (hash, percent) =>
	({
		type    : 'ADD_VOD_FILE_PROGRESS',
		payload : { hash, percent }
	});

export const loadVod = (loadedVideo) =>
	({
		type    : 'LOAD_VOD',
		payload : { loadedVideo }
	});

export const unloadVod = () =>
	({
		type : 'UNLOAD_VOD'
	});

export const removeVodFile = (hash) =>
	({
		type    : 'REMOVE_VOD_FILE',
		payload : { hash }
	});
