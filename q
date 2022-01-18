[1;33mdiff --git a/server/lib/Room.js b/server/lib/Room.js[m
[1;33mindex c2416e2a..956ba989 100644[m
[1;33m--- a/server/lib/Room.js[m
[1;33m+++ b/server/lib/Room.js[m
[1;35m@@ -862,6 +862,8 @@[m [mclass Room extends EventEmitter[m
 			this._vod = null;[m
 		}[m
 [m
[32m+[m		[32mthis._upload.removePeerAllFiles(this._roomId, peer.id);[m
[32m+[m
 		// Remove from lastN[m
 		this._lastN = this._lastN.filter((id) => id !== peer.id);[m
 [m
[1;33mdiff --git a/server/lib/Upload.js b/server/lib/Upload.js[m
[1;33mindex 8f5ee689..16a45cae 100644[m
[1;33m--- a/server/lib/Upload.js[m
[1;33m+++ b/server/lib/Upload.js[m
[1;35m@@ -76,11 +76,13 @@[m [mexport default class Upload[m
 	}[m
 	isFileNotExisting(name, roomId, peerId, hash)[m
 	{[m
[31m-		// return (!fs.existsSync(this.url)) ? true : false;[m
[31m-[m
[32m+[m		[32mconst pathFullName = `${this.path}/r-${roomId}_p-${peerId}_h-${hash}_${name}`;[m
 		const fullName = `r-${roomId}_p-${peerId}_h-${hash}_${name}`;[m
 [m
[31m-		return (this.filesMeta.find((el) => el.name === fullName) === undefined) ? true : false;[m
[32m+[m		[32mconst isNotInfilesMeta = (this.filesMeta.find((el) => el.name === fullName) === undefined) ? true : false;[m
[32m+[m		[32mconst isNotInFs = (!fs.existsSync(pathFullName)) ? true : false;[m
[32m+[m
[32m+[m		[32mreturn (isNotInfilesMeta && isNotInFs) ? true : false;[m
 	}[m
 	isFileSizeAllowed(size)[m
 	{[m
[1;35m@@ -117,8 +119,28 @@[m [mexport default class Upload[m
 [m
 		return;[m
 	}[m
[31m-	removePeerAllFiles()[m
[32m+[m	[32mremovePeerAllFiles(roomId, peerId)[m
 	{[m
[31m-		return;[m
[32m+[m		[32mthis.refresh();[m
[32m+[m
[32m+[m		[32mconst pattern = `r-${roomId}_p-${peerId}`;[m
[32m+[m
[32m+[m		[32m// console.log({ 'this.filesMeta:': this.filesMeta }); // eslint-disable-line no-console[m
[32m+[m		[32m// console.log({ 'pattern:': pattern }); // eslint-disable-line no-console[m
[32m+[m
[32m+[m		[32mthis.filesMeta.map((v) =>[m
[32m+[m		[32m{[m
[32m+[m			[32mif (v.name.startsWith(pattern))[m
[32m+[m			[32m{[m
[32m+[m				[32mconsole.log('this.path/v.name', `${this.path}/${v.name}`); // eslint-disable-line no-console[m
[32m+[m
[32m+[m				[32mif (fs.existsSync(`${this.path}/${v.name}`))[m
[32m+[m					[32mfs.unlinkSync(`${this.path}/${v.name}`);[m
[32m+[m			[32m}[m
[32m+[m		[32m});[m
[32m+[m
[32m+[m		[32m// console.log({ title: 'filesToRemove:', filesToRemove }); // eslint-disable-line no-console[m
[32m+[m
[32m+[m		[32mreturn true;[m
 	}[m
 }[m
