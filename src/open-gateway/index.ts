import { createApp } from "./app";
import { getLogger } from "./logger";

const log = getLogger("index");

export const PORT = process.env.PORT || 8080;

createApp()
  .then(app => {
    app.listen(PORT, () => {
      log.info(`graphql running on port ${PORT}`);
    });
  })
  .catch(error => {
    log.error(error);
  });
