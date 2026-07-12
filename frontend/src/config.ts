// Runtime client config, fetched once from the backend at startup.
// Single source of truth lives in backend/.env — nothing to configure here.
export const appConfig = {
  googleClientId: "",
};

export const isGoogleEnabled = () => !!appConfig.googleClientId;
