module flow_protocol::pact {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::coin::{Self, Coin};
    use sui::clock::{Self, Clock};
    use sui::event;
    use sui::balance::{Self, Balance};
    use std::string::{Self, String};
    use flow_protocol::stream;

    const STATUS_PENDING: u8 = 0;
    const STATUS_COMPLETED: u8 = 1;
    const STATUS_DISPUTED: u8 = 2;
    const STATUS_CANCELLED: u8 = 3;

    const ENotSender: u64 = 0;
    const ENotRecipient: u64 = 1;
    const EDeadlinePassed: u64 = 3;
    const ENotPending: u64 = 4;
    const EZeroDuration: u64 = 5;
    const EZeroRate: u64 = 6;

    public struct PactCreated has copy, drop {
        pact_id: address,
        sender: address,
        recipient: address,
        amount: u64,
        deadline: u64,
    }

    public struct PactCompleted has copy, drop {
        pact_id: address,
        recipient: address,
        amount: u64,
    }

    public struct PactCancelled has copy, drop {
        pact_id: address,
        sender: address,
        refund: u64,
    }

    public struct PactDisputed has copy, drop {
        pact_id: address,
        disputed_by: address,
    }

    public struct PactReleasedAsStream has copy, drop {
        pact_id: address,
        recipient: address,
        amount: u64,
        rate_per_second: u64,
    }

    public struct Pact<phantom T> has key, store {
        id: UID,
        sender: address,
        recipient: address,
        amount: u64,
        description: String,
        walrus_blob_id: String,
        status: u8,
        created_at: u64,
        deadline: u64,
        balance: Balance<T>,
    }

    public fun create_pact<T>(
        recipient: address,
        description: vector<u8>,
        walrus_blob_id: vector<u8>,
        deadline: u64,
        deposit: Coin<T>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let sender = tx_context::sender(ctx);
        let amount = coin::value(&deposit);
        let now = clock::timestamp_ms(clock);

        let pact = Pact<T> {
            id: object::new(ctx),
            sender,
            recipient,
            amount,
            description: string::utf8(description),
            walrus_blob_id: string::utf8(walrus_blob_id),
            status: STATUS_PENDING,
            created_at: now,
            deadline,
            balance: coin::into_balance(deposit),
        };

        event::emit(PactCreated {
            pact_id: object::uid_to_address(&pact.id),
            sender,
            recipient,
            amount,
            deadline,
        });

        transfer::share_object(pact);
    }

    public fun complete_pact<T>(
        pact: &mut Pact<T>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let caller = tx_context::sender(ctx);
        assert!(caller == pact.sender, ENotSender);
        assert!(pact.status == STATUS_PENDING, ENotPending);

        if (pact.deadline > 0) {
            assert!(clock::timestamp_ms(clock) <= pact.deadline, EDeadlinePassed);
        };

        pact.status = STATUS_COMPLETED;

        let amount = balance::value(&pact.balance);
        let payout = balance::split(&mut pact.balance, amount);

        event::emit(PactCompleted {
            pact_id: object::uid_to_address(&pact.id),
            recipient: pact.recipient,
            amount,
        });

        transfer::public_transfer(coin::from_balance(payout, ctx), pact.recipient);
    }

    public fun complete_pact_as_stream<T>(
        pact: &mut Pact<T>,
        stream_duration_ms: u64,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let caller = tx_context::sender(ctx);
        assert!(caller == pact.sender, ENotSender);
        assert!(pact.status == STATUS_PENDING, ENotPending);
        assert!(stream_duration_ms > 0, EZeroDuration);

        if (pact.deadline > 0) {
            assert!(clock::timestamp_ms(clock) <= pact.deadline, EDeadlinePassed);
        };

        let amount = balance::value(&pact.balance);
        let duration_sec = stream_duration_ms / 1000;
        let rate_per_second = amount / duration_sec;
        assert!(rate_per_second > 0, EZeroRate);

        pact.status = STATUS_COMPLETED;

        let payout = balance::split(&mut pact.balance, amount);
        let deposit_coin = coin::from_balance(payout, ctx);

        event::emit(PactReleasedAsStream {
            pact_id: object::uid_to_address(&pact.id),
            recipient: pact.recipient,
            amount,
            rate_per_second,
        });

        stream::create_stream(
            pact.recipient,
            rate_per_second,
            deposit_coin,
            clock,
            ctx
        );
    }

    public fun cancel_pact<T>(
        pact: &mut Pact<T>,
        ctx: &mut TxContext
    ) {
        let caller = tx_context::sender(ctx);
        assert!(caller == pact.sender, ENotSender);
        assert!(pact.status == STATUS_PENDING, ENotPending);

        pact.status = STATUS_CANCELLED;

        let amount = balance::value(&pact.balance);
        let refund = balance::split(&mut pact.balance, amount);

        event::emit(PactCancelled {
            pact_id: object::uid_to_address(&pact.id),
            sender: caller,
            refund: amount,
        });

        transfer::public_transfer(coin::from_balance(refund, ctx), pact.sender);
    }

    public fun dispute_pact<T>(
        pact: &mut Pact<T>,
        ctx: &mut TxContext
    ) {
        let caller = tx_context::sender(ctx);
        assert!(caller == pact.recipient, ENotRecipient);
        assert!(pact.status == STATUS_PENDING, ENotPending);

        pact.status = STATUS_DISPUTED;

        event::emit(PactDisputed {
            pact_id: object::uid_to_address(&pact.id),
            disputed_by: caller,
        });
    }

    public fun sender<T>(pact: &Pact<T>): address { pact.sender }
    public fun recipient<T>(pact: &Pact<T>): address { pact.recipient }
    public fun amount<T>(pact: &Pact<T>): u64 { pact.amount }
    public fun status<T>(pact: &Pact<T>): u8 { pact.status }
    public fun description<T>(pact: &Pact<T>): &String { &pact.description }
    public fun deadline<T>(pact: &Pact<T>): u64 { pact.deadline }
    public fun is_pending<T>(pact: &Pact<T>): bool { pact.status == STATUS_PENDING }
    public fun is_completed<T>(pact: &Pact<T>): bool { pact.status == STATUS_COMPLETED }
    public fun is_disputed<T>(pact: &Pact<T>): bool { pact.status == STATUS_DISPUTED }
    public fun is_cancelled<T>(pact: &Pact<T>): bool { pact.status == STATUS_CANCELLED }
}
