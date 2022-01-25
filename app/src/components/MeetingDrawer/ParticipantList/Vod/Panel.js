import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { withRoomContext } from '../../../../RoomContext';
import { useIntl, FormattedMessage } from 'react-intl';
import { styled } from '@material-ui/styles';

import Grid from '@material-ui/core/Grid';
import List from './List';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import BackupIcon from '@material-ui/icons/Backup';
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

const Panel = (props) =>
{
	const intl = useIntl();

	const {
		roomClient,
		classes,
		loadedVideo,
		limitPerPeer,
		list,
		me
	} = props;

	const addedNumber = list.length;

	const handleAddFile = ({ target }) =>
	{
		const file = target.files[0];

		const name = file.name;
		const type = file.type;
		const size = file.size;

		roomClient.addVodFile(name, type, size, file);

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
					{/* Button add file */}
					<label htmlFor='icon-button-file'>
						<Input
							id='icon-button-file'
							type='file'
							onChange={handleAddFile}
							disabled={addedNumber >= limitPerPeer}
						/>
						<Button
							aria-label={intl.formatMessage({
								id             : 'vod.addFile',
								defaultMessage : 'Add file'
							})}
							color='secondary'
							disabled={addedNumber >= limitPerPeer}
							component='span'
							startIcon={<BackupIcon/>}
							variant='contained'
						>
							<FormattedMessage
								id='vod.addFile'
								defaultMessage='Add file'
							/> {limitPerPeer > 1 && `${addedNumber}/${limitPerPeer}`}
						</Button>
					</label>
					{/* /Button add file */}
				</Grid>

				<Grid item>
					{/* Button close */}
					<Button
						aria-label={intl.formatMessage({
							id             : 'label.close',
							defaultMessage : 'Close'
						})}
						color='secondary'
						component='span'
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
						<FormattedMessage
							id='label.close'
							defaultMessage='Close'
						/>
					</Button>
					{/* /Button close */}
				</Grid>
			</Grid>
			<Divider/>
			<List/>
		</div>
	);
};

Panel.propTypes =
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
)(withStyles(styles)(Panel)));