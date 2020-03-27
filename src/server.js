import app from './app';

app.listen(process.env.APP_PORT, () => {
  console.log(`Rodando na porta ${process.env.APP_PORT}`);
});
