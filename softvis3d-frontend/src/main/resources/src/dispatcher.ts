interface Event {
    type: string;
    payload: any;
}

class EventDispatcher<TPayload> {
    private listeners: Array<(payload: TPayload) => void>;

    public constructor() {
        this.listeners = [];
    }

    public register(callback: (payload: TPayload) => void): number {
        return this.listeners.push(callback);
    }

    public unregister(id: number): void {
        this.listeners[id] = () => null;
    }

    public dispatch(payload: TPayload) {
        for (let i = 0; i < this.listeners.length; i++) {
            this.invokeCallback(i, payload);
        }
    }

    private invokeCallback(id: number, payload: TPayload) {
        this.listeners[id](payload);
    }
}

const dispatcher = new EventDispatcher<Event>();
export default dispatcher;
