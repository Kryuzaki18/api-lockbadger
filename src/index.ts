import { buildApp } from './app';

const start = async () => {
  const app = await buildApp();

  const port = parseInt(app.config.PORT, 10);
  const host = app.config.HOST;

  try {
    await app.listen({ port, host });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
