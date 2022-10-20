const amqp = require("amqplib");

const rabbitSettings = {
	protocol: 'amqp',
	hostname: '34.151.199.132',
	port: 5672,
	username: 'grupo-2b',
	password: "123456789",
	vhost: '/',
	authMechanism: ['PLAIN', 'AMQPLAIN','EXTERNAL']
}

e()

async function e(){
	console.log(await connectP([{"idPersona": "hola camilo"}]));
}
async function connectP(persona){
	console.log('consumir')
	const queue = 'employees';
	let salida = "false";
	try {
		const conn = await amqp.connect(rabbitSettings);
		console.log('connection created ..');

		const channel = await conn.createChannel();
		console.log('Channel Created..');

		const res = await channel.assertQueue(queue);
		console.log('Queue Created..');

		for(var msg in persona) {
			await channel.sendToQueue(queue, Buffer.from(JSON.stringify(persona[msg])));
			console.log(`Message sent to queue ${queue}`);
		}
		
		// await channel.consume(queue, message => {
		// 	let employee = JSON.parse(message.content.toString());
		// 	// console.log(`Received employee ${employee.student_id}`);
		// 	console.log(employee);
		// 	if(employee.idPersona == "7"){
		// 		salida = employee;
		// 		channel.ack(message);
		// 	}
		// })
		return salida;
	} catch(err) {
		// statements
		console.error(`Error -> ${err}`);
	}
	
}