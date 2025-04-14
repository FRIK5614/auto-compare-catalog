
// Site settings with default values
export const siteSettings = {
  siteName: "AutoDeal",
  phoneNumber: "+7 (800) 555-35-35",
  email: "info@autodeal.ru",
  address: "г. Москва, ул. Автомобильная, 10",
  workingHours: "Пн-Пт: 9:00-20:00, Сб-Вс: 10:00-18:00",
  socialLinks: {
    telegram: "https://t.me/autodeal",
    vk: "https://vk.com/autodeal",
    whatsapp: "https://wa.me/78005553535"
  }
};

// Function to update site settings
export const updateSiteSettings = (newSettings: Partial<typeof siteSettings>) => {
  // Save to localStorage for persistence
  const updatedSettings = { ...siteSettings, ...newSettings };
  localStorage.setItem('site-settings', JSON.stringify(updatedSettings));
  
  // Update the current settings object
  Object.assign(siteSettings, newSettings);
  
  return updatedSettings;
};

// Load settings from localStorage on init
try {
  const savedSettings = localStorage.getItem('site-settings');
  if (savedSettings) {
    const parsedSettings = JSON.parse(savedSettings);
    Object.assign(siteSettings, parsedSettings);
  }
} catch (error) {
  console.error('Failed to load site settings from localStorage:', error);
}
