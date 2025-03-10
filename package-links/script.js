// Language names mapping
const languageNames = {
  en: "English",
  fr: "French",
  es: "Spanish",
  ar: "Arabic",
  de: "German",
  it: "Italian",
  pt: "Portuguese",
  ru: "Russian",
  zh: "Chinese",
  
  // Add more languages as needed
}


// Initialize the application
function initializeApp() {
  // Wait for translation data to be available before initializing
  window.getTranslationData().then(() => {
    const languageSelector = document.getElementById("language-selector")
    const resourcesContainer = document.getElementById("resources-container")

    // Get all available languages from the data
    const availableLanguages = new Set()

    Object.values(window.translationData).forEach((resource) => {
      Object.keys(resource.stats).forEach((lang) => {
        availableLanguages.add(lang)
      })
    })

    // Populate language selector
    availableLanguages.forEach((lang) => {
      const option = document.createElement("option")
      option.value = lang
      option.textContent = languageNames[lang] || lang
      languageSelector.appendChild(option)
    })

    // Set default language (English if available)
    if (availableLanguages.has("en")) {
      languageSelector.value = "en"
      renderResources("en")
    } else {
      // Otherwise use the first available language
      const firstLang = Array.from(availableLanguages)[0]
      languageSelector.value = firstLang
      renderResources(firstLang)
    }

    // Add event listener for language change
    languageSelector.addEventListener("change", (event) => {
      renderResources(event.target.value)
    })
  });
}

// Render resources for the selected language
function renderResources(language) {
  const resourcesContainer = document.getElementById("resources-container")
  resourcesContainer.innerHTML = "" // Clear previous content

  Object.entries(window.translationData).forEach(([id, resource]) => {
    // Skip resources that don't have stats for the selected language
    if (!resource.stats[language]) {
      return
    }

    const resourceCard = createResourceCard(id, resource, language)
    resourcesContainer.appendChild(resourceCard)
  })
}

// Create a resource card
function createResourceCard(id, resource, language) {
  const stats = resource.stats[language]
  const template = document.getElementById("resource-card-template")
  const card = document.importNode(template.content, true).firstElementChild

  // Set resource name and ID
  card.querySelector(".resource-name").textContent = resource.name.replace(/_/g, " ")
  card.querySelector(".resource-id").textContent = `(${id})`

  // Calculate percentages for progress bars
  const translatedPercent = Math.round((stats.translated_words / stats.total_words) * 100) || 0
  const reviewedPercent = Math.round((stats.reviewed_words / stats.total_words) * 100) || 0
  const proofreadPercent = Math.round((stats.proofread_words / stats.total_words) * 100) || 0
  const translatedStringsPercent = Math.round((stats.translated_strings / stats.total_strings) * 100) || 0

  // Set progress bars and percentages
  // Translated words
  card.querySelector(".translated-percent").textContent = `${translatedPercent}%`
  card.querySelector(".translated-progress").style.width = `${translatedPercent}%`
  card.querySelector(".translated-details").textContent = `${stats.translated_words} / ${stats.total_words} words`

  // Reviewed words
  card.querySelector(".reviewed-percent").textContent = `${reviewedPercent}%`
  card.querySelector(".reviewed-progress").style.width = `${reviewedPercent}%`
  card.querySelector(".reviewed-details").textContent = `${stats.reviewed_words} / ${stats.total_words} words`

  // Proofread words
  card.querySelector(".proofread-percent").textContent = `${proofreadPercent}%`
  card.querySelector(".proofread-progress").style.width = `${proofreadPercent}%`
  card.querySelector(".proofread-details").textContent = `${stats.proofread_words} / ${stats.total_words} words`

  // Translated strings
  card.querySelector(".translated-strings-percent").textContent = `${translatedStringsPercent}%`
  card.querySelector(".translated-strings-progress").style.width = `${translatedStringsPercent}%`
  card.querySelector(".translated-strings-details").textContent =
    `${stats.translated_strings} / ${stats.total_strings} strings`

  // Set last update dates
  card.querySelector(".translation-update").textContent = formatDate(stats.last_translation_update)
  card.querySelector(".review-update").textContent = formatDate(stats.last_review_update)
  card.querySelector(".proofread-update").textContent = formatDate(stats.last_proofread_update)
  card.querySelector(".last-update").textContent = formatDate(stats.last_update)

  return card
}

// Update the date formatting function
function formatDate(dateString) {
  if (!dateString) return "No date";
  
  try {
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "Invalid date";
    }

    // Format as "YYYY-MM-DD"
    return date.toISOString().split('T')[0];
  } catch (e) {
    return "Invalid date";
  }
}

// Update the DOM loaded event listener to remove direct initializeApp call
// since it's now called from data.js after the fetch
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById('resources-container');
  const resourceTemplate = document.getElementById('resource-row-template');
  const languageCellTemplate = document.getElementById('language-cell-template');
  
  // Format number with percentage
  function formatPercent(number) {
    // Convert to percentage and round to 2 decimal places
    const percentage = (number * 100);
    
    // If it's a whole number, don't show decimals
    if (percentage % 1 === 0) {
      return `${Math.round(percentage)}%`;
    }
    
    // If it has decimals, show up to 2 decimal places, removing trailing zeros
    return `${percentage.toFixed(2).replace(/\.?0+$/, '')}%`;
  }

  function initializeTable(data) {
    // Add language columns to header
    const headerRow = document.querySelector('.resources-table thead tr');
    data.languages.forEach(lang => {
      const th = document.createElement('th');
      th.textContent = lang;
      headerRow.appendChild(th);
    });

    // Create rows for each resource
    data.resources.forEach(resource => {
      const row = resourceTemplate.content.cloneNode(true);
      
      // Set resource info
      row.querySelector('.resource-name').textContent = resource.name;
      row.querySelector('.string-count').textContent = `${resource.strings_count} strings`;
      row.querySelector('.word-count').textContent = `${resource.words_count} words`;

      // Add language cells
      const rowElement = row.querySelector('.resource-row');
      data.languages.forEach(lang => {
        const stats = resource.stats[lang];
        if (stats) {
          const cell = languageCellTemplate.content.cloneNode(true);
          
          const translatedPercent = stats.translated_strings / stats.total_strings;
          const reviewedPercent = stats.reviewed_strings / stats.total_strings;
          
          // Set percentages and progress bars
          const reviewedPercentEl = cell.querySelector('.reviewed-percent');
          const translatedPercentEl = cell.querySelector('.translated-percent');
          
          reviewedPercentEl.textContent = formatPercent(reviewedPercent);
          translatedPercentEl.textContent = formatPercent(translatedPercent);
          
          // Add tooltips with detailed counts
          reviewedPercentEl.title = `Reviewed: ${stats.reviewed_strings} of ${stats.total_strings} strings`;
          translatedPercentEl.title = `Translated: ${stats.translated_strings} of ${stats.total_strings} strings`;
          
          // Set progress bars
          cell.querySelector('.reviewed-progress').style.width = formatPercent(reviewedPercent);
          cell.querySelector('.translated-progress').style.width = formatPercent(translatedPercent);
          
          // Set last update with tooltip
          const lastUpdateEl = cell.querySelector('.last-update');
          lastUpdateEl.textContent = formatDate(stats.last_update);
          lastUpdateEl.title = `Last updated: ${new Date(stats.last_update).toLocaleString()}`;
          
          // Set translate link
          const translateLink = cell.querySelector('.translate-link');
          translateLink.href = `https://app.transifex.com/hisp-uio/meta_health/translate/#${lang}/${resource.id}`;
          
          rowElement.appendChild(cell);
        } else {
          // Add empty cell if no stats for this language
          const td = document.createElement('td');
          td.className = 'language-cell';
          td.textContent = 'No data';
          rowElement.appendChild(td);
        }
      });

      container.appendChild(row);
    });
  }

  // Initialize table when data is loaded
  document.addEventListener('translationDataLoaded', (event) => {
    initializeTable(event.detail);
  });
});

