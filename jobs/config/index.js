import Agenda from 'agenda';

// const { MONGO_URL } = process.env;

const AgendaJobs = new Agenda({
  db: {
    address: 'mongodb://localhost/signup-api',
    collection: 'agendaJobs'
  },
  defaultConcurrency: 2,
  maxConcurrency: 100,
  defaultLockLifetime: 20 * 60000
});

export default AgendaJobs;
