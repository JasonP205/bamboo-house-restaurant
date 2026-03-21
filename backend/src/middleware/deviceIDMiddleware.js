export const deviceIDMiddleware = (req, res, next) => {
  const deviceID = req.headers['X-Device-ID'] || req.headers['x-device-id'];
  if (!deviceID) {
    return res.status(403).json({ success: false, message: 'Missing device ID' });
  }
  req.deviceId = deviceID;
  next();
};