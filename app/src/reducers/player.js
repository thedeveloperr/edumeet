const initialState =
{
	enabled   : false,
	vodObject : {
		name               : null,
		type               : null,
		size               : null,
		url                : null,
		time               : 0,
		isLoaded           : false,
		isPlaying          : false,
		startPlayTimestamp : 0,
		peerId             : null
	},
	vodMeObjects        : [],
	toggleVodInProgress : null,
	uploadConditions    : {}
};

const player = (state = initialState, action) =>
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
			const { vodObject } = action.payload;

			return { ...state, vodObject: { ...vodObject } };
		}

		case 'UNLOAD_VOD':
		{
			return { ...state, vodObject: initialState.vodObject };
		}

		case 'SET_TOGGLE_VOD_IN_PROGRESS':
		{
			return { ...state, toggleVodInProgress: action.payload.flag };
		}

		case 'ADD_VOD_ITEM':
		{
			const { name, type, size, url } = action.payload;

			const vodMeObjects = [ ...state.vodMeObjects ];

			vodMeObjects.push({ ...initialState.vodObject, name, type, size, url });

			return { ...state, vodMeObjects: vodMeObjects };
		}

		case 'REMOVE_VOD_ITEM':
		{
			const { url } = action.payload;

			const vodMeObjects = [ ...state.vodMeObjects ];

			const tmp = vodMeObjects.filter(function(el)
			{
				return el.url !== url;
			});

			return { ...state, vodMeObjects: tmp };
		}

		case 'SET_VOD_UPLOAD_POSSIBLE_STATUS':
		{
			return { ...state, uploadConditions: action.payload };
		}

		case 'CLEAR_VOD_UPLOAD_POSSIBLE_STATUS':
		{
			return { ...state, uploadConditions: action.payload };
		}

		default:
			return state;
	}
};

export default player;
