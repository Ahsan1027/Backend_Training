import mongoose from 'mongoose';

const dashboardStatSchema = mongoose.Schema(
  {
    todayStats: {
      type: Object
    },
    sevenDayStats: {
      type: Object
    },
    thirtyDayStats: {
      type: Object
    },
    totalSold: {
      type: Number,
    },
    totalUnsold: {
      type: Number,
    },
    totalOrders: {
      type: Array,
    },
    totalAmount: {
      type: Array,
    },
    topSellingProducts: {
      type: Array,
    },
  },
  {
    timestamps: true
  }
);

const DashboardStats = mongoose.model('DashboardStats', dashboardStatSchema);
export default DashboardStats;