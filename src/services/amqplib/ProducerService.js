const amqp = require("amqplib");

const ProducerService = {
	sentMessage: async (queue, message) => {
		const connect = await amqp.connect(process.env.RABBITMQ_SERVER);
		const channel = await connect.createChannel();

		await channel.assertQueue(queue, { durable: false });
		await channel.sendToQueue(queue, Buffer.from(message));

		setTimeout(() => {
			connect.close();
		}, 500);
	},
};

module.exports = ProducerService;
