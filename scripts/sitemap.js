import { createTag } from './scripts.js';

function showRobotsTxt(text) {
  const robotsinfo = createTag('div', { class: 'robotsinfo' });
  const heading = createTag('h4');
  heading.innerText = 'robots.txt';

  const info = createTag('p');
  info.innerText = text;
  robotsinfo.append(heading, info);
  document.querySelector('.searchform').append(robotsinfo);
}

function getSitemapURLs(text) {
  const lines = text.split('\n');
  const sitemapUrls = [];
  if (lines && lines.length) {
    const sitemaps = lines.filter((line) => line.startsWith('Sitemap:'));

    sitemaps.forEach((sitemap) => {
      sitemapUrls.push(sitemap.substring(sitemap.indexOf(':') + 1, sitemap.length));
    });
  }
  return sitemapUrls;
}

const showPageCountByPath = (urls) => {
  let res = [];
  res = urls.reduce((acc, val, ind) => {
    const path = (urlString) => {
      if (urlString) {
        const url = urlString.textContent;
        return url.substring(0, url.lastIndexOf('/'));
      }
      return '';
    };

    if (path(val) === path(urls[ind - 1])) {
      const url = val.textContent;
      acc[acc.length - 1].push(url.substring(0, url.lastIndexOf('/')));
    } else {
      const url = val.textContent;
      acc.push([url.substring(0, url.lastIndexOf('/'))]);
    }

    return acc;
  }, []);
  return res;
};

function showPageCount(sitemapurls) {
  // console.log(`#pages in sitemap ${sitemap} -> ${doc.querySelectorAll('url').length}`);
  const pagestats = createTag('div', { class: 'pagestats' });
  const heading = createTag('h4');
  heading.innerText = 'Page Stats';
  pagestats.append(heading);
  sitemapurls.forEach((sitemap) => {
    // console.log(`calculating number of pages in ${sitemap}`);
    fetch(sitemap)
      .then((response) => response.text())
      .then((text) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'application/xml');
        if (doc.hasChildNodes()) {
          const stats = createTag('p');
          const sitemapNodes = doc.querySelectorAll('url > loc');
          stats.textContent = `${sitemap} -> ${sitemapNodes.length}`;
          pagestats.append(stats);
          const pagesByPath = showPageCountByPath(Array.from(sitemapNodes));
          let tbody = '<thead> <tr><th>Path</th><th>Count</th></tr></thead>';
          pagesByPath.forEach((el) => {
            const pathCount = [];
            pathCount.push({ path: `${el[0]}`, count: `${el.length}` });

            pathCount.forEach((entry) => {
              tbody = `${tbody}<tr>
              <td>${entry.path} </td>
              <td>${entry.count} </td>
              </tr>
              `;
            });
          });
          const table = createTag('table', { class: 'paths-table' });

          table.innerHTML = tbody;
          pagestats.append(table);
        }
      });
  });
  document.querySelector('.searchform').append(pagestats);
}
export function parseRobotsTxt(siteUrl) {
  const robotsurl = `${siteUrl}/robots.txt`;
  fetch(robotsurl)
    .then((response) => response.text())
    .then((text) => {
      showRobotsTxt(text);
      showPageCount(getSitemapURLs(text));
    });
}
