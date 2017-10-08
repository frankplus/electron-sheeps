import {SrtObject, Order} from './srtobject'

enum Color {R, B};

// TODO: make interface
export class Node {
    public constructor(
        public color: Color,
        public left: SubtitleTree | null,
        public value: SrtObject,
        public right: SubtitleTree | null
    ) {}
}

export class SubtitleTree {
    public readonly root: Node | null;

    private constructor(node: Node | null) {
        this.root = node;
    }

    public static __create(): SubtitleTree {
        this.__create = undefined; // lol        
        return new SubtitleTree(null);
    }

    public isEmpty(): boolean {
        return this.root === null;
    }

    public rootValue(): SrtObject {
        return this.root.value;
    }

    private rootColor(): Color {
        return this.root.color;
    }

    public left(): SubtitleTree {
        return this.root.left;
    }

    public right(): SubtitleTree {
        return this.root.right;
    }

    public insert(value: SrtObject): SubtitleTree {
        let t = this.ins(value);
        return new SubtitleTree(new Node(
            Color.B,
            t.left(),
            t.rootValue(),
            t.right()
        ));
    }

    private ins(value: SrtObject): SubtitleTree {
        if (this.isEmpty()) {
            return new SubtitleTree(new Node(Color.R, EmptyTree, value, EmptyTree));
        }

        let rootValue = this.rootValue();
        let c = this.rootColor();

        let order = value.compareTo(rootValue);
        if (order === Order.LT) {
            return SubtitleTree.balance(c, this.left().ins(value), rootValue, this.right());
        } else if (order === Order.GT) {
            return SubtitleTree.balance(c, this.left(), rootValue, this.right().ins(value));
        }
        
        return this; // FIvalueME: duplicates?
    }

    private static balance(c: Color, left: SubtitleTree, value: SrtObject, right: SubtitleTree) {
        if (c == Color.B && left.doubledLeft())
            return new SubtitleTree(new Node(
                Color.R,
                left.left().paint(Color.B),
                left.rootValue(),
                new SubtitleTree(new Node(Color.B, left.right(), value, right))
            ));
        else if (c == Color.B && left.doubledRight())
            return new SubtitleTree(new Node(
                Color.R,
                new SubtitleTree(new Node(Color.B, left.left(), left.rootValue(), left.right().left())),
                left.right().rootValue(),
                new SubtitleTree(new Node(Color.B, left.right().right(), value, right))
            ));
        else if (c == Color.B && right.doubledLeft())
            return new SubtitleTree(new Node(
                Color.R,
                new SubtitleTree(new Node(Color.B, left, value, right.left().left())),
                right.left().rootValue(),
                new SubtitleTree(new Node(Color.B, right.left().right(), right.rootValue(), right.right()))
            ));
        else if (c == Color.B && right.doubledRight())
            return new SubtitleTree(new Node(
                Color.R,
                new SubtitleTree(new Node(Color.B, left, value, right.left())),
                right.rootValue(),
                right.right().paint(Color.B)
            ));
        
        return new SubtitleTree(new Node(c, left, value, right));
    }

    private doubledLeft() {
        return !this.isEmpty()
            && this.rootColor() == Color.R
            && !this.left().isEmpty()
            && this.left().rootColor() == Color.R;
    }

    private doubledRight() {
        return !this.isEmpty()
            && this.rootColor() == Color.R
            && !this.right().isEmpty()
            && this.right().rootColor() == Color.R;
    }   

    private paint(c: Color) {
        return new SubtitleTree(new Node(c, this.left(), this.rootValue(), this.right()));
    }

    public inOrder(): SrtObject[] {
        if (this.isEmpty()) {
            return [];
        }
        let result: SrtObject[] = [];
        result.push(...this.left().inOrder());
        result.push(this.rootValue());
        result.push(...this.right().inOrder());

        return result;
    }
}

export const EmptyTree = SubtitleTree.__create();
