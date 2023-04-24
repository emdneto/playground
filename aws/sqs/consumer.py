import boto3
import json
import os

QUEUE_NAME = os.getenv("QUEUE_NAME", default="test-queue")
BATCH_CONSUMER = 10

sqs = boto3.resource("sqs")
queue = sqs.get_queue_by_name(QueueName=QUEUE_NAME)

def process_msg(msg):
    event = json.loads(msg.body)
    print(f'Received and deleted message: {event}')
    msg.delete()


if __name__ == "__main__":
    while True:
        messages = queue.receive_messages(MaxNumberOfMessages=BATCH_CONSUMER)
        parsed = [process_msg(msg) for msg in messages]
