import { isMacOS } from "../../lib/platform.ts";

export type ErrorArgs = Record<string, string | number>;
type Wording = string | ((args: ErrorArgs) => string);

export type ErrorCode =
  | "internal"
  | "updater.busy"
  | "updater.targetChanged"
  | "platform.unsupported"
  | "credential.open"
  | "credential.read"
  | "credential.save"
  | "credential.delete"
  | "credential.staleApp"
  | "file.read"
  | "file.write"
  | "file.create"
  | "file.backup"
  | "updateBackup.failed"
  | "updateBackup.badSnapshot"
  | "updateBackup.corrupt"
  | "updateBackup.notFound"
  | "file.undo"
  | "http.client"
  | "net.proxy"
  | "net.unreachable"
  | "net.unreadable"
  | "net.status"
  | "net.said"
  | "net.tooLarge"
  | "download.unreachable"
  | "download.timeout"
  | "download.checksum"
  | "download.failed"
  | "inflink.releaseUnreachable"
  | "inflink.releaseTimeout"
  | "inflink.noBetterNcm"
  | "inflink.write"
  | "recording.busy"
  | "recording.idle"
  | "recording.failed"
  | "clipboard.read"
  | "clipboard.open"
  | "clipboard.notLink"
  | "clipboard.noLinks"
  | "clipboard.linkMissing"
  | "shortcut.invalid"
  | "shortcut.notReady"
  | "shortcut.busy"
  | "coexist.devOnly"
  | "coexist.save"
  | "shortcut.update"
  | "shortcut.timeout"
  | "shortcut.taken"
  | "quick-commands.empty"
  | "quick-commands.failed"
  | "net-speed.read"
  | "volume.read"
  | "volume.set"
  | "dock.read"
  | "dock.activate"
  | "dock.tray"
  | "home.envSet"
  | "home.notAbsolute"
  | "home.inUse"
  | "home.copy"
  | "pluginsV3.builtinUnknown"
  | "pluginsV3.builtinEssential"
  | "pluginsV3.builtinSave"
  | "pluginsV3.builtinConfigKey"
  | "pluginsV3.builtinConfigValue"
  | "pluginsV3.builtinConfigSave"
  | "mail.address"
  | "mail.attachmentDecode"
  | "mail.attachmentDownload"
  | "mail.attachmentGone"
  | "mail.attachmentLarge"
  | "mail.attachmentParse"
  | "mail.badId"
  | "mail.badPart"
  | "mail.bodyDecode"
  | "mail.bodyFormat"
  | "mail.bodyLarge"
  | "mail.bodyLoad"
  | "mail.bodyLong"
  | "mail.bodyOver"
  | "mail.bodyParse"
  | "mail.bodyPartial"
  | "mail.build"
  | "mail.cancelled"
  | "mail.changedOpen"
  | "mail.changedRefresh"
  | "mail.codeMissing"
  | "mail.connect"
  | "mail.connectAndEnable"
  | "mail.connectThis"
  | "mail.connectUnfinished"
  | "mail.crashedRetrying"
  | "mail.crashedStopped"
  | "mail.disconnect"
  | "mail.disconnectCredential"
  | "mail.disconnectPartly"
  | "mail.headers"
  | "mail.imapRefused"
  | "mail.imapServer"
  | "mail.inbox"
  | "mail.inboxChanged"
  | "mail.inboxChangedOpen"
  | "mail.markRead"
  | "mail.markReadLater"
  | "mail.needCode"
  | "mail.needRecipient"
  | "mail.noAttachment"
  | "mail.noDownloads"
  | "mail.noSender"
  | "mail.noText"
  | "mail.off"
  | "mail.notRecent"
  | "mail.read"
  | "mail.readCode"
  | "mail.readLater"
  | "mail.recipient"
  | "mail.removed"
  | "mail.saveAttachment"
  | "mail.saveCode"
  | "mail.sendFailed"
  | "mail.sendUnfinished"
  | "mail.serviceDown"
  | "mail.smtpRefused"
  | "mail.start"
  | "mail.stopped"
  | "mail.structure"
  | "mail.subject"
  | "mail.sync"
  | "mail.tls"
  | "mail.tooMany"
  | "mail.tooManyNames"
  | "mail.tooManyRecipients"
  | "mail.unavailable"
  | "mail.update"

export type ErrorsText = {
  withDetail: (text: string, detail: string) => string;
  codes: Record<ErrorCode, Wording>;
};

export const zhCN: ErrorsText = {
  withDetail: (text, detail) => `${text.replace(/[。.]$/, "")}：${detail}`,
  codes: {
    internal: "岛屿内部出错。",
    "updater.busy": "正在检查、下载或安装更新，请稍后再试。",
    "updater.targetChanged": "可用的更新版本已变化，请确认新版本后再安装。",
    "platform.unsupported": "这个平台暂不支持该功能。",
    "credential.open": isMacOS ? "无法访问钥匙串。" : "无法访问 Windows 凭据管理器。",
    "credential.read": isMacOS ? "无法从钥匙串读取。" : "无法从 Windows 凭据管理器读取。",
    "credential.save": isMacOS ? "无法保存到钥匙串。" : "无法保存到 Windows 凭据管理器。",
    "credential.delete": isMacOS ? "无法从钥匙串删除。" : "无法从 Windows 凭据管理器删除。",
    "credential.staleApp": "浮屿已经更新，请退出后重新打开。",
    "file.read": ({ path }) => `读不了 ${path}。`,
    "file.write": ({ path }) => `无法写入 ${path}。`,
    "file.create": ({ path }) => `无法创建 ${path}。`,
    "file.backup": ({ path }) => `无法备份 ${path}。`,
    "updateBackup.failed": "安装前没能备份数据，这次没有安装。",
    "updateBackup.badSnapshot": "页面交来的设置数据不完整，没能备份，这次没有安装。",
    "updateBackup.corrupt": ({ path }) => `这份备份已损坏（${path} 对不上），不能恢复。`,
    "updateBackup.notFound": "这份备份已经不在了。",
    "file.undo": ({ path }) => `无法撤回 ${path}。`,
    "http.client": "无法建立网络连接。",
    "net.proxy": "代理地址无效，检查 HTTPS_PROXY 环境变量或系统代理设置。",
    "net.unreachable": ({ service }) => `连不上 ${service}。`,
    "net.unreadable": ({ service }) => `${service} 的回答读不懂。`,
    "net.status": ({ service, status }) => `${service} 返回 ${status}。`,
    "net.said": ({ service }) => `${service} 返回了错误。`,
    "net.tooLarge": ({ service }) => `${service} 的内容太大，已放弃。`,
    "download.unreachable": ({ what, tried }) => `连不上 ${what} 的下载地址（试过 ${tried}）。`,
    "download.timeout": ({ what, tried }) => `下载 ${what} 超时（试过 ${tried}）。`,
    "download.checksum": ({ what, tried }) => `下载的 ${what} 没通过校验，没有使用（试过 ${tried}）。`,
    "download.failed": ({ what, tried }) => `下载 ${what} 失败（试过 ${tried}）。`,
    "inflink.releaseUnreachable": "连不上 GitHub（api.github.com），查不到 InfLink-rs 的最新版本。",
    "inflink.releaseTimeout": "向 GitHub（api.github.com）查询 InfLink-rs 的最新版本超时。",
    "inflink.noBetterNcm": "没找到 BetterNCM。先装 BetterNCM 并打开一次网易云，再试。",
    "inflink.write": "没能把 InfLink-rs 放进 BetterNCM 的插件文件夹。",
    "recording.busy": "已经在录屏了。",
    "recording.idle": "现在没有在录屏。",
    "recording.failed": "录屏失败。",
    "clipboard.read": "无法读取剪贴板。",
    "clipboard.open": "无法打开剪贴板。",
    "clipboard.notLink": "这不是网址。",
    "clipboard.noLinks": "这个文件里没有找到网址。",
    "clipboard.linkMissing": "找不到这个书签。",
    "shortcut.invalid": "快捷键无效，请使用至少一个修饰键。",
    "shortcut.notReady": "快捷键服务尚未准备好。",
    "shortcut.busy": "快捷键正在更新。",
    "coexist.devOnly": "只有开发版有这个切换。",
    "coexist.save": "没能保存这个选择。",
    "shortcut.update": "无法更新快捷键。",
    "shortcut.timeout": "快捷键更新超时。",
    "shortcut.taken": ({ shortcut }) => `快捷键 ${shortcut} 已被占用或无法注册。`,
    "quick-commands.empty": "命令是空的。",
    "quick-commands.failed": "命令没能跑起来。",
    "net-speed.read": "读取网速失败。",
    "volume.read": "读取音量失败。",
    "volume.set": "调节音量失败。",
    "dock.read": "读取运行中的应用失败。",
    "dock.activate": "切换应用失败。",
    "dock.tray": "点击托盘图标失败。",
    "home.envSet": ({ home }) => `家目录由环境变量 FUYU_HOME 指定（${home}），在这里改不了；要改请先去掉这个环境变量。`,
    "home.notAbsolute": "请填一个完整的文件夹路径，例如 D:\\Fuyu。",
    "home.inUse": ({ computer }) => `这个文件夹正在被电脑「${computer}」上的浮屿使用，先在那台电脑上退出浮屿。`,
    "home.copy": ({ path }) => `没能把数据复制到 ${path}。`,
    "pluginsV3.builtinUnknown": ({ id }) => `没有叫 ${id} 的内置插件。`,
    "pluginsV3.builtinEssential": ({ id }) => `${id} 是浮屿必需的，不能关掉。`,
    "pluginsV3.builtinSave": ({ id }) => `没能保存 ${id} 的开关。`,
    "pluginsV3.builtinConfigKey": ({ id, key }) => `${key} 不能用作 ${id} 的设置名。`,
    "pluginsV3.builtinConfigValue": ({ id, key }) => `${id} 的设置 ${key} 只能是开关、数字或文字。`,
    "pluginsV3.builtinConfigSave": ({ id }) => `没能保存 ${id} 的设置。`,
    "mail.address": "请输入有效的邮箱地址。",
    "mail.attachmentDecode": "无法解码附件，请在网页中下载。",
    "mail.attachmentDownload": "无法下载附件，请检查网络并重试。",
    "mail.attachmentGone": "附件已移除，请刷新收件箱。",
    "mail.attachmentLarge": ({ mb }) => `附件超过 ${mb} MB，请在网页中下载。`,
    "mail.attachmentParse": "无法解析附件，请在网页中下载。",
    "mail.badId": "邮件标识无效，请刷新收件箱。",
    "mail.badPart": "附件标识无效，请重新打开邮件。",
    "mail.bodyDecode": "无法解码邮件正文，请在网页中查看。",
    "mail.bodyFormat": "邮件正文格式不匹配，请在网页中查看。",
    "mail.bodyLarge": "邮件正文过大，请在网页中查看。",
    "mail.bodyLoad": "无法加载邮件正文，请检查网络并重试。",
    "mail.bodyLong": "正文太长，请在网页中发送。",
    "mail.bodyOver": "邮件正文超过 512 KB，请在网页中查看。",
    "mail.bodyParse": "无法解析邮件正文，请在网页中查看。",
    "mail.bodyPartial": "邮件正文未完整加载，请重试。",
    "mail.build": "无法生成邮件。",
    "mail.cancelled": "邮箱连接已取消。",
    "mail.changedOpen": "邮箱连接已改变，请重新打开邮件。",
    "mail.changedRefresh": "邮箱连接已改变，请刷新收件箱。",
    "mail.codeMissing": "未找到保存的邮箱授权码，请重新连接。",
    "mail.connect": "请先连接邮箱。",
    "mail.connectAndEnable": "请先连接并开启邮箱接收。",
    "mail.connectThis": "请先连接这个邮箱。",
    "mail.connectUnfinished": "邮箱连接任务未完成。",
    "mail.crashedRetrying": "邮箱后台连接意外中断，正在重新连接。",
    "mail.crashedStopped": "邮箱后台连接多次意外中断，已停止重试。请在设置里重新授权或暂停后再接收，也可以重启岛屿。",
    "mail.disconnect": "无法断开邮箱。",
    "mail.disconnectCredential": "删除邮箱凭据失败，请重试断开。",
    "mail.disconnectPartly": "已停止接收，但删除 Windows 邮箱凭据失败，请重试断开。",
    "mail.headers": "无法读取邮件头。",
    "mail.imapRefused": "邮箱拒绝了连接，请确认已开启 IMAP，并重新输入邮箱授权码。",
    "mail.imapServer": "IMAP 服务器地址无效：填写域名，需要时加端口，例如 imap.example.com 或 imap.example.com:9993。",
    "mail.inbox": "无法打开收件箱，请稍后重试。",
    "mail.inboxChanged": "收件箱已更新，请刷新列表后重试。",
    "mail.inboxChangedOpen": "收件箱已更新，请刷新列表后重新打开邮件。",
    "mail.markRead": "无法把邮件标为已读。",
    "mail.markReadLater": "无法把邮件标为已读，请稍后重试。",
    "mail.needCode": "请输入邮箱设置中生成的授权码。",
    "mail.needRecipient": "请填写收件人。",
    "mail.noAttachment": "找不到这个附件，请重新打开邮件。",
    "mail.noDownloads": "找不到下载文件夹。",
    "mail.noSender": "找不到这封邮件的发件人。",
    "mail.noText": "这封邮件没有可读取的文字正文，请在网页中查看。",
    "mail.off": "邮箱已关闭：在插件页打开「消息」，再在它的设置里打开邮箱。",
    "mail.notRecent": "邮件已不在最近列表中，请刷新收件箱。",
    "mail.read": "无法读取邮件。",
    "mail.readCode": "无法读取 Windows 邮箱凭据，请重新连接。",
    "mail.readLater": "无法读取邮件，请稍后重试。",
    "mail.recipient": ({ address }) => `收件人地址无效：${address}`,
    "mail.removed": "邮件已移除，请刷新收件箱。",
    "mail.saveAttachment": "无法保存附件。",
    "mail.saveCode": "无法保存到 Windows 凭据管理器，请重试连接。",
    "mail.sendFailed": "发送失败，请检查网络后重试。",
    "mail.sendUnfinished": "发送任务未完成。",
    "mail.serviceDown": "邮箱服务不可用。",
    "mail.smtpRefused": "发件服务器拒绝了登录或邮件，请确认已开启 SMTP 服务、授权码正确，以及收件人地址。",
    "mail.start": "无法启动邮箱服务。",
    "mail.stopped": "邮箱后台连接已停止，请在设置里重新授权，或暂停后再接收。",
    "mail.structure": "无法读取邮件结构，请稍后重试。",
    "mail.subject": "主题太长或包含换行。",
    "mail.sync": "无法同步邮箱，请检查网络或稍后重试。",
    "mail.tls": "无法建立加密连接。",
    "mail.tooMany": ({ max }) => `最多同时连接 ${max} 个邮箱，请先断开一个。`,
    "mail.tooManyNames": "下载文件夹里同名文件太多，请清理后重试。",
    "mail.tooManyRecipients": ({ max }) => `一封邮件最多 ${max} 个收件人。`,
    "mail.unavailable": "邮件已移除或暂不可用，请刷新收件箱。",
    "mail.update": "无法更新邮箱连接。",
  },
};

export const en: ErrorsText = {
  withDetail: (text, detail) => `${text.replace(/\.$/, "")}: ${detail}`,
  codes: {
    internal: "Something went wrong inside the island.",
    "updater.busy": "An update is being checked, downloaded or installed; try again in a moment.",
    "updater.targetChanged": "The available update changed; look at the new version before installing.",
    "platform.unsupported": "Not available on this platform yet.",
    "credential.open": isMacOS ? "Could not open the keychain." : "Could not open Windows Credential Manager.",
    "credential.read": isMacOS ? "Could not read from the keychain." : "Could not read from Windows Credential Manager.",
    "credential.save": isMacOS ? "Could not save to the keychain." : "Could not save to Windows Credential Manager.",
    "credential.delete": isMacOS ? "Could not delete from the keychain." : "Could not delete from Windows Credential Manager.",
    "credential.staleApp": "Fuyu has been updated; quit it and open it again.",
    "file.read": ({ path }) => `Could not read ${path}.`,
    "file.write": ({ path }) => `Could not write ${path}.`,
    "file.create": ({ path }) => `Could not create ${path}.`,
    "file.backup": ({ path }) => `Could not back up ${path}.`,
    "updateBackup.failed": "Could not back up your data before installing, so the update was not installed.",
    "updateBackup.badSnapshot": "The settings from the page were incomplete, so nothing was backed up and the update was not installed.",
    "updateBackup.corrupt": ({ path }) => `This backup is damaged (${path} doesn't match) and can't be restored.`,
    "updateBackup.notFound": "This backup no longer exists.",
    "file.undo": ({ path }) => `Could not undo ${path}.`,
    "http.client": "Could not set up the connection.",
    "net.proxy": "The proxy address is not valid. Check the HTTPS_PROXY variable or the system proxy setting.",
    "net.unreachable": ({ service }) => `Could not reach ${service}.`,
    "net.unreadable": ({ service }) => `Could not read ${service}'s answer.`,
    "net.status": ({ service, status }) => `${service} answered ${status}.`,
    "net.said": ({ service }) => `${service} answered with an error.`,
    "net.tooLarge": ({ service }) => `${service} sent more than expected; gave up.`,
    "download.unreachable": ({ what, tried }) => `Could not reach any download source for ${what} (tried ${tried}).`,
    "download.timeout": ({ what, tried }) => `Downloading ${what} timed out (tried ${tried}).`,
    "download.checksum": ({ what, tried }) => `The downloaded ${what} failed verification and was not used (tried ${tried}).`,
    "download.failed": ({ what, tried }) => `Downloading ${what} failed (tried ${tried}).`,
    "inflink.releaseUnreachable": "Could not reach GitHub (api.github.com) to look up the latest InfLink-rs.",
    "inflink.releaseTimeout": "Looking up the latest InfLink-rs on GitHub (api.github.com) timed out.",
    "inflink.noBetterNcm": "BetterNCM was not found. Install it, open NetEase Cloud Music once, then try again.",
    "inflink.write": "Could not put InfLink-rs into BetterNCM's plugins folder.",
    "recording.busy": "A recording is already running.",
    "recording.idle": "Nothing is being recorded.",
    "recording.failed": "The recording failed.",
    "clipboard.read": "Could not read the clipboard.",
    "clipboard.open": "Could not open the clipboard.",
    "clipboard.notLink": "This is not a web address.",
    "clipboard.noLinks": "No web addresses were found in this file.",
    "clipboard.linkMissing": "This bookmark was not found.",
    "shortcut.invalid": "That shortcut is not valid; use at least one modifier key.",
    "shortcut.notReady": "The shortcut service is not ready yet.",
    "shortcut.busy": "The shortcut is being changed already.",
    "coexist.devOnly": "Only a development build has this switch.",
    "coexist.save": "Could not save the choice.",
    "shortcut.update": "Could not change the shortcut.",
    "shortcut.timeout": "Changing the shortcut took too long.",
    "shortcut.taken": ({ shortcut }) => `The shortcut ${shortcut} is taken or cannot be registered.`,
    "quick-commands.empty": "The command is empty.",
    "quick-commands.failed": "The command could not run.",
    "net-speed.read": "Could not read the network speed.",
    "volume.read": "Could not read the volume.",
    "volume.set": "Could not change the volume.",
    "dock.read": "Could not read the running apps.",
    "dock.activate": "Could not switch to the app.",
    "dock.tray": "Could not click the tray icon.",
    "home.envSet": ({ home }) => `The home folder is set by the FUYU_HOME environment variable (${home}) and cannot be changed here; remove the variable first.`,
    "home.notAbsolute": "Enter a full folder path, such as D:\\Fuyu.",
    "home.inUse": ({ computer }) => `Fuyu on "${computer}" is using this folder. Quit Fuyu there first.`,
    "home.copy": ({ path }) => `Could not copy the data to ${path}.`,
    "pluginsV3.builtinUnknown": ({ id }) => `There is no built-in plugin ${id}.`,
    "pluginsV3.builtinEssential": ({ id }) => `${id} is essential to Fuyu and cannot be switched off.`,
    "pluginsV3.builtinSave": ({ id }) => `Could not save the switch for ${id}.`,
    "pluginsV3.builtinConfigKey": ({ id, key }) => `${key} cannot be a setting of ${id}.`,
    "pluginsV3.builtinConfigValue": ({ id, key }) => `The setting ${key} of ${id} must be on or off, a number or text.`,
    "pluginsV3.builtinConfigSave": ({ id }) => `Could not save the settings of ${id}.`,
    "mail.address": "Enter a valid email address.",
    "mail.attachmentDecode": "Could not decode the attachment; download it in the web mail.",
    "mail.attachmentDownload": "Could not download the attachment; check the network and try again.",
    "mail.attachmentGone": "The attachment was removed; refresh the inbox.",
    "mail.attachmentLarge": ({ mb }) => `The attachment is over ${mb} MB; download it in the web mail.`,
    "mail.attachmentParse": "Could not read the attachment; download it in the web mail.",
    "mail.badId": "The mail id is not valid; refresh the inbox.",
    "mail.badPart": "The attachment id is not valid; open the mail again.",
    "mail.bodyDecode": "Could not decode the mail body; open it in the web mail.",
    "mail.bodyFormat": "The mail body is not in the expected format; open it in the web mail.",
    "mail.bodyLarge": "The mail body is too large; open it in the web mail.",
    "mail.bodyLoad": "Could not load the mail body; check the network and try again.",
    "mail.bodyLong": "The text is too long; send it in the web mail.",
    "mail.bodyOver": "The mail body is over 512 KB; open it in the web mail.",
    "mail.bodyParse": "Could not read the mail body; open it in the web mail.",
    "mail.bodyPartial": "The mail body did not load completely; try again.",
    "mail.build": "Could not put the mail together.",
    "mail.cancelled": "The mail connection was cancelled.",
    "mail.changedOpen": "The mail connection changed; open the mail again.",
    "mail.changedRefresh": "The mail connection changed; refresh the inbox.",
    "mail.codeMissing": "The saved authorization code was not found; connect again.",
    "mail.connect": "Connect a mailbox first.",
    "mail.connectAndEnable": "Connect the mailbox and turn receiving on first.",
    "mail.connectThis": "Connect this mailbox first.",
    "mail.connectUnfinished": "Connecting did not finish.",
    "mail.crashedRetrying": "The mail connection broke off; connecting again.",
    "mail.crashedStopped": "The mail connection broke off several times and stopped retrying. Authorize again in Settings, pause and resume receiving, or restart the island.",
    "mail.disconnect": "Could not disconnect the mailbox.",
    "mail.disconnectCredential": "Deleting the saved code failed; disconnect again.",
    "mail.disconnectPartly": "Receiving stopped, but deleting the saved code from Windows Credential Manager failed; disconnect again.",
    "mail.headers": "Could not read the mail's headers.",
    "mail.imapRefused": "The mailbox refused the connection; check that IMAP is on and enter the authorization code again.",
    "mail.imapServer": "The IMAP server address is not valid: fill in a domain, with a port if needed, such as imap.example.com or imap.example.com:9993.",
    "mail.inbox": "Could not open the inbox; try again later.",
    "mail.inboxChanged": "The inbox changed; refresh the list and try again.",
    "mail.inboxChangedOpen": "The inbox changed; refresh the list and open the mail again.",
    "mail.markRead": "Could not mark the mail as read.",
    "mail.markReadLater": "Could not mark the mail as read; try again later.",
    "mail.needCode": "Enter the authorization code made in the mailbox settings.",
    "mail.needRecipient": "Fill in a recipient.",
    "mail.noAttachment": "This attachment was not found; open the mail again.",
    "mail.noDownloads": "The Downloads folder was not found.",
    "mail.noSender": "This mail's sender was not found.",
    "mail.noText": "This mail has no text to read; open it in the web mail.",
    "mail.off": "Mail is off. Turn on Messages in Plugins, then Mail in its settings.",
    "mail.notRecent": "The mail is no longer in the recent list; refresh the inbox.",
    "mail.read": "Could not read the mail.",
    "mail.readCode": "Could not read the saved code from Windows Credential Manager; connect again.",
    "mail.readLater": "Could not read the mail; try again later.",
    "mail.recipient": ({ address }) => `Not a valid recipient address: ${address}`,
    "mail.removed": "The mail was removed; refresh the inbox.",
    "mail.saveAttachment": "Could not save the attachment.",
    "mail.saveCode": "Could not save to Windows Credential Manager; connect again.",
    "mail.sendFailed": "Sending failed; check the network and try again.",
    "mail.sendUnfinished": "Sending did not finish.",
    "mail.serviceDown": "The mail service is not available.",
    "mail.smtpRefused": "The mail server refused the sign-in or the mail; check that SMTP is on, the authorization code and the recipients.",
    "mail.start": "Could not start the mail service.",
    "mail.stopped": "The mail connection stopped; authorize again in Settings, or pause and resume receiving.",
    "mail.structure": "Could not read the mail's structure; try again later.",
    "mail.subject": "The subject is too long or has a line break.",
    "mail.sync": "Could not sync the mailbox; check the network or try again later.",
    "mail.tls": "Could not set up an encrypted connection.",
    "mail.tooMany": ({ max }) => `At most ${max} mailboxes at once; disconnect one first.`,
    "mail.tooManyNames": "Too many files with this name in Downloads; clear some and try again.",
    "mail.tooManyRecipients": ({ max }) => `At most ${max} recipients in one mail.`,
    "mail.unavailable": "The mail was removed or is not available; refresh the inbox.",
    "mail.update": "Could not update the mail connection.",
  },
};
