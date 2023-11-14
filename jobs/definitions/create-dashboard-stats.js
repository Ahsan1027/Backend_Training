import moment from 'moment';

import Agenda from '../config';

import { JOB_STATES } from '../utils';

import Orders from '../../models/orders';
import Product from '../../models/products';
import DashboardStats from '../../models/dashboard-stats';

Agenda.define('create-dashboard-stats', { concurrency: 1 }, async (job, done) => {
  console.log('*********************************************************');
  console.log('*********  Create Dashboard Stats Job Started   *********');
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

    const currentYear = moment().year();
    const totalOrders = Array(12).fill(0);
    const totalAmount = Array(12).fill(0);

    for (let i = 0; i < 12; i++) {
      const startOfMonth = moment().year(currentYear).month(i).startOf('month');
      const endOfMonth = startOfMonth.clone().endOf('month');
      const result = await Orders.aggregate([
        {
          $match: {
            date: {
              $gte: startOfMonth.toDate(),
              $lte: endOfMonth.toDate(),
            },
          },
        },
        {
          $group: {
            _id: null,
            totalOrderCount: { $sum: 1 },
            totalAmountValue: { $sum: '$totalAmount' },
          },
        },
      ]);

      if (result.length > 0) {
        totalOrders[i] = result[0].totalOrderCount;
        totalAmount[i] = result[0].totalAmountValue;
      }
    }

    const orders = await Orders.find();
    const orderSold = orders.filter(order => order.deliveredStatus === true);
    const ordersUnsold = orders.filter(order => order.deliveredStatus === false);
    const totalSold = orderSold.length;
    const totalUnsold = ordersUnsold.length;

    const topSellingProducts = await Product.find()
      .sort({ sold: -1 })
      .limit(6);

    let startDate = moment().startOf('day').toDate();
    let endDate = moment().endOf('day').toDate();
    const todayStats = await Orders.aggregate([{
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
    // console.log('\n\n', { todayStats });

    job.attrs.progress = 50;
    await job.save();

    startDate = moment().subtract(7, 'days').toDate();
    endDate = moment().toDate();
    const sevenDayStats = await Orders.aggregate([{
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
    },

    ]);
    // console.log('\n\n', { sevenDayStats });

    job.attrs.progress = 75;
    await job.save();

    startDate = moment().subtract(30, 'days').toDate();
    endDate = moment().toDate();
    const thirtyDayStats = await Orders.aggregate([{
      $match: {
        date: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $unwind: '$products'
    }, {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalQuantity: { $sum: '$products.quantity' },
        totalAmount: { $sum: '$totalAmount' }
      }
    },
    ]);
    // console.log('\n\n', { thirtyDayStats });

    job.attrs.lockedAt = null;
    job.attrs.state = JOB_STATES.COMPLETED;
    job.attrs.progress = 100;
    await job.save();

    const stat = new DashboardStats({
      todayStats: todayStats[0],
      sevenDayStats: sevenDayStats[0],
      thirtyDayStats: thirtyDayStats[0],
      totalOrders,
      totalAmount,
      topSellingProducts,
      totalSold,
      totalUnsold
    });
    // console.log('data is,,, ', stat);
    const previousStats = await DashboardStats.findOne({});
    if (previousStats) {
      const { _id } = previousStats;
      await DashboardStats.updateOne({
        _id
      }, {
        $set: {
          todayStats: todayStats[0],
          sevenDayStats: sevenDayStats[0],
          thirtyDayStats: thirtyDayStats[0],
          totalOrders,
          totalAmount,
          topSellingProducts,
          totalSold,
          totalUnsold
        }
      })
    } else {
      await stat.save();
    }

    console.log('*********************************************************');
    console.log('********  Create Dashboard Stats Job Completed   ********');
    console.log('*********************************************************');
  } catch (error) {
    console.log('*********************************************************');
    console.log('***********  Create Dashboard Stats Job Retry  **********');
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