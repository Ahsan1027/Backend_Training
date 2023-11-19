// import mongoose from 'mongoose';

import moment from 'moment';

import Agenda from '../config';

import { JOB_STATES } from '../utils';

import Orders from '../../models/orders';
import OrderStats from '../../models/order-stats';


Agenda.define('create-order-stats', { concurrency: 1 }, async (job, done) => {
  // const objectIdToUpdate = '65393c48cf4579e302913220';
  // const objectId = mongoose.Types.ObjectId(objectIdToUpdate);
  console.log('*********************************************************');
  console.log('*********  Create Order Stats Job Started   ************');
  console.log('*********************************************************');

  job.attrs.state = JOB_STATES.STARTED;
  job.attrs.progress = 0;
  await job.save();

  const { type } = job.attrs.data;
  console.log('\n\n', { type });

  try {
    job.attrs.state = JOB_STATES.IN_PROGRESS;
    job.attrs.progress = 25;
    await job.save();

    let startDate = moment().subtract(30, 'days').toDate();
    let endDate = moment().toDate();
    const orderStats = await Orders.aggregate([{
      $match: {
        date: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $unwind: '$products'
    },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalQuantity: { $sum: '$products.quantity' },
        totalAmount: { $sum: '$totalAmount' }
      }
    }
    ]);
    // console.log('\n\n', { orderStats });

    job.attrs.lockedAt = null;
    job.attrs.state = JOB_STATES.COMPLETED;
    job.attrs.progress = 100;
    await job.save();

    await OrderStats.updateOne(
      { _id: '65393c48cf4579e302913220' },
      {
        $set: {
          totalOrders: orderStats[0].totalOrders,
          totalQuantity: orderStats[0].totalQuantity,
          totalAmount: orderStats[0].totalAmount,
        }
      },
      { upsert: true, });

    console.log('*********************************************************');
    console.log('********  Create Order Stats Job Completed   ************');
    console.log('*********************************************************');
  } catch (error) {
    console.log('*********************************************************');
    console.log('***********  Create Order Stats Job Retry  **************');
    console.log('*********************************************************');
    console.log(error.message);
    console.log('*********************************************************');

    job.attrs.state = JOB_STATES.FAILED;
    job.attrs.failedAt = new Date();
    job.attrs.failReason = error.message;

    await job.save();
  }

  done();
});
