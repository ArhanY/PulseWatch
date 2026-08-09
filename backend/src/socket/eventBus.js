const EventEmitter = require('events');

class MonitoringEventBus extends EventEmitter {}

module.exports = new MonitoringEventBus();
