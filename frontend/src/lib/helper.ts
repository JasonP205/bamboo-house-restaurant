export const getEmbedMapLink = (coords: string, zoom = 17) => {
  const [lat, lng] = coords.split(",").map((c) => c.trim());
  return `https://www.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed&maptype=satellite`;
};