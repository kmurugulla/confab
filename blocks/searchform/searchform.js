import { createTag } from '../../scripts/scripts.js';

import { runPagespeed } from '../../scripts/pagespeed.js';
import { parseRobotsTxt } from '../../scripts/sitemap.js';

export default function decorate(block) {
  // create the search form
  const form = createTag('form');
  const siteUrlLbl = document.createTextNode('Site Url');
  const siteUrlTxt = createTag('input', { type: 'text', placeholder: 'https://www.xyz.com' });
  siteUrlTxt.value = 'https://www.ust.com'; // comment this after testing
  const startBtn = createTag('button', { id: 'start' });
  startBtn.textContent = "Let's Go...";
  form.append(siteUrlLbl, siteUrlTxt, startBtn);
  block.append(form);

  // event listener for button click
  startBtn.addEventListener('click', (evt) => {
    const msgLbl = createTag('label', { class: 'msg' });
    const prevMsg = block.querySelector('.msg');
    block.append(msgLbl);
    if (prevMsg) { prevMsg.remove(); }
    if (document.querySelector('.pagespeedinfo')) {
      document.querySelector('.pagespeedinfo').textContent = '';
    }
    evt.preventDefault();
    if (siteUrlTxt.value) {
      const siteURL = siteUrlTxt.value;
      msgLbl.textContent = '';
      msgLbl.textContent = `fetching robots.txt of ${siteURL}`;
      parseRobotsTxt(siteURL);
      msgLbl.textContent = `running page speed index  on ${siteURL}`;
      runPagespeed(siteURL);
    } else {
      msgLbl.textContent = '';
      msgLbl.textContent = 'please enter a website url';
    }
  });
}
