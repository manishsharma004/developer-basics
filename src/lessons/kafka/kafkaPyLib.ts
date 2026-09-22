/** Standard library loaded into Pyodide before user Kafka snippets run. */
export const KAFKA_PYTHON_LIB = String.raw`
from kafka_bridge import produce as _produce, consume as _consume, list as _list, reset as _reset

DEFAULT_TOPIC = "devbasics.lab.events"

class ConsumerRecord:
    def __init__(self, topic, partition, offset, key, value):
        self.topic = topic
        self.partition = partition
        self.offset = offset
        self.key = key
        self.value = value

    def __repr__(self):
        return f"ConsumerRecord(p={self.partition}, offset={self.offset}, key={self.key!r}, value={self.value!r})"


class KafkaProducer:
    """kafka-python style producer (in-browser lab)."""

    def __init__(self, bootstrap_servers=None, client_id="browser-producer"):
        self.client_id = client_id

    def send(self, topic, value=None, key=None):
        if value is None:
            raise ValueError("value is required")
        if isinstance(value, bytes):
            value = value.decode("utf-8")
        if key is not None and isinstance(key, bytes):
            key = key.decode("utf-8")
        meta = _produce(topic, str(value), key)
        return ConsumerRecord(topic, meta["partition"], meta["offset"], meta["key"], meta["value"])

    def flush(self):
        pass


class KafkaConsumer:
    """kafka-python style consumer (in-browser lab)."""

    def __init__(self, topic, group_id, bootstrap_servers=None, auto_offset_reset="earliest"):
        self.topic = topic
        self.group_id = group_id

    def poll(self, timeout_ms=1000, max_records=10):
        raw = _consume(self.group_id, self.topic, max_records)
        out = []
        for r in raw:
            out.append(ConsumerRecord(self.topic, r["partition"], r["offset"], r["key"], r["value"]))
        return out

    def commit(self):
        pass


def reset_lab():
    _reset()

import types, sys
_mod = types.ModuleType("kafka_mini")
_mod.KafkaProducer = KafkaProducer
_mod.KafkaConsumer = KafkaConsumer
_mod.ConsumerRecord = ConsumerRecord
_mod.DEFAULT_TOPIC = DEFAULT_TOPIC
_mod.reset_lab = reset_lab
sys.modules["kafka_mini"] = _mod
`
