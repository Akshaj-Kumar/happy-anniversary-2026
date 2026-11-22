// Global configuration for the Anniversary Experience
export const config = {
  // Password Configuration
  // Change the password below to any 4-digit code (e.g. "2211" for 22nd November)
  password: "2211",
  passwordLength: 4,
  passwordHint: "The day our forever began (Hint: 2211) ❤️",

  // Couple Information
  couple: {
    partner1: "Aarav",
    partner2: "Maya",
    nickname: "My Love",
    title: "Happy Anniversary, My Love ❤️",
    subtitle: "Every moment with you is a little piece of forever.",
  },

  // Anniversary Date details (scrapbook calendar)
  anniversaryDate: {
    day: 22,
    month: "November",
    year: 2022,
    monthIndex: 10, // 0-indexed (November = 10)
    formattedDate: "November 22, 2022",
    yearsCelebrated: 4,
    dayOfWeek: "Tuesday",
    specialMessage: "November 22, 2022 — The exact moment you held my hand and whispered forever. The best decision I ever made.",
    photo: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1200&q=80",
  },

  // Sound settings
  audio: {
    title: "Can't Help Falling in Love (Acoustic Serenade)",
    autoplayInteractionRequired: true,
  }
};

export default config;
