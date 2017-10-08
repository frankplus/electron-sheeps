export enum Order {LT, GT, EQ};

export class SrtObject {
    constructor(
        public start: number,
        public end: number,
        public text: string
    ) {}

    compareTo(other: SrtObject): Order {
        if (this.start < other.start) {
            return Order.LT;
        } else if ((this.start > other.start)) {
            return Order.GT;
        }

        return Order.EQ;
    }
}

