import { francAll } from "franc";
import * as deepl from "deepl-node";
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

const langDetector = (text) => {
  try {
    const res = francAll(text, { only: ["eng", "vie"] });
    const [topLang] = res[0] || [];
    if (topLang === "eng") return "EN";
    if (topLang === "vie") return "VI";
    return "EN";
  } catch (error) {
    console.error("Error detecting language:", error);
    throw error;
  }
};
const deeplClient = new deepl.DeepLClient(process.env.DEEPL_API_KEY);
const tralateText = async (text, currentLang) => {
  let result;
  if (currentLang === "EN") {
    result = await deeplClient.translateText(text, "en", "VI");
  } else {
    result = await deeplClient.translateText(text, "vi", "en-US");
  }
  return result.text;
};
export default {
  getPointPerCurrency,
  calculateTier,
  langDetector,
  tralateText,
};
