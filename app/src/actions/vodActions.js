export const isVodEnabled = (flag) =>
	({
		type    : 'IS_VOD_ENABLED',
		payload : { flag }
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

export const addVodItem = (name, type, size, url, hash) =>
	({
		type    : 'ADD_VOD_ITEM',
		payload : { name, type, size, url, hash }
	});

export const removeVodItem = (hash) =>
	({
		type    : 'REMOVE_VOD_ITEM',
		payload : { hash }
	});

export const setVodUploadConditions = (
	isMemEnough, isFileNotExisting, isFileSizeAllowed, isFileTypeAllowed) =>
{
	return ({
		type    : 'SET_VOD_UPLOAD_CONDITIONS',
		payload : { isMemEnough, isFileNotExisting, isFileSizeAllowed, isFileTypeAllowed }
	});
};

export const clearVodUploadConditions = () =>
{
	return ({
		type    : 'CLEAR_VOD_UPLOAD_CONDITIONS',
		payload : {}
	});
};

export const setToggleVodInProgress = (flag) =>
	({
		type    : 'SET_TOGGLE_VOD_IN_PROGRESS',
		payload : { flag }
	});
