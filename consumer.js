const amqp = require("amqplib");
const fs = require('fs'); 
// const jsonData = require('./student.json');

const rabbitSettings = {
	protocol: 'amqp',
	hostname: '172.17.0.2',
	port:5672,
	username: 'ndcontrerasr',
	password: "1234",
	vhost: '/',
	authMechanism: ['PLAIN', 'AMQPLAIN','EXTERNAL']
}

// const rabbitSettings = {
// 	protocol: 'amqp',
// 	hostname: '34.151.199.132',
// 	port: 5672,
// 	username: 'grupo-2b',
// 	password: "123456789",
// 	vhost: '/',
// 	authMechanism: ['PLAIN', 'AMQPLAIN','EXTERNAL']
// }

console.log(connectC());

async function connectC(){
	
	const queue = 'employees';
	// console.log(jsonData.volver)
	// const Save = {"volver":"hola mundo"};
	// fs.writeFile('student.json', JSON.stringify(Save),'utf8', (err) => { 
	// 	if (err) throw err; 
	// 	console.log('The file has been saved!'); 
	// }); 
	// return 1;

	try {
		const conn = await amqp.connect(rabbitSettings);
		console.log('connection created ..');

		const channel = await conn.createChannel();
		console.log('Channel Created..');

		const res = await channel.assertQueue(queue);
		console.log('Queue Created..');
		
		await channel.consume(queue, message => {
			let employee = JSON.parse(message.content.toString());
			// console.log(`Received employee ${employee.student_id}`);
			console.log(employee);
			const id = employee.idPersona;
			
			//Se revisa en la base de datos si el dato existe o no
			// En esta parte se definira true
			// El tipo de dato que se envia es 
			// El dato id debe ser String
			connectP([{'idPersona': id, 'volver': true}]);
			channel.ack(message);
		})
	} catch(err) {
		// statements
		console.error(`Error -> ${err}`);
	}
}

async function connectP(persona){
	
	const queue = 'direct';

	try {
		const conn = await amqp.connect(rabbitSettings);
		console.log('connection created ..');

		const channel = await conn.createChannel();
		console.log('Channel Created..');

		const res = await channel.assertQueue(queue);
		console.log('Queue Created..');

		console.log(persona);
		for(var msg in persona) {
			await channel.sendToQueue(queue, Buffer.from(JSON.stringify(persona[msg])));
			console.log(`Message sent to queue ${queue}`);
		}
		
	} catch(err) {
		// statements
		console.error(`Error -> ${err}`);
	}
}