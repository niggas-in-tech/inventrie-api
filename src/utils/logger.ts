import pinoHttp from 'pino-http';
import pino from 'pino';
import * as dayjs from 'dayjs';

const streams = [
  { stream: process.stdout },
  // { stream: pinoLogger.destination(`${__dirname}/combined.log`) },
];

const transport = {
  target: 'pino-pretty',
  options: {
    colorize: true,
    singleLine: true,
    ignore: 'pid,hostname',
  },
};

const logger = pino({
  transport,
  timestamp: () => `,"time":"${dayjs().format()}"`,
});

const loggerMiddleware = pinoHttp(
  {
    transport,
    base: { pid: false },
    timestamp: () => `,"time":"${dayjs().format()}"`,
    serializers: {
      req(req) {
        const { method, url, query, params } = req;
        return { request: `${method}:${url}`, query, params };
      },
      res(res) {
        const { statusCode } = res;
        return { statusCode };
      },
    },
  },
  pino.multistream(streams),
);

export { logger, loggerMiddleware };
