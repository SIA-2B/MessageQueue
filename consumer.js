const amqp = require("amqplib");
const moment = require('moment');

const rabbitSettings = {
	protocol: 'amqp',
	hostname: 'localhost',
	port:5672,
	username: 'ndcontrerasr',
	password: "1234",
	vhost: '/',
	authMechanism: ['PLAIN', 'AMQPLAIN','EXTERNAL']
}

connect();

async function connect(){
	
	const queue = 'employees';

	const enterprise = moment().format("DD/MM/YYYY HH:mm A");
	try {
		const conn = await amqp.connect(rabbitSettings);
		console.log('connection created ..');

		const channel = await conn.createChannel();
		console.log('Channel Created..');

		const res = await channel.assertQueue(queue);
		console.log('Queue Created..');
		
		console.log(`Waiting for messages from ${enterprise}`);
		channel.consume(queue, message => {
			let employee = JSON.parse(message.content.toString());
			console.log(`Received employee ${employee.student_id}`);
			console.log(employee);
		})
		
	} catch(err) {
		// statements
		console.error(`Error -> ${err}`);
	}
}