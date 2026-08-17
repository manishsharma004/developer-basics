// Python program for the concurrency lesson. It simulates many threads each
// incrementing a shared counter. A non-atomic increment is modeled as three
// micro-ops (load, add, store); a random scheduler interleaves them. Without a
// lock, interleavings drop updates (a real race condition); with a lock, each
// increment is atomic and the result is always correct.
export const CONCURRENCY_PROGRAM = String.raw`
import random, json


def _simulate_once(threads, iters, use_lock, rng):
    shared = 0
    local = [0] * threads
    phase = [0] * threads       # 0=load, 1=add, 2=store
    remaining = [iters] * threads
    lock_holder = None
    total = threads * iters * 3
    done = 0
    while done < total:
        if use_lock and lock_holder is not None:
            t = lock_holder
        else:
            candidates = [i for i in range(threads) if remaining[i] > 0]
            if not candidates:
                break
            t = rng.choice(candidates)
        if use_lock and phase[t] == 0 and lock_holder is None:
            lock_holder = t
        if phase[t] == 0:
            local[t] = shared          # read shared into a register
            phase[t] = 1
        elif phase[t] == 1:
            local[t] = local[t] + 1    # increment the register
            phase[t] = 2
        else:
            shared = local[t]          # write the register back
            phase[t] = 0
            remaining[t] -= 1
            if use_lock and lock_holder == t:
                lock_holder = None
        done += 1
    return shared


def race(threads, iters, use_lock, trials=300, seed=7):
    threads = max(1, int(threads))
    iters = max(1, int(iters))
    expected = threads * iters
    rng = random.Random(seed)
    results = [_simulate_once(threads, iters, bool(use_lock), rng) for _ in range(trials)]
    correct = sum(1 for r in results if r == expected)
    return json.dumps({
        'expected': expected,
        'min': min(results),
        'max': max(results),
        'correct': correct,
        'trials': trials,
        'sample': results[0],
    })
`
