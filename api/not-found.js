// 404 for agents. vercel.json rewrites any unmatched path here when the
// request sends Accept: text/markdown; browsers still get /404.html.

module.exports = (req, res) => {
  res.statusCode = 404;
  res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
  res.setHeader('Vary', 'Accept');
  res.end(`# 404: page not found

The page you requested doesn't exist on alanaziz.com. It may have moved or the URL may be mistyped.

Find what's on the site in [llms.txt](https://alanaziz.com/llms.txt).
`);
};
