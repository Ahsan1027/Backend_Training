import express from 'express';

import ScriptMethods from '../script-methods';

const Router = express.Router();

Router.get('/script', async (req, res) => {
  try {
    const { query } = req;
    const {
      method,
      ...rest
    } = query;

    await ScriptMethods({
      method,
      ...rest
    });

    res.send('OK');
  } catch (error) {
    res.send(error.message);
  }
});

export default Router;