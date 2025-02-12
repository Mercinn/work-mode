document.addEventListener('DOMContentLoaded', () => {
  const toggleButton = document.getElementById('toggleButton');
  const status = document.getElementById('status');
  const websiteInput = document.getElementById('website');
  const addButton = document.getElementById('addButton');
  const blacklist = document.getElementById('blacklist');
  const toggleTab = document.getElementById('toggleTab');
  const optionsTab = document.getElementById('optionsTab');
  const homeContent = document.getElementById('homeContent');
  const optionsContent = document.getElementById('optionsContent');

  // Function to update the button and status text
  const updateUI = (isActive) => {
    toggleButton.textContent = isActive ? 'Deactivate' : 'Activate';
    status.textContent = isActive ? 'Active' : 'Inactive';
  };

  // Initialize the UI based on current state
  const initializeUI = () => {
    chrome.storage.local.get(['isActive', 'blacklist'], (result) => {
      updateUI(result.isActive);
      const sites = result.blacklist || [];
      blacklist.innerHTML = ''; // Clear existing list
      sites.forEach(site => addToList(site));
    });
  };

  // Call initializeUI when popup loads
  initializeUI();

  // Toggle button click event
  toggleButton.addEventListener('click', () => {
    chrome.storage.local.get(['isActive'], (result) => {
      const newStatus = !result.isActive;
      chrome.storage.local.set({ isActive: newStatus }, () => {
        updateUI(newStatus);
      });
    });
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

  // Remove button click event
  blacklist.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-btn')) {
      const url = e.target.parentElement.firstChild.textContent;
      chrome.storage.local.get(['blacklist'], (result) => {
        const updatedList = result.blacklist.filter(site => site !== url);
        chrome.storage.local.set({ blacklist: updatedList }, () => {
          e.target.parentElement.remove();
        });
      });
    }
  });

  // Add URL to the list UI
  const addToList = (url) => {
    const li = document.createElement('li');
    li.textContent = url;
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Remove';
    removeButton.classList.add('remove-btn');
    li.appendChild(removeButton);
    blacklist.appendChild(li);
  };

  // Tab switching logic
  toggleTab.addEventListener('click', () => {
    homeContent.classList.add('active');
    optionsContent.classList.remove('active');
    toggleTab.classList.add('active');
    optionsTab.classList.remove('active');
  });

  optionsTab.addEventListener('click', () => {
    homeContent.classList.remove('active');
    optionsContent.classList.add('active');
    toggleTab.classList.remove('active');
    optionsTab.classList.add('active');
  });

  // Initialize with the Home tab active
  homeContent.classList.add('active');
  toggleTab.classList.add('active');
});
