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
	list         : [],
	limitPerPeer : null
};

const vod = (state = initialState, action) =>
{
	switch (action.type)
	{
		case 'SET_VOD_CONFIG':
		{
			const { config } = action.payload;

			return { ...state, ...config };
		}

		case 'ADD_VOD_FILE':
		{
			const { name, type, size, url, hash } = action.payload;

			const list = [ ...state.list ];

			list.push({
				...initialState.loadedVideo,
				name,
				type,
				size,
				url,
				hash,
				addingProgress : 0
			});

			return { ...state, list: list };
		}

		case 'ADD_VOD_FILE_PROGRESS':
		{
			const { hash, percent } = action.payload;

			const list = [ ...state.list ];

			list.forEach((item) =>
			{
				if (item.hash === hash)
					item.addingProgress = percent;
			});

			return { ...state, list };
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

		case 'REMOVE_VOD_FILE':
		{
			const { hash } = action.payload;

			const list = [ ...state.list ];

			const tmp = list.filter((el) => el.hash !== hash);

			return { ...state, list: tmp };
		}

		default:
			return state;
	}
};

export default vod;
