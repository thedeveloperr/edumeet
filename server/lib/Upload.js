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
	_countPeerFiles()
	{
		return this.filesMeta.length;
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
	isFilesMaxNumberExceeded()
	{
		return (this.filesMaxNumberPerUser);
	}
	isFileNotExisting(name)
	{
		// return (!fs.existsSync(this.url)) ? true : false;

		return true;
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
		const url = `${this.path}/r-${roomId}_p-${peerId}_t-${hash}_${name}`;

		fs.writeFile(url, data, function(err)
		{
			if (err)
			{
				return logger.error('writeFile [err:"%o"]', err);
			}

			// logger.debug(`writeFile "The ${name} saved in ${url}"`);
		});

		return url;
	}
	removePeerFile(name, roomId, peerId, hash)
	{
		const name2 = `r-${roomId}_p-${peerId}_t-${hash}_${name}`;
		const url = `${this.path}/r-${roomId}_p-${peerId}_t-${hash}_${name}`;
		const found = (this.filesMeta.find((item) => item === name2) !== undefined) ? true : false;

		console.log({ title: 'removePeerFile:', name, roomId, peerId, hash }); // eslint-disable-line no-console
		console.log({ title: 'this.filesMeta:', filesMeta: { ...this.filesMeta } }); // eslint-disable-line no-console
		console.log({ title: 'name2:', name2 }); // eslint-disable-line no-console
		console.log({ title: 'url:', url }); // eslint-disable-line no-console
		console.log({ title: 'found:', found }); // eslint-disable-line no-console

		// const url = `${this.path}/r-${roomId}_p-${peerId}_t-${hash}_${url}`;

		if (fs.existsSync(url))
			fs.unlinkSync(url);

		return;
	}
	removePeerAllFiles()
	{
		return;
	}
}
