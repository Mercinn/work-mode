document.addEventListener('DOMContentLoaded', () => {
  const websiteInput = document.getElementById('website');
  const addButton = document.getElementById('addButton');
  const blacklist = document.getElementById('blacklist');

  // Add URL to the list UI
  const addToList = (url) => {
    const li = document.createElement('li');
    li.textContent = url;
    blacklist.appendChild(li);
  };

  // Load existing blacklist from storage
  chrome.storage.local.get(['blacklist'], (result) => {
    const sites = result.blacklist || [];
    sites.forEach(site => addToList(site));
  });

  // Add button click event
  addButton.addEventListener('click', () => {
    const url = websiteInput.value.trim();
    if (url) {
      chrome.storage.local.get(['blacklist'], (result) => {
        const updatedList = result.blacklist ? [...result.blacklist, url] : [url];
        chrome.storage.local.set({ blacklist: updatedList }, () => {
          addToList(url);
          websiteInput.value = '';
        });
      });
    }
  });
});
