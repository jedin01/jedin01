---
title: I was looking for a better way to work with BPMN and Git
description: How a small limitation in Miragon's BPMN Modeler for VS Code turned into an issue, a pull request and default platform-aware linting in v1.8.0.
tags: [Open source, BPMN, VS Code, Process automation]
lang: en
original: https://www.linkedin.com/feed/update/urn:li:activity:7498042555230588928/
---

For those who don't know BPMN, it's a notation used to model business processes and, in my case, I wanted to treat them more and more like code: versioning, branches, diffs and Pull Requests.

That's how I landed on Miragon's BPMN Modeler extension for VS Code. My `.bpmn` files could live directly in the repository and I could work with them in the same environment where I develop software. Everything was exactly as I wanted.

Until I found a limitation: the extension's BPMN integrity validation (linting) already existed, but it was only enabled when there was a specific configuration in the workspace. To me, it made more sense that such an important feature would work by default.

Instead of just setting up my project, I opened Issue #1320 and then PR #1321 with a possible implementation.

That's when the part I liked the most began.

During the discussion with Marco Schäck and Peter Heinemann, I realized that my solution could still be better. Linting shouldn't simply apply a global set of rules: rules need to consider the execution platform, such as Camunda 7 or Camunda 8.

The idea was expanded and implemented by Miragon. A few days later, v1.8.0 was released with default diagram linting, according to the execution platform. And today I can open a `.bpmn` in my VS Code and see the validation working without additional configuration.

It was a small discovery during my own workflow that turned into an improvement for the tool.

And perhaps this is one of the most interesting things about open source: **your Pull Request does not need to be merged for your contribution to have an impact.**

Sometimes, contributing is simply finding a problem, explaining why it matters, proposing a solution, and being open to an even better solution.

Thanks to Miragon, Marco Schäck and Peter Heinemann for the discussion and openness. It is exactly this type of experience that makes me want to contribute more.
