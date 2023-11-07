import Agenda from '../jobs/config';

const ScriptMethods = async ({
  method,
  ...rest
}) => {
  console.log('\n\n', 'method', method);
  console.log('\n\n', { rest });

  switch (method) {
    case 'StartDashboardJob': {
      Agenda.create('create-dashboard-stats', {
        type: 'DashboardJob'
      }).unique({
        'data.type': 'DashboardJob'
      })
        .repeatEvery('2 minutes')
        .schedule('in 5 seconds')
        .save();

      console.log('\n\n', 'Dashboard Job Has Been Started');

      break;
    }

    case 'StartOrderStatsJob': {
      Agenda.create('create-order-stats', {
        type: 'OrderJob'
      })
        .unique({
          'data.type': 'OrderJob'
        })
        .repeatEvery('1 minutes')
        .schedule('in 2 seconds')
        .save();

      console.log('\n\n', 'Order Stats Job Has Been Started');
      break;
    }
  }
};

export default ScriptMethods;