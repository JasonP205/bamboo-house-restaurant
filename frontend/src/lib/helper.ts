export const getEmbedMapLink = (coords: string, zoom = 17) => {
  const [lat, lng] = coords.split(",").map((c) => c.trim());
  return `https://www.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed&maptype=satellite`;
};
const toRad = (value: number) => (value * Math.PI) / 180;

export const getDistance = (targetCoord: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLat = pos.coords.latitude;
        const userLng = pos.coords.longitude;

        const [latStr, lngStr] = targetCoord.split(",");
        const targetLat = parseFloat(latStr.trim());
        const targetLng = parseFloat(lngStr.trim());

        const R = 6371;

        const dLat = toRad(targetLat - userLat);
        const dLng = toRad(targetLng - userLng);

        const a =
          Math.sin(dLat / 2) ** 2 +
          Math.cos(toRad(userLat)) *
            Math.cos(toRad(targetLat)) *
            Math.sin(dLng / 2) ** 2;

        const c = 2 * Math.asin(Math.sqrt(a));
        const distance = R * c;

        resolve(Number(distance.toFixed(2)));
      },
      (err) => reject(err)
    );
  });
};