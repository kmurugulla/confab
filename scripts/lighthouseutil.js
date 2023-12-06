// import fs from 'fs';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

// import lighthouse from 'lighthouse/core/index.cjs';
// import chromeLauncher from 'chrome-launcher/chrome-launcher/index.js';

const url = 'https://www.ust.com';
const runEnvironment = 'dev';
const lighthouseOptionsArray = [
  {
    extends: 'lighthouse:default',
    settings: {
      onlyCategories: ['performance'],
      emulatedFormFactor: 'desktop',
      output: ['html', 'json'],
    },
  },
  {
    extends: 'lighthouse:default',
    settings: {
      onlyCategories: ['performance'],
      emulatedFormFactor: 'mobile',
      output: ['html', 'json'],
    },
  },
];

// const lighthouseOptions = {
//   extends: 'lighthouse:default',
//   settings: {
//     onlyCategories: ['accessibility'],
//     emulatedFormFactor: 'desktop',
//     output: ['html'],
//   },
// };

function launchChromeAndRunLighthouse(url, opts, config = null) {
  return chromeLauncher.launch({ chromeFlags: opts.chromeFlags }).then((chrome) => {
    opts.port = chrome.port;
    return lighthouse(url, opts, config).then((results) => chrome.kill().then(() => results.lhr));
  });
}

function wait(val) {
  return new Promise((resolve) => setTimeout(resolve, val));
}

// function passOrFailA11y(results, optionSet, chrome) {
//   const targetA11yScore = 95;
//   const { windowSize } = optionSet;
//   const accessibilityScore = results.categories.accessibility.score * 100;
//   if (accessibilityScore) {
//     if (windowSize === 'desktop') {
//       if (accessibilityScore < targetA11yScore) {
//         console.error(`Target accessibility score: ${targetA11yScore}, current accessibility score ${accessibilityScore}`);
//         chrome.kill();
//         process.exitCode = 1;
//       }
//     }
//     if (windowSize === 'mobile') {
//       if (accessibilityScore < targetA11yScore) {
//         console.error(`Target accessibility score: ${targetA11yScore}, current accessibility score ${accessibilityScore}`);
//         chrome.kill();
//         process.exitCode = 1;
//       }
//     }
//   }
// }

function createFileName(optionSet, fileType) {
  const { emulatedFormFactor } = optionSet.settings;
  const currentTime = new Date().toISOString().slice(0, 16);
  const fileExtension = fileType === 'json' ? 'json' : 'html';
  return `${currentTime}-${emulatedFormFactor}.${fileExtension}`;
}

// function writeLocalFile(results, runEnvironment, optionSet) {
//   if (results.report) {
//     const fileType = runEnvironment === 'ci' ? 'json' : 'html';
//     const fileName = createFileName(optionSet, fileType);
//     fs.mkdirSync('reports/accessibility/', { recursive: true }, (error) => {
//       if (error) console.error('error creating directory', error);
//     });
//     const printResults = fileType === 'json' ? results.report[1] : results.report[0];
//     return write(printResults, fileType, `reports/accessibility/${fileName}`).catch((error) => console.error(error));
//   }
//   return null;
// }

function printResultsToTerminal(results, optionSet) {
  const { title } = results.categories.performance;
  const score = results.categories.performance.score * 100;
  console.log('\n********************************\n');
  console.log(`Options: ${optionSet.settings.emulatedFormFactor}\n`);
  console.log(`${title}: ${score}`);
  console.log('\n********************************');
}

async function reportResults(results, runEnvironment, optionSet, chrome) {
  if (results.lhr.runtimeError) {
    return console.error(results.lhr.runtimeError.message);
  }
  // await writeLocalFile(results, runEnvironment, optionSet);
  printResultsToTerminal(results.lhr, optionSet);
  // return passOrFailA11y(results.lhr, optionSet, chrome);
}

function launchLighthouse(optionSet, opts, results) {
  return chromeLauncher
    .launch({ chromeFlags: opts.chromeFlags })
    .then(async (chrome) => {
      opts.port = chrome.port;
      try {
        results = await lighthouse(url, opts, optionSet);
      } catch (e) {
        console.error('lighthouse', e);
      }
      if (results) reportResults(results, runEnvironment, optionSet, chrome);
      await wait(500);
      chrome.kill();
    });
}

async function runLighthouseAnalysis() {
  let results;
  const opts = {
    chromeFlags: ['--no-sandbox', '--headless'],
  };
  for (const optionSet of lighthouseOptionsArray) {
    console.log('****** Starting Lighthouse analysis ******');
    await launchLighthouse(optionSet, opts, results);
  }
}

runLighthouseAnalysis();
