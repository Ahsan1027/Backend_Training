import express from 'express';
import cors from 'cors';

const ApplyMiddlewares = (app) => {
  app.use(cors());
  app.use(express.json());

  app.use((req, res, next) => {
    next();
  });

  app.use((req, res, next) => {
    next();
  });
};

export default ApplyMiddlewares;
