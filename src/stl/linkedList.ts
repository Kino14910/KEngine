interface ILinkedNode<T> {
    value: T | null
    next: ILinkedNode<T> | null
}

class ListNode<T> implements ILinkedNode<T> {
    constructor(
        public value: T | null,
        public next: ILinkedNode<T> | null = null
    ) {}
}

interface ILinkedList<T> extends Iterable<T> {
    append(value: T): void
    remove(value: T): Boolean
    find(value: T): ListNode<T> | null
    clear(): void
}

export class LinkedList<T> implements ILinkedList<T> {
    public readonly head: ListNode<void> = new ListNode(null)
    private end: ListNode<T> = this.head as ListNode<T>

    ;[Symbol.iterator](): Iterator<T, any, any> {
        let current = this.head.next
        return {
            //@ts-ignore
            next: () => {
                if(current) {
                    const result = {
                        done: false,
                        value: current.value
                    }
                    current = current.next
                    return result
                }
                return {
                    done: true
                }
            }
        }
    }

    append(value: T): void {
        const node = new ListNode(value)
        this.end.next = node
        this.end = node
    }

    remove(value: T): Boolean {
        let current = this.head.next
        while(current?.next) {
            if(current.next.value === value){
                current.next = current.next.next
                return true
            }
            current = current.next
        }

        return false
    }

    find(value: T): ILinkedNode<T> | null {
        let current = this.head.next
        while(current) {
            if(current.value === value){
                return current as ILinkedNode<T>
            }
            current = current.next
        }

        return null
    }

    clear() {
        this.end = this.head as ILinkedNode<T>
        this.head.next = null
        for (const candidate of this) {
            const node = <ILinkedNode<any>> candidate
            if(node.next) {
                node.next = null
            }
            node.value = null
        }
    }
}