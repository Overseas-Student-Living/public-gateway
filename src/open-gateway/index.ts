import { createApp } from "./app";

export const PORT = 8080;

createApp()
  .then(app => {
    app.listen(PORT, () => {
      console.info(`graphql running on port ${PORT}`);
    });
  })
  .catch(error => {
    console.error(error);
  });
