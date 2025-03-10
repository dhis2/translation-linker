// Fetch translation data from the JSON file
async function getTranslationData() {
  try {
    const response = await fetch('../data/transifex-meta.json');
    const data = await response.json();
    
    // Keep track of all available languages
    const languages = new Set();
    
    // Transform the data into the format needed for the table view
    const resources = Object.entries(data).map(([id, resource]) => {
      // Track languages from each resource
      Object.keys(resource.stats).forEach(lang => languages.add(lang));
      
      // Get the latest stats across all languages
      const allStats = Object.values(resource.stats);
      const latestStats = allStats.reduce((latest, curr) => {
        return (!latest.last_update || new Date(curr.last_update) > new Date(latest.last_update)) 
          ? curr 
          : latest;
      }, allStats[0]);

      return {
        id: id,
        name: resource.name,
        stats: resource.stats, // Keep all language stats
        strings_count: latestStats.total_strings,
        words_count: latestStats.total_words,
        translated_strings: latestStats.translated_strings,
        translated_words: latestStats.translated_words,
        reviewed_strings: latestStats.reviewed_strings,
        reviewed_words: latestStats.reviewed_words,
        translated_progress: latestStats.translated_strings / latestStats.total_strings,
        reviewed_progress: latestStats.reviewed_strings / latestStats.total_strings,
        last_update: latestStats.last_update
      };
    });

    // Sort resources by name
    resources.sort((a, b) => a.name.localeCompare(b.name));

    // Make the data available globally
    window.translationData = {
      resources: resources,
      languages: Array.from(languages).sort()
    };

    return window.translationData;
  } catch (error) {
    console.error('Error loading translation data:', error);
    return { resources: [], languages: [] };
  }
}

// Initialize the app once the data is loaded
getTranslationData().then(() => {
  // Dispatch an event to notify that data is ready
  const event = new CustomEvent('translationDataLoaded', { 
    detail: window.translationData 
  });
  document.dispatchEvent(event);
});

