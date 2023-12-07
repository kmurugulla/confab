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

export async function showCDNInfo(siteurl) {
  const payload = {
    url: `${siteurl}`,
    types: ['A', 'MX', 'CNAME'],
  };
  console.log(JSON.stringify(payload));
  await postData(payload).then((data) => {
    console.log(data);
    const accordian = createTag('button', { class: 'accordion' });
    accordian.value = 'CDN';
    const cdninfo = createTag('div', { class: 'cdninfo,panel' });
    const title = createTag('h3');
    const code = createTag('p', { class: 'code' });
    code.innerText = data;
    title.innerText = 'CDN Information';
    cdninfo.append(title, code);
    const block = document.querySelector('.searchform');
    block.append(accordian, cdninfo);
  });
}
