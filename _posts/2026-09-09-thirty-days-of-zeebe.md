---
title: "Thirty days of Zeebe, day one: how the engine is built"
description: A month-long deep dive into Zeebe, the engine behind Camunda 8. Day one covers why it needs no central database and its four building blocks.
tags: [Camunda 8, Zeebe, Distributed systems]
lang: en
original: https://www.linkedin.com/feed/update/urn:li:activity:7503570098704560129/
---

I've taken on a challenge with my friend Hélio Matondo: I'll study Zeebe in depth, he'll study Apache Kafka. A month of immersion, daily status updates, and at the end, each of us will deliver a complex project demonstrating, in practice, everything we've learned.

I'm starting with the basics: the official Zeebe documentation, the process automation engine behind Camunda 8.

## No central database

One of the things that caught my attention right away: Zeebe doesn't depend on a central database. This means that performance doesn't degrade as the volume of processes increases. Data is distributed among all brokers in the cluster, written directly to the filesystem, and if one broker fails, another takes over without data loss.

## Four building blocks

The architecture relies on four main components:

- **Clients:** libraries embedded in the application that send commands to Zeebe (process deployment, instance start, job activation and completion). All business logic lives on the client side, never within Zeebe.
- **Gateways:** a single entry point to the cluster, stateless, scalable for load balancing and high availability.
- **Brokers:** the distributed engine that keeps the state of active instances, partitioned and replicated, with no single point of failure.
- **Exporters:** they stream state change events for monitoring, auditing and historical analysis.

One concept worth highlighting: the job worker is precisely a client that activates Zeebe jobs and, when it finishes, either completes or fails them. That keeps orchestration and business logic decoupled.

Next, I'm going deeper into Zeebe clients and the Zeebe API.
