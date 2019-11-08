const express = require('express')
const Router = require('express-promise-router')
const bodyParser = require('body-parser')
const kafka = require('kafka-node')

const kafkaClientOptions = {
    sessionTimeout: 100,
    spinDelay: 100,
    retries: 2
}

const kafkaClient = kafka.Client(process.env.KAFKA_ZOOKEEPER_CONNECT, 'producer-client', kafkaClientOptions)
kafkaClient.on('error', (error) => console.error('Kafka client error:', error))

console.log('kafka client', kafkaClient)

const kafkaProducer = new kafka.HighLevelProducer(kafkaClient)
kafkaProducer.on('error', (error) => console.error('Kafka producer error', error))

console.log('kafkaProducer', kafkaProducer)

const app = express()
const router = new Router()

app.use('/', router)
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

router.post('/sales', (req, res) => {
    console.log('inside sales request')

    const payload = [{
        topic: 'topic-1',
        messages: "hello",
        attributes: 1
    }]

    kafkaProducer.send(payload, (err, result) => {
        console.log('inside callback')
    })
})

app.listen(8045)
