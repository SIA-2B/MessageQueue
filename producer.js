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

	const student = [
		// {"student_id": "1", "carrera": "SISTEMAS Y COMPUTACION", "time": "15/10/2022 21:30"},
		// {"student_id": "2", "carrera": "SISTEMAS Y COMPUTACION", "time": "15/10/2022 21:30"},
		// {"student_id": "3", "carrera": "SISTEMAS Y COMPUTACION", "time": "15/10/2022 21:30"},
		// {"student_id": "4", "carrera": "SISTEMAS Y COMPUTACION", "time": "15/10/2022 22:00"}
	]

	const enterprise = moment().format("DD/MM/YYYY HH:mm A");
	try {
		const conn = await amqp.connect(rabbitSettings);
		console.log('connection created ..');

		const channel = await conn.createChannel();
		console.log('Channel Created..');

		const res = await channel.assertQueue(queue);
		console.log('Queue Created..');

		for(var msg in student) {
			await channel.sendToQueue(queue, Buffer.from(JSON.stringify(student[msg])));
			console.log(`Message sent to queue ${queue}`);
		}
		
		// console.log(`Waiting for messages from ${enterprise}`);
		// channel.consume(queue, message => {
		// 	ler employee = JSON.parse(message.content.toString());
		// 	console.log(`Received employee ${employee.student_id}`);
		// 	console.log(employee);
		// })
		
	} catch(err) {
		// statements
		console.error(`Error -> ${err}`);
	}
}