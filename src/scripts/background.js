import { getBrowser, getFeedbackFormLink } from './libs/utils';

chrome.runtime.onInstalled.addListener(function (details) {
  if (details.reason !== 'install' && details.reason !== 'update') return;

  if (chrome.runtime.setUninstallURL) {
    chrome.runtime.setUninstallURL(getFeedbackFormLink());
  }

  if (details.reason === 'install' && getBrowser() === 'Firefox') {
    chrome.runtime.openOptionsPage();
  }
});

// chrome.action is Manifest V3, chrome.browserAction is Manifest V2.
const action = chrome.action || chrome.browserAction;

if (action) {
  action.onClicked.addListener(function () {
    chrome.runtime.openOptionsPage();
  });
}
