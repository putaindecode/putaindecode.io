const months = {
  fr: [
    "jan.",
    "fév.",
    "mars",
    "avril",
    "mai",
    "juin",
    "juil.",
    "août",
    "sept.",
    "oct.",
    "nov.",
    "déc.",
  ],
  en: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
};

export default function formatDate(date, lang) {
  const d = new Date(date);

  switch (lang) {
    case "fr":
      return `le ${d.getDate()} ${months.fr[d.getMonth()]} ${d.getFullYear()}`;
    case "en":
    default:
      return `on ${months.en[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  }
}
