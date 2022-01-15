export const isVodEnabled = (flag) =>
	({
		type    : 'IS_VOD_ENABLED',
		payload : { flag }
	});

export const loadVod = (vodObject) =>
	({
		type    : 'LOAD_VOD',
		payload : { vodObject }
	});

export const setToggleVodInProgress = (flag) =>
	({
		type    : 'SET_TOGGLE_VOD_IN_PROGRESS',
		payload : { flag }
	});

export const unloadVod = () =>
	({
		type : 'UNLOAD_VOD'
	});

export const addVodItem = (name, type, size, url) =>
	({
		type    : 'ADD_VOD_ITEM',
		payload : { name, type, size, url }
	});

export const removeVodItem = (url) =>
	({
		type    : 'REMOVE_VOD_ITEM',
		payload : { url }
	});

export const setVodUploadConditions = (
	isMemEnough, isFileNotExisting, isFileSizeAllowed, isFileTypeAllowed) =>
{
	return ({
		type    : 'SET_VOD_UPLOAD_POSSIBLE_STATUS',
		payload : { isMemEnough, isFileNotExisting, isFileSizeAllowed, isFileTypeAllowed }
	});
};

export const clearVodUploadConditions = () =>
{
	return ({
		type    : 'CLEAR_VOD_UPLOAD_POSSIBLE_STATUS',
		payload : {}
	});
};
