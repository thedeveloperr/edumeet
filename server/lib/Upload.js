import fs from 'fs';
import Logger from './logger/Logger';
import path from 'path';

const logger = new Logger('Room');

export default class Upload
{
	constructor(
		path, memSize, autoClearing,
		filesTypesAllowed, fileMaxSizeAllowed, filesMaxNumberPerUser)
	{
		this.path = path;
		this.memSize = memSize * 1073741824; // GB -> bytes
		this.memFree = null;
		this.autoClearing = autoClearing;
		this.filesTypesAllowed = filesTypesAllowed;
		this.fileMaxSizeAllowed = fileMaxSizeAllowed * 1073741824; // GB -> bytes
		this.filesMaxNumberPerUser = filesMaxNumberPerUser;

		this.filesMeta = [];

		this.refresh();

	}
	refresh()
	{
		this._getFilesMeta();
		this._getMemFree();
	}

	_getFilesMeta()
	{
		const list = [];

		fs.readdirSync(this.path).forEach((file) =>
		{
			const fullPath = path.join(this.path, file);

			if (!fs.statSync(fullPath).isDirectory())
			{
				list.push({
					name : file,
					size : fs.statSync(fullPath).size
				});
			}
		});

		this.filesMeta = list;
	}
	_getMemFree()
	{
		const totalUsedSpace = this.filesMeta.reduce((a, b) =>
			({ size: a.size + b.size }), { size: 0 }).size;

		this.memFree = this.memSize - totalUsedSpace;
	}
	_countPeerFiles(roomId, peerId)
	{
		this.refresh();

		const prefix =`room_${roomId}_peer_${peerId}`;

		const peerFilesNumber = this.filesMeta.filter(
			(v) => v.name.startsWith(prefix)
		).length;

		return peerFilesNumber;
	}
	_countRoomFiles()
	{
		return this.filesMeta.length;
	}
	_countAllFiles()
	{
		return this.filesMeta.length;
	}
	isMemEnough(size)
	{
		return (size <= (this.memFree)) ? true : false;
	}
	isFilesMaxNumberPerPeerNotExceeded(roomId, peerId)
	{
		this.refresh();

		const peerFilesNumber = this._countPeerFiles(roomId, peerId);

		return (peerFilesNumber < this.filesMaxNumberPerUser) ? true : false;
	}
	isFileNotExisting(name, roomId, peerId, hash)
	{
		name = `room_${roomId}_peer_${peerId}_hash_${hash}_${name}`
			.replace(/[^A-Za-z0-9._-]+/g, '');

		const fullPath = path.join(this.path, name);

		const isNotInfilesMeta = (
			this.filesMeta.find((el) => el.name === name
			) === undefined) ? true : false;

		const isNotInFs = (!fs.existsSync(fullPath)) ? true : false;

		return (isNotInfilesMeta && isNotInFs) ? true : false;
	}
	isFileSizeAllowed(size)
	{
		return (size <= this.fileMaxSizeAllowed) ? true : false;
	}
	isFileTypeAllowed(type)
	{
		return (this.filesTypesAllowed.includes(type)) ? true : false;
	}
	savePeerFile(name, data, roomId, peerId, hash)
	{
		name = `room_${roomId}_peer_${peerId}_hash_${hash}_${name}`
			.replace(/[^A-Za-z0-9._-]+/g, '');

		const fullPath = path.join(this.path, name);

		console.log({ fullPath }); // eslint-disable-line no-console

		fs.writeFile(fullPath, data, function(err)
		{
			if (err)
			{
				return logger.error('writeFile [err:"%o"]', err);
			}
		});

		return fullPath;
	}
	removePeerFile(name, roomId, peerId, hash)
	{
		name = `room_${roomId}_peer_${peerId}_hash_${hash}_${name}`
			.replace(/[^A-Za-z0-9._-]+/g, '');

		const fullPath = path.join(this.path, name);

		if (fs.existsSync(fullPath))
			fs.unlinkSync(fullPath);

		return;
	}
	removePeerAllFiles(roomId, peerId)
	{
		this.refresh();

		this.filesMeta.map((v) =>
		{
			if (v.name.startsWith(`room_${roomId}_peer_${peerId}`))
			{
				const fullPath = path.join(this.path, v.name);

				if (fs.existsSync(fullPath))
					fs.unlinkSync(fullPath);
			}
		});

		return true;
	}
}
