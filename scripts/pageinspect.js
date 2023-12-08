/* eslint-disable no-continue */
import { createTag } from './scripts.js';

export function showPreview(url) {
  // first load the site into an iframe
  const accordian = createTag('button', { class: 'accordion' });
  accordian.innerText = 'Preview';
  const previewDIV = createTag('div', { class: 'previewinfo panel' });
  const previewtitle = createTag('h3');
  previewtitle.innerText = 'Preview';
  const iframe = createTag('iframe', { src: `${url}`, class: 'previewframe', title: 'Site Preview' });
  const resultscontainer = document.querySelector('.results-container');
  previewDIV.append(previewtitle, iframe);
  resultscontainer.append(accordian, previewDIV);
}

export function showMetadata(url) {
  fetch(url).then((response) => response.text()).then((html) => {
    // Convert the HTML string into a document object

    const accordian = createTag('button', { class: 'accordion' });
    accordian.innerText = 'Metadata';
    const metaInfo = createTag('div', { class: 'metainfo panel' });
    const title = createTag('h3');
    title.innerText = 'Metadata';
    metaInfo.append(title);
    const resultscontainer = document.querySelector('.results-container');
    resultscontainer.append(accordian, metaInfo);
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const metatags = doc.querySelectorAll('head > meta');
    metatags.forEach((tag) => {
      const p = createTag('p', { class: 'info' });
      p.innerText = tag.outerHTML;
      metaInfo.append(p);
    });
  }).catch((err) => {
    // There was an error
    console.warn('Something went wrong.', err);
  });
}

export function showIntegrationsInfo(url) {
  //   const block = document.querySelector('.searchform');
  const accordian = createTag('button', { class: 'accordion' });
  accordian.innerText = 'Integrations';
  const integrationInfo = createTag('div', { class: 'integrationsinfo panel' });
  const title = createTag('h3');
  title.innerText = 'Integrations';
  integrationInfo.append(title);
  const resultscontainer = document.querySelector('.results-container');
  resultscontainer.append(accordian, integrationInfo);

  fetch(url).then((response) => response.text()).then((html) => {
    // Convert the HTML string into a document object
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const scripts = doc.querySelectorAll('script');

    let cminfofound = false;
    let launchinfofound = false;
    let onetrustinfofound = false;
    let customDatalayer = false;
    let googletagmanager = false;

    for (let i = 0; i <= scripts.length; i += 1) {
      const { src } = scripts[i];
      const txt = scripts[i].innerText;

      const p = createTag('p', { class: 'infotext' });
      const code = createTag('p', { class: 'codeblock' });

      if (!googletagmanager && txt && txt.includes('https://www.googletagmanager.com')) {
        googletagmanager = true;
        p.innerText = 'Google Tag Manager';
        code.innerText = txt;
        integrationInfo.append(p);
        integrationInfo.append(code);
        continue;
      }

      if (!customDatalayer && txt && (txt.includes('dataLayer') || txt.includes('digitalData'))) {
        customDatalayer = true;
        p.innerText = 'Custom Data Layer';
        code.innerText = txt;
        integrationInfo.append(p);
        integrationInfo.append(code);
        continue;
      }

      if (!cminfofound && src.includes('etc.clientlibs')) {
        cminfofound = true;
        p.innerText = 'Site built using Adobe Experience Manager';
        integrationInfo.append(p);
        continue;
      }

      if (!launchinfofound && src.includes('assets.adobedtm.com')) {
        launchinfofound = true;
        p.innerText = 'Adobe Launch is in use';
        integrationInfo.append(p);
        code.innerText = src;
        integrationInfo.append(code);
        continue;
      }

      if (!onetrustinfofound && src.includes('cdn.cookielaw.org')) {
        onetrustinfofound = true;
        p.innerText = 'OneTrust Cookie consent integration in use';
        integrationInfo.append(p);
        code.innerText = src;
        integrationInfo.append(code);
        continue;
      }
    }
  }).catch((err) => {
    // There was an error
    console.warn('Something went wrong.', err);
  });
}
