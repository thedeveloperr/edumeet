import fs from 'fs';
import Logger from './logger/Logger';

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
			const dest = `${this.path}/${file}`;

			if (!fs.statSync(dest).isDirectory())
			{
				list.push({
					name : file,
					size : fs.statSync(dest).size
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

		const peerFilesNumber = this.filesMeta.filter(
			(v) => v.name.startsWith(`r-${roomId}_p-${peerId}`)
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
		const pathFullName = `${this.path}/r-${roomId}_p-${peerId}_h-${hash}_${name}`;
		const fullName = `r-${roomId}_p-${peerId}_h-${hash}_${name}`;

		const isNotInfilesMeta = (
			this.filesMeta.find((el) => el.name === fullName
			) === undefined) ? true : false;

		const isNotInFs = (!fs.existsSync(pathFullName)) ? true : false;

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
		const fullName = `${this.path}/r-${roomId}_p-${peerId}_h-${hash}_${name}`;

		fs.writeFile(fullName, data, function(err)
		{
			if (err)
			{
				return logger.error('writeFile [err:"%o"]', err);
			}
		});

		return fullName;
	}
	removePeerFile(name, roomId, peerId, hash)
	{
		const pathFullName = `${this.path}/r-${roomId}_p-${peerId}_h-${hash}_${name}`;

		if (fs.existsSync(pathFullName))
			fs.unlinkSync(pathFullName);

		return;
	}
	removePeerAllFiles(roomId, peerId)
	{
		this.refresh();

		this.filesMeta.map((v) =>
		{
			if (v.name.startsWith(`r-${roomId}_p-${peerId}`))
			{
				if (fs.existsSync(`${this.path}/${v.name}`))
					fs.unlinkSync(`${this.path}/${v.name}`);
			}
		});

		return true;
	}
}
