class ListNode {
    value;
    next;
    constructor(value, next = null) {
        this.value = value;
        this.next = next;
    }
}
export class LinkedList {
    head = new ListNode(null);
    end = this.head;
    [Symbol.iterator]() {
        let current = this.head.next;
        return {
            //@ts-ignore
            next: () => {
                if (current) {
                    const result = {
                        done: false,
                        value: current.value
                    };
                    current = current.next;
                    return result;
                }
                return {
                    done: true
                };
            }
        };
    }
    append(value) {
        const node = new ListNode(value);
        this.end.next = node;
        this.end = node;
    }
    remove(value) {
        let current = this.head.next;
        while (current?.next) {
            if (current.next.value === value) {
                current.next = current.next.next;
                return true;
            }
            current = current.next;
        }
        return false;
    }
    find(value) {
        let current = this.head.next;
        while (current) {
            if (current.value === value) {
                return current;
            }
            current = current.next;
        }
        return null;
    }
    clear() {
        this.end = this.head;
        this.head.next = null;
        for (const candidate of this) {
            const node = candidate;
            if (node.next) {
                node.next = null;
            }
            node.value = null;
        }
    }
}
