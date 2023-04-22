// import { check } from 'k6';
// import { Writer, produce, Connection } from 'k6/x/kafka';

// const brokers = ['broker1:9091', 'broker2:9091', 'broker3:9091'];
// const kafkaTopic = 'xk6_events';

// const producer = Writer({
//   brokers: brokers, 
//   topic: kafkaTopic,
//   autoCreateTopic: true
// });

// const connection = new Connection({
//     address: brokers[0],
//   });

// if (__VU == 0) {
//   connection.createTopic({
//     topic: kafkaTopic,
//     numPartitions: 32,
//     replicationFactor: 3
//   });
// }



// export default function () {
//     const messages = [
//       {
//         key: JSON.stringify({
//           correlationId: 'transaction-' + getRandomInt(),
//         }),
//         value: JSON.stringify({
//         }),
//       }
//     ];
  
//     const error = producer.produce({messages: messages});
//     check(error, {
//       'is sent': (err) => err == undefined,
//     });
//   }

// export function teardown(data) {
//     producer.close();
//     //consumer.close();
// }

// // import http from 'k6/http';
// // import { check, sleep } from 'k6';

// // export const options = {
// //   stages: [
// //     { duration: '30s', target: 20 },
// //     { duration: '1m30s', target: 10 },
// //     { duration: '20s', target: 0 },
// //   ],
// // };

// // export default function () {
// //   const res = http.get('https://httpbin.test.k6.io/');
// //   check(res, { 'status was 200': (r) => r.status == 200 });
// //   sleep(1);
// // }

import { check } from "k6";
import { uuidv4 , randomString, randomIntBetween} from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
// import * as kafka from "k6/x/kafka";
import {
  Writer,
  Reader,
  Connection,
  SchemaRegistry,
  CODEC_SNAPPY,
  SCHEMA_TYPE_JSON,
} from "k6/x/kafka"; // import kafka extension

// Prints module-level constants
// console.log(kafka);

const brokers = ['broker1:9091', 'broker2:9091', 'broker3:9091'];
const topic = "K6_EVENTS";
const topic_rf = 3
const topic_parts = 32
const groupID = "k6";

const writer = new Writer({
  brokers: brokers,
  topic: topic,
  compression: CODEC_SNAPPY,
});
const reader = new Reader({
  brokers: brokers,
  groupID: groupID,
  groupTopics: [topic],
});
const connection = new Connection({
  address: brokers[0],
});

const schemaRegistry = new SchemaRegistry();

// if (__VU == 0) {
//   connection.createTopic({
//     topic: topic,
//     numPartitions: 32,
//     replicationFactor: 3,
//   });
// }

export const options = {
  scenarios: {
    transactions: {
      executor: 'ramping-vus',
      startVUs: 10,
      stages: [
        { duration: '30s', target: 10 },
        { duration: '30s', target: 0 },
      ],
      gracefulRampDown: '30s',
    },
  },
  thresholds: {
    // Base thresholds to see if the writer or reader is working
    kafka_writer_error_count: ["count == 0"],
    kafka_reader_error_count: ["count == 0"],
  },
};

function getRandomInt(max = 100000) {
  return Math.floor(Math.random() * max + 1);
}


export default function () {
  let messages = [];
  let randomPart = randomIntBetween(0, topic_parts)
  messages.push({
    // The data type of the key is JSON
    key: schemaRegistry.serialize({
      data: {
        key: uuidv4(),
      },
      schemaType: SCHEMA_TYPE_JSON,
    }),
    // The data type of the value is JSON
    value: schemaRegistry.serialize({
      data: {
        transactionId: uuidv4(),
        title: 'Load Testing with k6',
        account_number: 7766243583,
        balance: 892788.23,
        account_type: "savings",
        routing_number: 878599650,
        account_holder_name: "Anallese Chennells",
        address: "0 Duke Alley",
        phone_number: "979-114-7944",
        email: "achennells0@sakura.ne.jp",
        transaction_amount: 293151.99,
        transaction_type: "deposit",
        transaction_date: "2/28/2023",
        transaction_status: "failed",
        transaction_description: "vel accumsan tellus nisi eu orci mauris lacinia sapien quis libero nullam sit amet turpis elementum ligula vehicula consequat",
        partition: randomPart
      },
      schemaType: SCHEMA_TYPE_JSON,
    }),
    partition: randomPart,
  });

  writer.produce({ messages: messages });

  // Read one message only
  // messages = reader.consume({ limit: 10 });

  // check(messages, {
  //   "10 messages is received": (messages) => messages.length == 10,
  // });

  // check(messages[0], {
  //   "Topic equals to xk6_kafka_consumer_group_topic": (msg) =>
  //     msg["topic"] == topic,
  //   "Key contains key/value and is JSON": (msg) =>
  //     schemaRegistry.deserialize({
  //       data: msg.key,
  //       schemaType: SCHEMA_TYPE_JSON,
  //     }).key == "value",
  //   "Value contains key/value and is JSON": (msg) =>
  //     typeof schemaRegistry.deserialize({
  //       data: msg.value,
  //       schemaType: SCHEMA_TYPE_JSON,
  //     }) == "object" &&
  //     schemaRegistry.deserialize({
  //       data: msg.value,
  //       schemaType: SCHEMA_TYPE_JSON,
  //     }).key == "value",
  // });
}

export function teardown(data) {
  // if (__VU == 0) {
  //   // Delete the topic
  //   connection.deleteTopic(topic);
  // }
  writer.close();
  reader.close();
  connection.close();
}