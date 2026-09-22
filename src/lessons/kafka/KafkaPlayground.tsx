import { KafkaCodeLab } from './KafkaCodeLab.tsx'
import { KafkaLab } from './KafkaLab.tsx'

/** Topic log + Python/JS Kafka API labs (browser-only, shared engine). */
export function KafkaPlayground() {
  return (
    <div className="kafka-playground">
      <KafkaLab />
      <hr className="kafka-playground-divider" />
      <h3 className="kafka-lab-subhead">Code lab</h3>
      <KafkaCodeLab />
    </div>
  )
}
