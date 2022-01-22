import React, { useRef } from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { withRoomContext } from '../../../../RoomContext';
import { useIntl, FormattedMessage } from 'react-intl';
import Grid from '@material-ui/core/Grid';
import BackupIcon from '@material-ui/icons/Backup';
import { styled } from '@material-ui/styles';
import List from './List';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';

const styles = (theme) =>
	({
		root :
		{
			padding     : theme.spacing(1),
			display     : 'flex',
			flexWrap    : 'wrap',
			marginRight : -theme.spacing(1),
			marginTop   : -theme.spacing(1)
		},
		container :
		{
			marginTop      : theme.spacing(1),
			marginRight    : theme.spacing(1),
			flexGrow       : '1',
			justifyContent : 'space-between'
		}

	});

const Input = styled('input')({
	display : 'none'
});

const Player = (props) =>
{
	const intl = useIntl();

	const {
		roomClient,
		classes,
		loadedVideo,
		list,
		me,
		limitPerPeer
	} = props;

	const uploadedNumber = list.length;

	const handleUploadVod = ({ target }) =>
	{
		const file = target.files[0];

		const name = file.name;
		const type = file.type;
		const size = file.size;
		// const type = target.accept.includes('image') ? 'images' : 'videos';

		const fileReader = new FileReader();

		fileReader.readAsArrayBuffer(file);
		fileReader.onload = (e) =>
		{
			const data= e.target.result;

			roomClient.uploadVodFile(name, type, size, data);
		};

		target.value = '';

	};

	return (
		<div className={classes.root}>
			<Divider/>
			<Grid
				className={classes.container}
				container
				wrap='nowrap'
				alignItems='center'
				justifyContent='space-between'
			>
				<Grid item>
					{/* Button upload */}
					<label htmlFor='icon-button-file'>
						<Input
							// accept='image/*' i
							id='icon-button-file'
							type='file'
							onChange={handleUploadVod}
							disabled={uploadedNumber >= limitPerPeer}
						/>
						<Button
							aria-label='upload video'
							color='secondary'
							disabled={uploadedNumber >= limitPerPeer}
							component='span'
							startIcon={<BackupIcon />}
							variant='contained'
							// className={classes.button}
						>
							Upload {limitPerPeer > 1 && `${uploadedNumber}/${limitPerPeer}`}
						</Button>
					</label>
					{/* /Button upload */}
				</Grid>

				<Grid item>
					{/* Button unloadVod */}
					<Button
						aria-label='upload video'
						color='secondary'
						component='span'
						// className={classes.button}
						// className={classes.button}
						disabled={
							!loadedVideo ||
							(
								loadedVideo.peerId !== 'undefined' &&
								loadedVideo.peerId !== me.id
							)
						}
						onClick={() =>
						{
							roomClient.unloadVod();
						}}
						startIcon={<CloseIcon />}
						variant='contained'

					>
						Close
					</Button>
					{/* /Button unloadVod */}
				</Grid>
			</Grid>
			<Divider/>
			<List/>
		</div>
	);
};

Player.propTypes =
{
	roomClient   : PropTypes.any.isRequired,
	classes      : PropTypes.object.isRequired,
	left         : PropTypes.string.isRequired,
	loadedVideo  : PropTypes.object.isRequired,
	list         : PropTypes.object.isRequired,
	me           : PropTypes.object.isRequired,
	limitPerPeer : PropTypes.number.isRequired
};

const mapStateToProps = (state) => ({
	left         : state.vod.left,
	loadedVideo  : state.vod.loadedVideo,
	list         : state.vod.list,
	limitPerPeer : state.vod.limitPerPeer,
	me           : state.me
});

export default withRoomContext(connect(
	mapStateToProps,
	null,
	null,
	{
		areStatesEqual : (next, prev) =>
		{
			return (
				prev.vod.left === next.vod.left &&
				prev.vod.loadedVideo === next.vod.loadedVideo &&
				prev.vod.list === next.vod.list &&
				prev.vod.limitPerPeer === next.vod.limitPerPeer &&
				prev.me === next.me
			);
		}
	}
)(withStyles(styles)(Player)));