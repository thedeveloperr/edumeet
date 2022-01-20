import fs from 'fs';
import Logger from './logger/Logger';
import path from 'path';
const { config } = require('./config/config');

const logger = new Logger('Room');

export default class Upload
{
	constructor()
	{
		this.dir = {
			path : config.upload.dir.path,
			size : config.upload.dir.size * 1073741824, // GB -> bytes
			free : null
		};

		this.files = {
			list   : [],
			number : null,
			rules  : {
				types   : config.upload.files.rules.types,
				maxSize : config.upload.files.rules.maxSize * 1073741824 // GB -> bytes
			}
		};

		this.filesMaxNumberPerUser = config.vod.filesMaxNumberPerUser;

		this.refresh();

	}
	refresh()
	{
		this._getFilesList();
		this._getDirFree();
	}

	_getFilesList()
	{
		const list = [];

		fs.readdirSync(this.dir.path).forEach((file) =>
		{
			const fullPath = path.join(this.dir.path, file);

			if (!fs.statSync(fullPath).isDirectory())
			{
				list.push({
					name : file,
					size : fs.statSync(fullPath).size
				});
			}
		});

		this.files.list = list;
	}
	_getDirFree()
	{
		const totalUsedSpace = this.files.list.reduce((a, b) =>
			({ size: a.size + b.size }), { size: 0 }).size;

		this.dir.free = this.dir.size - totalUsedSpace;
	}
	countFiles()
	{
		return this.files.list.length;
	}
	isDirEnoughSize(size)
	{
		return (size <= (this.dir.free)) ? true : false;
	}
	isFileNotExisting(name, roomId, peerId, hash)
	{
		name = `room_${roomId}_peer_${peerId}_hash_${hash}_${name}`
			.replace(/[^A-Za-z0-9._-]+/g, '');

		const fullPath = path.join(this.dir.path, name);

		const isNotInfiles = (
			this.files.list.find((el) => el.name === name
			) === undefined) ? true : false;

		const isNotInFs = (!fs.existsSync(fullPath)) ? true : false;

		return (isNotInfiles && isNotInFs) ? true : false;
	}
	isFileSizeAllowed(size)
	{
		return (size <= this.files.rules.maxSize) ? true : false;
	}
	isFileTypeAllowed(type)
	{
		return (this.files.rules.types.includes(type)) ? true : false;
	}
	saveFile(name, data)
	{
		const fullPath = path.join(this.dir.path, name);

		fs.writeFile(fullPath, data, function(err)
		{
			if (err)
			{
				return logger.error('writeFile [err:"%o"]', err);
			}
		});

		return fullPath;
	}
	removeFile(name)
	{
		const fullPath = path.join(this.dir.path, name);

		if (fs.existsSync(fullPath))
			fs.unlinkSync(fullPath);

		return;
	}

	// vod
	_countRoomFiles()
	{
		return this.files.list.length;
	}
	_countPeerFiles(roomId, peerId)
	{
		this.refresh();

		const prefix =`room_${roomId}_peer_${peerId}`;

		const peerFilesNumber = this.files.list.filter(
			(v) => v.name.startsWith(prefix)
		).length;

		return peerFilesNumber;
	}
	isFilesMaxNumberPerPeerNotExceeded(roomId, peerId)
	{
		this.refresh();

		const peerFilesNumber = this._countPeerFiles(roomId, peerId);

		return (peerFilesNumber < this.filesMaxNumberPerUser) ? true : false;
	}
	removePeerAllFiles(roomId, peerId)
	{
		this.refresh();

		this.files.list.map((v) =>
		{
			if (v.name.startsWith(`room_${roomId}_peer_${peerId}`))
			{
				const fullPath = path.join(this.dir.path, v.name);

				if (fs.existsSync(fullPath))
					fs.unlinkSync(fullPath);
			}
		});

		return true;
	}
}
