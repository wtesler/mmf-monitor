module.exports = async (browser) => {
  const page = await browser.newPage();
  await page.setRequestInterception(true);
  page.on("request", req => {
    // Prevent certain filetypes from loading.
    // Possible: document, stylesheet, image, media, font, script, texttrack, xhr, fetch, eventsource, websocket, manifest, other
    if (
      req.resourceType() === "font"
      || req.resourceType() === "image"
      || req.resourceType() === "media"
      || req.resourceType() === "stylesheet"
      // || req.resourceType() === "document"
    ) {
      req.abort();
    } else {
      req.continue();
    }
  });
  return page;
}
