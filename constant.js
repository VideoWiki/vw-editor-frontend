const constants = {
  apiUrl: 'https://api.video.wiki',
  url: 'https://video.wiki',
  castUrl: 'https://cast.video.wiki',
  infuraId: '418d1d91f132479ebcc600dab6dbbd3f',
  apiKey: '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',
};
if (process.env.NODE_ENV === 'production') {
  constants.apiUrl = 'https://api.video.wiki';
  constants.url = 'https://video.wiki';
}
export default constants;
