const logger = require('../loaders/logger');

class PubSub {
    #events = {};

    subscribe = (eventName, fn) => {
        logger.debug(`Subscribed to know about ${eventName}`);

        // Add an event to an existing list or as new
        this.#events[eventName] = this.#events[eventName] || [];
        this.#events[eventName].push(fn);
    };

    unsubscribe = (eventName, fn) => {
        logger.silly('Unsubscribing from ${evName}');

        if (this.#events[eventName])
            this.#events[eventName] = this.#events[eventName].filter(
                (f) => f !== fn
            );
    };

    async publish(eventName, data, trx) {
        try {
            logger.debug(`Making a broadcast about ${eventName} event.`);

            // Emit or publish the event to anyone who is subscribed.
            if (this.#events[eventName]) {
                const handlerFns = this.#events[eventName];
                for (let fn of handlerFns) {
                    await fn(data, trx);
                }
            }
        } catch (exception) {
            throw exception;
        }
    }
}

module.exports = new PubSub();
