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

export const uploadVodFile = (name, type, size, url, hash) =>
	({
		type    : 'UPLOAD_VOD_FILE',
		payload : { name, type, size, url, hash }
	});

export const removeVodItem = (hash) =>
	({
		type    : 'REMOVE_VOD_ITEM',
		payload : { hash }
	});

export const setVodUploadRestrictions = (
	isMemEnough,
	isFileNotExisting,
	isFileSizeAllowed,
	isFileTypeAllowed,
	isFilesMaxNumberPerPeerNotExceeded
) =>
{
	return ({
		type    : 'SET_VOD_UPLOAD_RESTRICTIONS',
		payload : {
			isMemEnough,
			isFileNotExisting,
			isFileSizeAllowed,
			isFileTypeAllowed,
			isFilesMaxNumberPerPeerNotExceeded
		}
	});
};

export const clearVodUploadRestrictions = () =>
{
	return ({
		type    : 'CLEAR_VOD_UPLOAD_RESTRICTIONS',
		payload : {}
	});
};

export const setToggleVodInProgress = (flag) =>
	({
		type    : 'SET_TOGGLE_VOD_IN_PROGRESS',
		payload : { flag }
	});
