let translationDataReady = new Promise((resolve) => {
  fetch('../data/transifex-meta.json')
    .then(response => response.json())
    .then(data => {
      window.translationData = data;
      resolve(data);
      initializeApp();
    });
});

// Export the promise so other scripts can wait for the data
window.getTranslationData = () => translationDataReady;

