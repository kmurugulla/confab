import { createTag } from './scripts.js';

function showRobotsTxt(text) {
  const accordian = createTag('button', { class: 'accordion' });
  accordian.innerText = 'robots.txt';
  const robotsinfo = createTag('div', { class: 'robotsinfo panel' });
  const heading = createTag('h4');
  heading.innerText = 'robots.txt';

  const info = createTag('p');
  info.innerText = text;
  robotsinfo.append(heading, info);
  document.querySelector('.results-container').append(accordian, robotsinfo);
}

function getSitemapURLs(robotsTxt) {
  const lines = robotsTxt.split('\n');
  const sitemapUrls = [];
  if (lines && lines.length) {
    const sitemaps = lines.filter((line) => line.startsWith('Sitemap:'));
    sitemaps.forEach((sitemap) => {
      sitemapUrls.push(sitemap.substring(sitemap.indexOf(':') + 1, sitemap.length));
    });
  }
  return sitemapUrls;
}

const groupByPath = (urls) => {
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
  let totalpages = 0;
  const accordian = createTag('button', { class: 'accordion' });
  accordian.innerText = 'Number of Pages';
  const pagestats = createTag('div', { class: 'pagestats panel' });
  const heading = createTag('h4');
  heading.innerText = 'Number of Pages';
  pagestats.append(heading);
  sitemapurls.forEach((sitemap) => {
    // console.log(`calculating number of pages in ${sitemap}`);
    fetch(sitemap)
      .then((response) => response.text())
      .then((text) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(text, 'application/xml');
        if (doc.hasChildNodes()) {
          const stats = createTag('p', { class: 'sitemapcount' });
          const sitemapNodes = doc.querySelectorAll('loc');
          const numberofPages = sitemapNodes.length;

          stats.textContent = `${sitemap} -> ${numberofPages}`;
          pagestats.append(stats);

          if (numberofPages > 0) {
            totalpages += numberofPages;
            const pagesByPath = groupByPath(Array.from(sitemapNodes));
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
          const totalCnt = createTag('p', { class: 'sitemapcount' });
          totalCnt.innerText = `Sub Total - ${totalpages}`;
          pagestats.append(totalCnt);
        }
      });
  });

  document.querySelector('.results-container').append(accordian, pagestats);
}
// eslint-disable-next-line import/prefer-default-export
export function showPageStats(siteUrl) {
  const robotsurl = `${siteUrl}/robots.txt`;
  fetch(robotsurl)
    .then((response) => response.text())
    .then((robotsTxt) => {
      showRobotsTxt(robotsTxt);
      const sitemapUrls = getSitemapURLs(robotsTxt);
      if (sitemapUrls && sitemapUrls.length > 0) {
        showPageCount(getSitemapURLs(robotsTxt));
      } else {
        const sitemapurl = [`${siteUrl}/sitemap.xml`];
        showPageCount(sitemapurl);
      }
    });
}
