/* eslint-disable guard-for-in */
/* eslint-disable import/prefer-default-export */
/* eslint-disable no-restricted-syntax */
import { createTag } from './scripts.js';

function showInitialContent(id, div) {
  //   document.body.innerHTML = '';
  const title = document.createElement('h3');
  title.textContent = 'Page Speed Insights';
  div.appendChild(title);
  const page = document.createElement('p');
  page.textContent = `Page tested: ${id}`;
  div.appendChild(page);
}

function showCruxContent(cruxMetrics, div) {
  const cruxHeader = document.createElement('h4');
  cruxHeader.textContent = 'Chrome User Experience Report Results';
  div.appendChild(cruxHeader);
  for (const key in cruxMetrics) {
    const p = document.createElement('p');
    p.textContent = `${key}: ${cruxMetrics[key]}`;
    div.appendChild(p);
  }
}

function showLighthouseContent(lighthouseMetrics, div) {
  const lighthouseHeader = document.createElement('h4');
  lighthouseHeader.textContent = 'Lighthouse Results';
  div.appendChild(lighthouseHeader);
  for (const key in lighthouseMetrics) {
    const p = document.createElement('p');
    p.textContent = `${key}: ${lighthouseMetrics[key]}`;
    div.appendChild(p);
  }
}

function setUpQuery(siteurl, strategy) {
  const api = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';
  const parameters = {
    url: encodeURIComponent(siteurl),
    strategy: `${strategy}`,
  };
  const apikey = '';
  let query = `${api}?`;
  for (const key in parameters) {
    query += `${key}=${parameters[key]}&`;
  }
  return `${query}key=${apikey}`;
}

export function showTreoshURL(url) {
  // first load the site into an iframe
  const accordian = createTag('button', { class: 'accordion' });
  accordian.innerText = `treo.sh (${url})`;
  const previewDIV = createTag('div', { class: 'treoshinfo panel' });
  const previewtitle = createTag('h3');
  previewtitle.innerText = 'More details from Treo.sh';
  const treoshlink = createTag('a', { href: `https://treo.sh/sitespeed/${url}`, title: 'Treosh Report', target: '_blank' });
  treoshlink.innerText = 'Treo.sh report';
  const resultscontainer = document.querySelector('.results-container');
  previewDIV.append(previewtitle, treoshlink);
  resultscontainer.append(accordian, previewDIV);
}

export function showPageSpeedInfo(siteurl, strategy) {
  const url = setUpQuery(siteurl, strategy);
  const resultscontainer = document.querySelector('.results-container');
  const accordian = createTag('button', { class: 'accordion' });
  accordian.innerText = `Page Speed (${strategy}) - ${siteurl}`;
  const pageSpeedInfo = createTag('div', { class: 'pagespeedinfo panel' });
  pageSpeedInfo.innerText = `Gathering page speed insights for ${siteurl}..`;
  resultscontainer.append(accordian, pageSpeedInfo);
  const msg = resultscontainer.querySelector('.msg');
  fetch(url)
    .then((response) => response.json())
    .then((json) => {
      pageSpeedInfo.innerText = '';
      // See https://developers.google.com/speed/docs/insights/v5/reference/pagespeedapi/runpagespeed#response
      // to learn more about each of the properties in the response object.
      showInitialContent(json.id, pageSpeedInfo);
      const cruxMetrics = {
        'First Contentful Paint': json.loadingExperience.metrics.FIRST_CONTENTFUL_PAINT_MS.category,
        'First Input Delay': json.loadingExperience.metrics.FIRST_INPUT_DELAY_MS.category,
      };
      showCruxContent(cruxMetrics, pageSpeedInfo);
      const lighthouse = json.lighthouseResult;
      const score = lighthouse.categories.performance.score * 100;
      const lighthouseMetrics = {
        'Form Factor': lighthouse.configSettings.formFactor,
        'Perfomance Score': `${score}`,
        'First Contentful Paint': lighthouse.audits['first-contentful-paint'].displayValue,
        'Speed Index': lighthouse.audits['speed-index'].displayValue,
        'Time To Interactive': lighthouse.audits.interactive.displayValue,
        'First Meaningful Paint': lighthouse.audits['first-meaningful-paint'].displayValue,
      };
      showLighthouseContent(lighthouseMetrics, pageSpeedInfo);
      if (msg) { msg.textContent = ''; }
    });
}
