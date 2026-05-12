module flow_protocol::stream {
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};
    use sui::coin::{Self, Coin};
    use sui::clock::{Self, Clock};
    use sui::event;
    use sui::balance::{Self, Balance};

    const ENotSender: u64 = 0;
    const ENotRecipient: u64 = 1;
    const EStreamNotActive: u64 = 2;
    const EInsufficientBalance: u64 = 4;
    const EZeroRate: u64 = 5;

    public struct StreamCreated has copy, drop {
        stream_id: address,
        sender: address,
        recipient: address,
        rate_per_second: u64,
        deposit: u64,
    }

    public struct StreamWithdrawn has copy, drop {
        stream_id: address,
        recipient: address,
        amount: u64,
    }

    public struct StreamCancelled has copy, drop {
        stream_id: address,
        sender: address,
        claimable: u64,
        refund: u64,
    }

    public struct Stream<phantom T> has key, store {
        id: UID,
        sender: address,
        recipient: address,
        rate_per_second: u64,
        balance: Balance<T>,
        start_time: u64,
        last_withdrawn: u64,
        is_active: bool,
    }

    public fun create_stream<T>(
        recipient: address,
        rate_per_second: u64,
        deposit: Coin<T>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        assert!(rate_per_second > 0, EZeroRate);
        let deposit_amount = coin::value(&deposit);
        assert!(deposit_amount > 0, EInsufficientBalance);

        let now = clock::timestamp_ms(clock);
        let sender = tx_context::sender(ctx);

        let stream = Stream<T> {
            id: object::new(ctx),
            sender,
            recipient,
            rate_per_second,
            balance: coin::into_balance(deposit),
            start_time: now,
            last_withdrawn: now,
            is_active: true,
        };

        event::emit(StreamCreated {
            stream_id: object::uid_to_address(&stream.id),
            sender,
            recipient,
            rate_per_second,
            deposit: deposit_amount,
        });

        transfer::share_object(stream);
    }

    public fun get_claimable<T>(stream: &Stream<T>, clock: &Clock): u64 {
        if (!stream.is_active) return 0;
        let now = clock::timestamp_ms(clock);
        let elapsed_ms = now - stream.last_withdrawn;
        let elapsed_sec = elapsed_ms / 1000;
        let earned = elapsed_sec * stream.rate_per_second;
        let bal = balance::value(&stream.balance);
        if (earned > bal) bal else earned
    }

    public fun withdraw_stream<T>(
        stream: &mut Stream<T>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let caller = tx_context::sender(ctx);
        assert!(caller == stream.recipient, ENotRecipient);
        assert!(stream.is_active, EStreamNotActive);

        let claimable = get_claimable(stream, clock);
        assert!(claimable > 0, EInsufficientBalance);

        stream.last_withdrawn = clock::timestamp_ms(clock);

        let withdrawn = balance::split(&mut stream.balance, claimable);

        if (balance::value(&stream.balance) == 0) {
            stream.is_active = false;
        };

        event::emit(StreamWithdrawn {
            stream_id: object::uid_to_address(&stream.id),
            recipient: caller,
            amount: claimable,
        });

        transfer::public_transfer(coin::from_balance(withdrawn, ctx), caller);
    }

    public fun cancel_stream<T>(
        stream: &mut Stream<T>,
        clock: &Clock,
        ctx: &mut TxContext
    ) {
        let caller = tx_context::sender(ctx);
        assert!(caller == stream.sender, ENotSender);
        assert!(stream.is_active, EStreamNotActive);

        let claimable = get_claimable(stream, clock);
        let total = balance::value(&stream.balance);
        let refund_amount = total - claimable;

        stream.is_active = false;

        event::emit(StreamCancelled {
            stream_id: object::uid_to_address(&stream.id),
            sender: caller,
            claimable,
            refund: refund_amount,
        });

        if (claimable > 0) {
            let recipient_share = balance::split(&mut stream.balance, claimable);
            transfer::public_transfer(
                coin::from_balance(recipient_share, ctx),
                stream.recipient
            );
        };

        if (balance::value(&stream.balance) > 0) {
            let sender_share = balance::split(&mut stream.balance, refund_amount);
            transfer::public_transfer(
                coin::from_balance(sender_share, ctx),
                caller
            );
        };
    }

    public fun sender<T>(stream: &Stream<T>): address { stream.sender }
    public fun recipient<T>(stream: &Stream<T>): address { stream.recipient }
    public fun rate_per_second<T>(stream: &Stream<T>): u64 { stream.rate_per_second }
    public fun balance_value<T>(stream: &Stream<T>): u64 { balance::value(&stream.balance) }
    public fun is_active<T>(stream: &Stream<T>): bool { stream.is_active }
    public fun start_time<T>(stream: &Stream<T>): u64 { stream.start_time }
}
