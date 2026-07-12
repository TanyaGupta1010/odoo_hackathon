import app from "./app";
import { env } from "./config/env";

app.listen(env.PORT, () => {
  console.log(`🚀 AssetFlow Server running on port ${env.PORT}`);
});