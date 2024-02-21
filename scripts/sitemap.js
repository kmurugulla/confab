import { createTag } from './scripts.js';

function showRobotsTxt(text) {
  const accordian = createTag('button', { class: 'accordion' });

  const robotsinfo = createTag('div', { class: 'robotsinfo panel' });
  const heading = createTag('h4');
  if (text.includes('not accessible')) {
    heading.innerText = '';
    accordian.innerText = 'robots.txt not accessible';
    accordian.classList.add('error');
  } else {
    heading.innerText = 'robots.txt';
    accordian.innerText = 'robots.txt';
  }
  const info = createTag('p');
  info.innerText = text;
  robotsinfo.append(heading, info);
  document.querySelector('.results-container').append(accordian, robotsinfo);
}

function getSitemapURLsFrmRobots(robotsTxt) {
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

async function isResourceAvailable(resource) {
  try {
    const headResponse = await fetch(resource, { method: 'HEAD' });
    if (headResponse.ok) {
      return true;
    }
    return false;
  } catch (error) {
    console.log(`error occured in requesting ${resource}`);
  }
  return false;
}

async function getResource(url, format = 'json') {
  let data;
  try {
    const response = await fetch(url);
    if (response.ok) {
      if (format === 'text') {
        data = await response.text();
      } else {
        data = response.json();
      }
      return data;
    }
  } catch (error) {
    console.log(`error occured in requesting ${url}`);
  }
  return data;
}

async function getNumberOfPages(sitemapurl) {
  const pages = [];
  const assets = [];
  // if the loc nodes points to .xml , return the .xml urls
  // if the loc nodes does not point to .xml then just rertun the file
  const sitemapUrls = [];
  const siteMapXMLResource = await getResource(sitemapurl, 'text');
  const parser = new DOMParser();
  const siteMapXML = parser.parseFromString(siteMapXMLResource, 'application/xml');
  const locs = siteMapXML.querySelectorAll('loc');
  locs.forEach((loc) => {
    const locationTxt = loc.textContent;
    const resource = locationTxt.substring(locationTxt.lastIndexOf('/') + 1, locationTxt.length);

    // treating it as another sitemap xml to prase through
    if (resource.endsWith('.xml')) {
      sitemapUrls.push(loc.textContent);
    }

    if (resource.includes('.html') || !resource.includes('.')) {
      pages.push(loc.textContent);
    } else {
      assets.push(loc.textContent);
    }
  });

  const countObject = {};
  countObject.sitemapurl = sitemapurl;
  countObject.sitemapcnt = sitemapUrls.length;
  countObject.pagecnt = pages.length;
  countObject.assetcnt = assets.length;
  countObject.sitemaps = [...sitemapUrls];
  // there are one or more sitemaps in the index
  if (sitemapUrls.length > 0) {
    sitemapUrls.forEach((sitemap) => {
      getNumberOfPages(sitemap);
    });
  }
  return countObject;
}

async function getSiteMapUrls(siteurl) {
  const siteMapFiles = ['robots.txt', 'sitemap_index.xml', 'sitemap.xml'];
  const sitemapUrls = [];
  const robotsurl = `${siteurl}/${siteMapFiles[0]}`;

  if (await isResourceAvailable(robotsurl)) {
    const robotsTxt = await getResource(robotsurl, 'text');
    return getSitemapURLsFrmRobots(robotsTxt);
  }

  const sitemapindexurl = `${siteurl}/${siteMapFiles[1]}`;

  if (await isResourceAvailable(sitemapindexurl)) {
    return getNumberOfPages(sitemapindexurl);
  }

  const sitemapurl = `${siteurl}/${siteMapFiles[2]}`;

  if (await isResourceAvailable(sitemapurl)) {
    return getNumberOfPages(sitemapurl);
  }

  return sitemapUrls;
}

function showTotalCount() {
  const accordian = createTag('button', { class: 'accordion pagestats' });
  accordian.innerText = 'Calculating total number of pages ...';
  const pagestats = createTag('div', { class: 'pagestats panel' });
  const heading = createTag('h4');
  heading.innerText = 'Calculating total number of pages ...';
  pagestats.append(heading);
  document.querySelector('.results-container').append(accordian, pagestats);
}

function updateTotalCount(totalCnt) {
  const accordian = document.querySelector('.accordion.pagestats');
  accordian.innerText = `Total Number of Pages - ${totalCnt}`;
  const heading = document.querySelector('.pagestats.panel > h4');
  heading.innerText = `Total Number of Pages - ${totalCnt}`;
}

function showPageCountError() {
  const accordian = createTag('button', { class: 'accordion error' });
  accordian.innerText = 'Site Map Resources are not available';
  const pagestats = createTag('div', { class: 'pagestats panel' });
  const heading = createTag('h4');
  heading.innerText = 'Site Map Resources are not available';
  pagestats.append(heading);
  document.querySelector('.results-container').append(accordian, pagestats);
}

// eslint-disable-next-line import/prefer-default-export
export async function showPageStats(siteUrl) {
  const robotsurl = `${siteUrl}/robots.txt`;
  fetch(robotsurl)
    .then((response) => {
      if (response.ok) return response.text();
      return `not accessible at ${robotsurl}`;
    })
    .then((robotsTxt) => {
      showRobotsTxt(robotsTxt);
    });

  const sitemapUrls = await getSiteMapUrls(siteUrl);
  console.log(sitemapUrls.length);
  if (sitemapUrls.length > 0) {
    let totalCnt = 0;
    showTotalCount(totalCnt);
    await Promise.allSettled(
      sitemapUrls.map(
        async (sitemapurl) => {
          const countObj = await getNumberOfPages(sitemapurl);
          if (countObj.sitemapcnt > 0) {
            await Promise.allSettled(
              countObj.sitemaps.map(async (suburl) => {
                const countSubObj = await getNumberOfPages(suburl);
                totalCnt += countSubObj.pagecnt;
              }),
            );
          } else {
            totalCnt += countObj.pagecnt;
          }
        },
      ),
    ).then(() => {
      updateTotalCount(totalCnt);
    });
  } else {
    showPageCountError();
  }
}
