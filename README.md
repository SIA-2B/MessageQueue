Running RabbitMQ Docker Container
`docker run -d --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management`

Running productor:
`npm install`
`npm run start`

Running rabbit:
'docker run -d -p 15672:15672 -p 5672:5672 --name rabbit rabbitmq:3-management'