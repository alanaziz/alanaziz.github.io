// GET / with Accept: text/markdown (rewritten here by vercel.json).
// A Markdown version of the homepage for agents; browsers still get index.html.
// Keep in step with index.html when its copy changes.

module.exports = (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
  res.setHeader('Vary', 'Accept');
  res.end(`# Alan Aziz Review

Gadgets & tech creator based in Kuala Lumpur. Instagram & TikTok: [@alanazizreview](https://www.instagram.com/alanazizreview/) · [TikTok](https://www.tiktok.com/@alanazizreview).

Hi, I'm Alan and I make internet videos, tests and reviews. I don't review for myself. I review for the person doing their research before they buy.

## What I cover

- **Gear first look:** unboxing and first impressions of new launches.
- **Studio test:** mics, lights and cameras tested side by side in my studio, same setup every time.
- **Brand collab:** a dedicated video for your product, clearly labelled, filmed with the same care as my own reviews.
- **Own verdict:** brands can check the facts and specs. The verdict stays mine.

## Brands I've worked with

RØDE, DJI, Insta360, Hollyland, Comica, Maono, Ugreen, Ulanzi, Xiaomi, Redmi, Vivo, Realme, Infinix, Colbor, Amaran, Saramonic, Trapo, MR★K.A.R, Homan, Pixel Distribution.

## Work with me

Tell me about your brand and I'll send my media kit to your inbox: [partnership inquiry form](https://alanaziz.com/#contact).

## Pages

- [Gear](https://alanaziz.com/gear/)
- [Newsroom](https://alanaziz.com/newsroom/)
- [llms.txt](https://alanaziz.com/llms.txt)
- [Sitemap](https://alanaziz.com/sitemap.xml)
`);
};
