---
title: Trying Temporal Again - A Quick Look at Workflow Orchestration
description: A quick look at workflows, workers, retries, distributed execution, and why Temporal is interesting for long-running workloads.
pubDate: 2026-10-06
authors:
  - razvanmuntian
categories:
  - DevOps
featured: false
ogImage: ogimage.png
ogImageAlt: A quick look at workflows, workers, retries, distributed execution, and why Temporal is interesting for long-running workloads.
draft: false
---

I used Temporal about two years ago for a client project, and recently decided to give it another try and see what's changed.

The basic idea is still the same: Temporal gives you a way to define and orchestrate long-running, distributed workflows while keeping track of their state and handling failures along the way.

What I find interesting is the separation between the Temporal service and the workers that actually execute your code. Temporal keeps track of what needs to happen, while workers can be scaled independently across different machines.

The retry and failure handling is probably one of the nicest parts. Instead of having to build all that infrastructure yourself, Temporal knows where a workflow is, what has already completed, and what needs to be retried.

It also made me think about workloads differently. If you have expensive or long-running tasks, you can treat them as pieces of a larger workflow and throw more workers at them when needed.

I also came across some of the more interesting features and examples around dynamic workflows, child workflows, scheduled execution, and running workers dynamically.

I didn't go particularly deep this time, but after playing with it again, I can see why Temporal is useful, especially when you have distributed work that needs reliability, retries, and orchestration.

It's definitely something I'd like to experiment with more.

## Watch the full video 👇

<div class="youtube-embed">
  <iframe width="560" height="315" src="https://www.youtube.com/embed/t5WW0C4PX38?si=ZK9nWxsHJ9oIe3pd" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
</div>
