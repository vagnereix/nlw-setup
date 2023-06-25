import { FastifyInstance } from 'fastify';
import WebPush from 'web-push';
import z from 'zod';

const publicKey =
  'BEmvGYY1LChulz331K2Ftc8AARqIMajYGLkjf9TyeLJeqp9_jSyuQRrr3-GEITAQfOgNnUsKY5Vpy-MQ0RDHCUs';
const privateKey = '9rjvd9u0u7UgEClzUELvaWJlEm7yfG8knDD6Y0iTfj0';

WebPush.setVapidDetails('http://localhost:3333', publicKey, privateKey);

export async function notificationRoutes(app: FastifyInstance) {
  app.get('/push/public_key', () => {
    return {
      publicKey,
    };
  });

  app.post('/push/register', (request, reply) => {
    return reply.status(201).send();
  });

  app.post('/push/send', async (request, reply) => {
    const sendPushBody = z.object({
      subscription: z.object({
        endpoint: z.string(),
        keys: z.object({
          p256dh: z.string(),
          auth: z.string(),
        }),
      }),
    });

    const { subscription } = sendPushBody.parse(request.body);

    WebPush.sendNotification(subscription, 'HELLO FROM BACKEND');

    return reply.status(200).send();
  });
}
