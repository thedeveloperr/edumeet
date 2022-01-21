import { config } from '../config/config';
import fs from 'fs';
import path from 'path';
import Logger from '../logger/Logger';

const logger = new Logger('Room');

export default class Upload
{
	constructor()
	{
		this.dir = {
			path : config.vod.upload.dir.path,
			size : config.vod.upload.dir.size * 1073741824, // GB -> bytes
			free : null
		};

		this.files = {
			list   : [],
			number : null,
			rules  : {
				types   : config.vod.upload.files.rules.types,
				maxSize : config.vod.upload.files.rules.maxSize * 1073741824 // GB -> bytes
			}
		};

		this.limitPerPeer = config.vod.upload.files.rules.limitPerPeer;

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
	isDirFree(size)
	{
		return (size <= (this.dir.free)) ? true : false;
	}
	isFileNameExisting(name)
	{
		return (this.files.list.find((el) => el.name === name) === undefined);
	}
	isFileSizeOk(size)
	{
		return (size <= this.files.rules.maxSize);
	}
	isFileTypeOk(type)
	{
		return (this.files.rules.types.includes(type));
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
	isFileNotOverLimit(roomId, peerId)
	{
		this.refresh();

		const peerFilesNumber = this._countPeerFiles(roomId, peerId);

		return (peerFilesNumber < this.limitPerPeer) ? true : false;
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
