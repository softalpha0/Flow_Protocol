module flow_protocol::instant {
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::coin::{Self, Coin};
    use sui::event;

    const EMismatchedSplits: u64 = 0;
    const EZeroAmount: u64 = 1;

    public struct InstantSent has copy, drop {
        sender: address,
        recipient: address,
        amount: u64,
    }

    public struct SplitSent has copy, drop {
        sender: address,
        total: u64,
        recipient_count: u64,
    }

    public fun send<T>(
        payment: Coin<T>,
        recipient: address,
        ctx: &mut TxContext
    ) {
        let amount = coin::value(&payment);
        assert!(amount > 0, EZeroAmount);

        event::emit(InstantSent {
            sender: tx_context::sender(ctx),
            recipient,
            amount,
        });

        transfer::public_transfer(payment, recipient);
    }

    public fun split_send<T>(
        mut payment: Coin<T>,
        recipients: vector<address>,
        amounts: vector<u64>,
        ctx: &mut TxContext
    ) {
        let n = vector::length(&recipients);
        assert!(n == vector::length(&amounts), EMismatchedSplits);
        assert!(n > 0, EZeroAmount);

        let total = coin::value(&payment);
        let sender = tx_context::sender(ctx);

        let mut i = 0;
        while (i < n) {
            let recipient = *vector::borrow(&recipients, i);
            let amount = *vector::borrow(&amounts, i);
            let chunk = coin::split(&mut payment, amount, ctx);
            transfer::public_transfer(chunk, recipient);
            i = i + 1;
        };

        event::emit(SplitSent {
            sender,
            total,
            recipient_count: n,
        });

        if (coin::value(&payment) > 0) {
            transfer::public_transfer(payment, sender);
        } else {
            coin::destroy_zero(payment);
        };
    }
}
