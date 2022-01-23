export const setVodConfig = (config) =>
	({
		type    : 'SET_VOD_CONFIG',
		payload : { config }
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

export const setVodUploadFileRules = (
	isDirFree,
	isFileSizeOk,
	isFileTypeOk,
	isFileNotOverLimit
) =>
{
	return ({
		type    : 'SET_VOD_UPLOAD_FILE_RULES',
		payload : {
			isDirFree,
			isFileSizeOk,
			isFileTypeOk,
			isFileNotOverLimit
		}
	});
};

export const clearVodUploadFileRules = () =>
{
	return ({
		type    : 'CLEAR_VOD_UPLOAD_FILE_RULES',
		payload : {}
	});
};

export const setToggleVodInProgress = (flag) =>
	({
		type    : 'SET_TOGGLE_VOD_IN_PROGRESS',
		payload : { flag }
	});

export const setVodUploadProgressValue = (percent) =>
	({
		type    : 'SET_VOD_UPLOAD_PROGRESS_VALUE',
		payload : { percent }
	});
