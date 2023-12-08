import { createTag } from './scripts.js';
/* eslint-disable import/prefer-default-export */
// Example POST method implementation:
async function postData(data) {
  // Default options are marked with *
  const response = await fetch('https://api.siterelic.com/dnsrecord', {
    method: 'POST',
    referrerPolicy: 'no-referrer',
    headers: {
      'x-api-key': '430fccef-22fe-4634-808f-6d64cf9f6702',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

export function showCDNInfoInstructions(siteurl) {
  const accordian = createTag('button', { class: 'accordion' });
  accordian.innerText = 'Instructions to get CDN in use';
  const cdninstructions = createTag('div', { class: 'cdninstructions panel' });
  const title = createTag('h3');
  title.innerText = 'Instructions';
  cdninstructions.append(title);
  const siterelic = createTag('a', { href: 'https://siterelic.com/dnsrecord', title: 'Siterelic', target: '_blank' });
  siterelic.innerText = 'Siterelic';
  const instructions = createTag('ul');
  instructions.innerHTML = `
  <li> Replace <b>url</b> value in payload (right pane) with ${siteurl} </li>
  <li> Send the POST request and look for <i> data -> CNAME</i> value in response JSON </li>
  <li> Subdomain in the <i>CNAME</i> could indicate the CDN vendor  </li>
  <li> Go to ${siterelic.outerHTML} </li>
  `;
  cdninstructions.append(instructions);
  const resultscontainer = document.querySelector('.results-container');
  resultscontainer.append(accordian, cdninstructions);
}

export async function showCDNInfo(siteurl) {
  const payload = {
    url: `${siteurl}`,
    types: ['A', 'MX', 'CNAME'],
  };

  await postData(payload).then((data) => {
    const accordian = createTag('button', { class: 'accordion' });
    accordian.value = 'CDN';
    const cdninfo = createTag('div', { class: 'cdninfo,panel' });
    const title = createTag('h3');
    const code = createTag('p', { class: 'code' });
    code.innerText = data;
    title.innerText = 'CDN Information';
    cdninfo.append(title, code);
    const resultscontainer = document.querySelector('.results-container');
    resultscontainer.append(accordian, cdninfo);
  });
}
