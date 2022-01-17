const initialState =
{
	enabled     : false,
	loadedVideo : {
		name               : null,
		type               : null,
		size               : null,
		url                : null,
		time               : 0,
		isLoaded           : false,
		isPlaying          : false,
		startPlayTimestamp : 0,
		peerId             : null,
		hash               : null
	},
	list                : [],
	toggleVodInProgress : null,
	uploadConditions    : {}
};

const vod = (state = initialState, action) =>
{
	switch (action.type)
	{
		case 'IS_VOD_ENABLED':
		{
			const { flag } = action.payload;

			return { ...state, enabled: flag };
		}

		case 'LOAD_VOD':
		{
			const { loadedVideo } = action.payload;

			return { ...state, loadedVideo: { ...loadedVideo } };
		}

		case 'UNLOAD_VOD':
		{
			return { ...state, loadedVideo: initialState.loadedVideo };
		}

		case 'SET_TOGGLE_VOD_IN_PROGRESS':
		{
			return { ...state, toggleVodInProgress: action.payload.flag };
		}

		case 'ADD_VOD_ITEM':
		{
			const { name, type, size, url, hash } = action.payload;

			const list = [ ...state.list ];

			list.push({ ...initialState.loadedVideo, name, type, size, url, hash });

			return { ...state, list: list };
		}

		case 'REMOVE_VOD_ITEM':
		{
			const { hash } = action.payload;

			const list = [ ...state.list ];

			const tmp = list.filter((el) => el.hash !== hash);

			return { ...state, list: tmp };
		}

		case 'SET_VOD_UPLOAD_CONDITIONS':
		{
			return { ...state, uploadConditions: action.payload };
		}

		case 'CLEAR_VOD_UPLOAD_CONDITIONS':
		{
			return { ...state, uploadConditions: action.payload };
		}

		default:
			return state;
	}
};

export default vod;
