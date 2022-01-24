import React from 'react';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { withRoomContext } from '../../../../RoomContext';
import { useIntl } from 'react-intl';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import CircularProgress from '@material-ui/core/CircularProgress';
import LinearProgress from '@material-ui/core/LinearProgress';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

const styles = (theme) => ({
	root : {
		margin    : theme.spacing(0),
		marginTop : theme.spacing(1)
	},

	item :
	{
		margin          : theme.spacing(0),
		marginTop       : theme.spacing(1),
		marginRight     : theme.spacing(1),
		padding         : theme.spacing(1),
		backgroundColor : '#f1f1f1',
		minWidth        : 0
	}
});

const List = (props) =>
{

	const intl = useIntl();

	const {
		roomClient,
		classes,
		loadedVideo,
		list,
		me
	} = props;

	return (
		<Grid container className={classes.root}>
			{
				list.map((v, i) =>
				{
					return (
						<Grid
							container
							item
							key={i}
							className={classes.item}
							justifyContent='space-between'
							alignItems='center'
						>
							<Grid
								xs
								style={{
									textOverflow : 'ellipsis',
									overflow     : 'hidden',
									whiteSpace   : 'nowrap'
								}}
							>
								<Tooltip
									title={v.name}
									enterDelay={1000}
								>
									<Typography 	style={{
										textOverflow : 'ellipsis',
										overflow     : 'hidden',
										whiteSpace   : 'nowrap'
									}}
									>{v.name}</Typography>
								</Tooltip>

								{(v.uploadProgress > 0 && v.uploadProgress < 100) &&
								<LinearProgress
									color='secondary'
									variant='determinate'
									value={v.uploadProgress}
								/>
								}
							</Grid>
							{(
								!loadedVideo.isPlaying ||
								loadedVideo.peerId !== me.id ||
								loadedVideo.url !== v.url
							) ?
								<Grid item>
									{/* Button start countdown */}
									<IconButton
										aria-label={intl.formatMessage({
											id             : 'start.countdown',
											defaultMessage : 'Start'
										})}
										variant='contained'
										color='secondary'
										size='small'
										disabled={
											loadedVideo.peerId !== me.id ||
											(
												loadedVideo.peerId === me.id &&
												loadedVideo.url !== v.url
											)
										}
										onClick={() => roomClient.updateVod('0', 'play')}
									>
										<PlayArrowIcon/>
									</IconButton>
									{/* /Button start countdown */}
								</Grid>
								:
								<Grid item>
									{/* Button stop countdown */}
									<IconButton
										aria-label={intl.formatMessage({
											id             : 'stop.countdown',
											defaultMessage : 'Stop countdown'
										})}
										variant='contained'
										color='secondary'
										size='small'

										disabled={
											loadedVideo.peerId !== me.id ||
											(
												loadedVideo.peerId === me.id &&
												loadedVideo.url !== v.url
											)
										}
										// disabled={!isEnabled || left === '00:00:00'}
										onClick={() => roomClient.updateVod('0', 'pause')}
									>
										<PauseIcon/>
									</IconButton>
									{/* /Button stop countdown */}
								</Grid>
							}

							<Grid item>
								{/* Button load */}
								<IconButton
									aria-label={intl.formatMessage({
										id             : 'start.countdown',
										defaultMessage : 'Start'
									})}
									variant='contained'
									color='secondary'
									disabled={
										loadedVideo.isLoaded &&
										(
											loadedVideo.peerId === me.id &&
											loadedVideo.url === v.url
										)
									}

									size='small'
									// disabled={!isEnabled || left === '00:00:00'}
									onClick={() => roomClient.loadVod(v)}
								>
									<AutorenewIcon/>
								</IconButton>
								{/* /Button load */}
							</Grid>

							<Grid item>
								<IconButton
									aria-label={intl.formatMessage({
										id             : 'start.countdown',
										defaultMessage : 'Start'
									})}
									variant='contained'
									color='secondary'
									size='small'
									disabled={
										loadedVideo.isLoaded &&
										(
											loadedVideo.peerId === me.id &&
											loadedVideo.url === v.url
										)
									}
									onClick={() =>
									{
										roomClient.removeVodFile(v.name, v.hash);
									}}
								>
									<HighlightOffIcon/>
								</IconButton>
							</Grid>
						</Grid>
					);
				})
			}
		</Grid>

	);
};

List.propTypes = {
	classes     : PropTypes.object.isRequired,
	roomClient  : PropTypes.any.isRequired,
	loadedVideo : PropTypes.object.isRequired,
	list        : PropTypes.array.isRequired,
	me          : PropTypes.object.isRequired

};

const mapStateToProps = (state) => ({
	loadedVideo : state.vod.loadedVideo,
	list        : state.vod.list,
	me          : state.me
});

export default withRoomContext(connect(
	mapStateToProps,
	null,
	null,
	{
		areStatesEqual : (next, prev) =>
		{
			return (
				prev.vod === next.vod &&
				prev.vod.loadedVideo === next.vod.loadedVideo &&
				prev.vod.list === next.vod.list &&
				prev.me === next.me
			);
		}
	}
)(withStyles(styles)(List)));
