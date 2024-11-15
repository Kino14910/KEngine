"use strict";
class ListNode {
    value;
    next;
    constructor(value, next = null) {
        this.value = value;
        this.next = next;
    }
}
class LinkedList {
    head = null;
    append(value) {
        const node = new ListNode(value);
        if (!this.head) {
            this.head = node;
            return;
        }
        let current = this.head;
        while (current.next) {
            current = current.next;
        }
        current.next = node;
    }
    remove(value) {
        let current = this.head;
        while (current?.next) {
            if (current.value === value) {
                current.next = current.next.next;
                return true;
            }
            current = current.next;
        }
        return false;
    }
    find(value) {
        let current = this.head;
        while (current) {
            if (current.value === value) {
                console.log(current.value);
                return true;
            }
            current = current.next;
        }
        return false;
    }
    print() {
        let current = this.head;
        let arr = [];
        while (current) {
            arr.push(current.value);
            current = current.next;
        }
        console.log(arr.join(' -> '));
    }
}
const list = new LinkedList();
list.append(1);
list.append(2);
list.append(3);
list.print();
list.remove(2);
list.print();
console.log(list.find(3));
list.remove(3);
list.print();
