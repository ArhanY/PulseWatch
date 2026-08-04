# PulseWatch

> **PulseWatch – Intelligent API Reliability & Incident Management Platform**

A production-inspired full-stack monitoring platform that continuously monitors REST APIs, measures availability and latency, detects failures, records incidents, and visualizes system health through a real-time dashboard.

---

# Overview

Modern applications depend on many internal and external APIs.

If even one API becomes unavailable or slow, the application may stop functioning correctly.

Examples include:

- Payment API
- Authentication API
- Email API
- Notification API
- Inventory API

PulseWatch continuously checks these APIs and provides engineers with real-time visibility into their health.

---

# Problem Statement

Organizations often rely on expensive monitoring platforms such as:

- Datadog
- New Relic
- Pingdom
- UptimeRobot

PulseWatch is a simplified production-inspired alternative that demonstrates backend engineering concepts including monitoring, worker pools, retry strategies, circuit breakers, and real-time dashboards.

---

# Objectives

The project aims to demonstrate:

- Backend Engineering
- Production-ready Architecture
- API Monitoring
- Incident Management
- Fault Tolerance
- Real-time Systems
- Dashboard Design

---

# Tech Stack

## Frontend

- React 19
- Vite
- Tailwind CSS
- React Router
- Axios
- Socket.IO Client
- Recharts
- React Hot Toast

---

## Backend

- Node.js
- Express.js
- JWT Authentication
- bcrypt
- Socket.IO
- node-cron
- Axios
- Helmet
- Morgan
- Express Validator
- dotenv
- CORS

---

## Database

- MongoDB
- Mongoose

---

## DevOps

- Docker
- Docker Compose

---

# Major Features

## Authentication

- Register
- Login
- JWT Authentication
- Protected Routes

---

## API Management

Users can

- Add API
- Edit API
- Delete API
- Enable Monitoring
- Disable Monitoring

Each API contains

- Name
- URL
- HTTP Method
- Request Headers
- Request Body
- Timeout
- Monitoring Interval

---

## Monitoring Engine

Background workers automatically monitor APIs.

Every interval

↓

Send HTTP Request

↓

Measure Response Time

↓

Capture Status Code

↓

Capture Response Size

↓

Store Metrics

↓

Update Dashboard

---

## Metrics

For every request

Store

- Response Time
- Status Code
- Timestamp
- Response Size
- Success / Failure

---

## Dashboard

Display

- Healthy APIs
- Failed APIs
- Average Latency
- Average Uptime
- Active Incidents
- Total APIs

---

## Analytics

Interactive Charts

- Response Time
- Availability
- Error Rate
- Uptime History

---

## Incident Management

Whenever an API fails

Create Incident

Store

- Start Time
- End Time
- Duration
- Failure Reason

---

## Real-Time Dashboard

Dashboard automatically updates using Socket.IO.

No refresh required.

---

## Retry Strategy

If a request fails

Retry

1 second

↓

2 seconds

↓

4 seconds

↓

Fail

---

## Circuit Breaker

If an API repeatedly fails

Closed

↓

Open

↓

Half Open

↓

Closed

---

## Worker Pool

Instead of one monitoring process

Multiple workers monitor APIs concurrently.

---

## Docker

Run

Frontend

Backend

MongoDB

using Docker Compose.

---

# Folder Structure

pulsewatch/

frontend/

backend/

docker-compose.yml

README.md

---

# Project Architecture

React Dashboard

↓

Express API

↓

Monitoring Engine

↓

Worker Pool

↓

REST APIs

↓

MongoDB

↓

Socket.IO

↓

Dashboard

---

# Non Functional Requirements

- Modular
- Scalable
- Maintainable
- Production Inspired
- Responsive
- Secure
- Real-time
- Fault Tolerant

---

# Future Enhancements

- Email Alerts
- Slack Alerts
- Telegram Alerts
- Team Workspaces
- Public Status Page
- API Tags
- SSL Monitoring
- Region-wise Monitoring

---

# Resume Description

PulseWatch is a production-inspired API Reliability & Incident Management Platform that continuously monitors REST APIs, tracks uptime, measures latency, detects failures, and visualizes system health through a real-time dashboard using a scalable worker-pool architecture with retry and circuit breaker mechanisms.

---

# Skills Demonstrated

- Backend Engineering
- REST APIs
- Authentication
- MongoDB
- React
- WebSockets
- Worker Pools
- Scheduling
- Retry with Exponential Backoff
- Circuit Breaker
- Docker
- Fault Tolerance
- Incident Management
- Dashboard Development

---

# Development Goals

Build a production-quality backend project suitable for Software Development Engineer internship interviews while following clean architecture and engineering best practices.
