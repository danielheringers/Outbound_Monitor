export interface RabbitMQQueue {
    arguments: Record<string, unknown>;
    auto_delete: boolean;
    backing_queue_status: {
      avg_ack_egress_rate: number;
      avg_ack_ingress_rate: number;
      avg_egress_rate: number;
      avg_ingress_rate: number;
      delta: ['delta', number, number, number, number];
      len: number;
      mode: string;
      next_deliver_seq_id: number;
      next_seq_id: number;
      num_pending_acks: number;
      num_unconfirmed: number;
      q1: number;
      q2: number;
      q3: number;
      q4: number;
      target_ram_count: string | number;
      version: number;
    };
    consumer_capacity: number;
    consumer_utilisation: number;
    consumers: number;
    durable: boolean;
    effective_policy_definition: {
      'queue-mode': string;
    };
    exclusive: boolean;
    exclusive_consumer_tag: string | null;
    garbage_collection: {
      fullsweep_after: number;
      max_heap_size: number;
      min_bin_vheap_size: number;
      min_heap_size: number;
      minor_gcs: number;
    };
    head_message_timestamp: string | null;
    idle_since: string;
    memory: number;
    message_bytes: number;
    message_bytes_paged_out: number;
    message_bytes_persistent: number;
    message_bytes_ram: number;
    message_bytes_ready: number;
    message_bytes_unacknowledged: number;
    messages: number;
    messages_details: {
      rate: number;
    };
    messages_paged_out: number;
    messages_persistent: number;
    messages_ram: number;
    messages_ready: number;
    messages_ready_details: {
      rate: number;
    };
    messages_ready_ram: number;
    messages_unacknowledged: number;
    messages_unacknowledged_details: {
      rate: number;
    };
    messages_unacknowledged_ram: number;
    name: string;
    node: string;
    operator_policy: string | null;
    policy: string;
    recoverable_slaves: unknown | null;
    reductions: number;
    reductions_details: {
      rate: number;
    };
    single_active_consumer_tag: string | null;
    state: string;
    type: string;
    vhost: string;
  }