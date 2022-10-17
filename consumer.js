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

	const enterprise = moment().format("DD/MM/YYYY HH:mm");

	try {
		const conn = await amqp.connect(rabbitSettings);
		console.log('connection created ..');

		const channel = await conn.createChannel();
		console.log('Channel Created..');

		const res = await channel.assertQueue(queue);
		console.log('Queue Created..');
		
		channel.consume(queue, message => {
			let employee = JSON.parse(message.content.toString());
			// console.log(`Received employee ${employee.student_id}`);
			// console.log(employee);
			const inicio = employee.time.split(" ");
			var hora = inicio[1].split(":");

			if(hora[1] == '30'){
				hora[0] = `${parseInt(hora[0])+1}`;
				hora[1] = '00';
			}else {hora[1] = '30'}
			const fin = `${inicio[0]} ${hora[0]}:${hora[1]}`;

			if(employee.time<=enterprise && fin>=enterprise){
				console.log("id: ", employee.student_id, 
						", carrera: ", employee.carrera);
				// channel.ack(message);
			}
			else{
				channel.ack(message);
				// console.log("deleted");
			}
		})
	} catch(err) {
		// statements
		console.error(`Error -> ${err}`);
	}
}