export default {
  async fetch(request) {
    const url = new URL(request.url);
    const newUrl = 'https://timelesz-zaiko-static.pages.dev' + url.pathname + url.search;
    return Response.redirect(newUrl, 301);
  },
};
