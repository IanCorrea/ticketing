export default {
  nats: {
    url: process.env.NATS_URL as string,
    clusterId: process.env.NATS_CLUSTER_ID as string,
    clientId: ((process.env.NATS_CLIENT_ID as string) || 'default').replace(
      '.',
      '-',
    ),
  },
};
