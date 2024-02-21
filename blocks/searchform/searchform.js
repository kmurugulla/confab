import { createTag } from '../../scripts/scripts.js';

import { showPageSpeedInfo, showTreoshURL } from '../../scripts/pagespeed.js';
import { showPageStats } from '../../scripts/sitemap.js';
import { showPreview, showIntegrationsInfo, showMetadata } from '../../scripts/pageinspect.js';
import { showCDNInfoInstructions } from '../../scripts/cdninfo.js';

function isValidHttpUrl(str) {
  const pattern = new RegExp(
    '^(https?:\\/\\/)?' // protocol
      + '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' // domain name
      + '((\\d{1,3}\\.){3}\\d{1,3}))' // OR ip (v4) address
      + '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' // port and path
      + '(\\?[;&a-z\\d%_.~+=-]*)?' // query string
      + '(\\#[-a-z\\d_]*)?$', // fragment locator
    'i',
  );
  return pattern.test(str);
}

const buildAccordian = (block) => {
  // const acc = block.querySelectorAll('.accordion');
  const acc = block.querySelectorAll('.accordion');
  let i;
  for (i = 0; i < acc.length; i += 1) {
    acc[i].addEventListener('click', function () {
      this.classList.toggle('active');
      const panel = this.nextElementSibling;

      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = `${panel.scrollHeight}px`;
      }
    });
  }
};

function displayResults(event, siteUrlTxt, block) {
  event.preventDefault();
  const msgLbl = createTag('label', { class: 'msg' });
  const prevMsg = block.querySelector('.msg');
  block.append(msgLbl);
  if (prevMsg) { prevMsg.remove(); }

  if (document.querySelector('.pagespeedinfo')) {
    document.querySelector('.pagespeedinfo').textContent = '';
  }

  if (siteUrlTxt.value) {
    const siteURL = siteUrlTxt.value;
    if (isValidHttpUrl(siteURL)) {
      const url = new URL(siteURL);
      const { origin } = url;
      const divs = block.querySelectorAll('div');
      divs.forEach((element) => {
        element.innerText = '';
      });

      showPageSpeedInfo(origin, 'MOBILE');
      showPageSpeedInfo(origin, 'DESKTOP');
      showTreoshURL(origin);
      showPreview(origin);
      showMetadata(origin);
      showIntegrationsInfo(origin);
      showPageStats(origin);
      showCDNInfoInstructions(origin);
    } else {
      msgLbl.textContent = '';
      msgLbl.textContent = 'please enter a valid website url';
    }
  } else {
    msgLbl.textContent = '';
    msgLbl.textContent = 'please enter a valid website url';
  }
}

export default function decorate(block) {
  // create the search form
  const form = createTag('form');
  const siteUrlLbl = document.createTextNode('Site Url');
  const siteUrlTxt = createTag('input', { type: 'text', placeholder: 'https://www.xyz.com', class: 'urlinput' });
  siteUrlTxt.value = 'https://www.888.de/'; // comment this after testing
  const startBtn = createTag('button', { id: 'start' });
  startBtn.textContent = 'Collect';
  form.append(siteUrlLbl, siteUrlTxt, startBtn);
  block.append(form);

  // event listener for button click
  startBtn.addEventListener('click', (evt) => {
    const resultscontainer = createTag('div', { class: 'results-container' });
    resultscontainer.textContent = '';
    block.append(resultscontainer);
    displayResults(evt, siteUrlTxt, block);
    setTimeout(() => {
      buildAccordian(block);
    }, 2000);
  });
}
