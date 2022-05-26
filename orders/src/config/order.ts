export default {
  order: {
    expirationWindowSeconds:
      Number(String(process.env.EXPIRATION_WINDOW_SECONDS)) * 60,
  },
};
