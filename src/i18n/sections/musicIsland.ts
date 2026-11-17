export type MusicIslandText = {
  title: string;
  close: string;
  noLyrics: string;
  loadingLyrics: string;
  settings: MusicIslandSettingsText;
};

export type MusicIslandSettingsText = {
  title: string;
  enable: string;
  enableHint: string;
};

export const zhCN: MusicIslandText = {
  title: "音乐副岛",
  close: "收起音乐副岛",
  noLyrics: "这首歌没有找到歌词",
  loadingLyrics: "正在找歌词…",
  settings: {
    title: "音乐副岛",
    enable: "播放音乐时弹出音乐副岛",
    enableHint: "有音乐在播时，在主岛下方单独弹出一个胶囊副岛，显示封面、歌词和播放控制。音乐停了副岛自动收起，关掉后不再自动弹出。",
  },
};

export const en: MusicIslandText = {
  title: "Music island",
  close: "Hide the music island",
  noLyrics: "No lyrics were found for this song",
  loadingLyrics: "Looking for lyrics…",
  settings: {
    title: "Music island",
    enable: "Pop out the music island while music plays",
    enableHint: "While music is playing, a separate capsule island appears below the main island with the cover, lyrics and playback controls. It folds away when the music stops, and stays hidden while this is off.",
  },
};
