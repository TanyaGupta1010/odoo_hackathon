import { useGoogleLogin } from "@react-oauth/google";

import GoogleButton from "./GoogleButton";

type Props = {
  onToken: (accessToken: string) => void;
  onError: (message: string) => void;
  disabled?: boolean;
};

/** Wraps the presentational button with the real Google OAuth flow.
 *  Only render this inside a <GoogleOAuthProvider>. */
const GoogleLoginButton = ({ onToken, onError, disabled }: Props) => {
  const login = useGoogleLogin({
    onSuccess: (res) => onToken(res.access_token),
    onError: () => onError("Google sign-in failed. Please try again."),
  });

  return <GoogleButton onClick={() => login()} disabled={disabled} />;
};

export default GoogleLoginButton;
