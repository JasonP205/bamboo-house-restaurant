const getPointPerCurrency = (tiers) => {
  switch (tiers) {
    case "Sprout":
      return 0.2;
    case "Shoot":
      return 0.4;
    case "Stem":
      return 0.6;
    case "Grove":
      return 0.8;
    case "Legend":
      return 1;
    default:
      return 0.2;
  }
};
const calculateTier = (points) => {
  if (points < 300) return "Sprout";
  if (points < 1200) return "Shoot";
  if (points < 3000) return "Stem";
  if (points < 8000) return "Grove";
  return "Legend";
};

export default {
    getPointPerCurrency,
    calculateTier
}
