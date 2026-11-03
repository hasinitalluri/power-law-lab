"""Command-line version of Power Law Lab. Uses the same model as model.js.

Example: python simulate.py --startups 25 --bust 0.60 --home 0.005
"""
import argparse
import math
import random
import statistics


def probs(bust, home):
    rest, k = 1 - bust - home, 0.28 + 0.09 + 0.025
    return bust, rest * 0.28 / k, rest * 0.09 / k, rest * 0.025 / k


def startup(rng, bust, brk, good, great):
    u = rng.random()
    if u < bust:
        return 0.0
    u -= bust
    if u < brk:
        return rng.uniform(0.3, 1.5)
    u -= brk
    if u < good:
        return rng.uniform(2, 6)
    u -= good
    if u < great:
        return rng.uniform(6, 25)
    return math.exp(rng.uniform(math.log(30), math.log(200)))  # home run


def main():
    a = argparse.ArgumentParser(description="Simulate venture funds.")
    a.add_argument("--startups", type=int, default=25)
    a.add_argument("--bust", type=float, default=0.60)
    a.add_argument("--home", type=float, default=0.005)
    a.add_argument("--funds", type=int, default=3000)
    a.add_argument("--seed", type=int, default=42)
    args = a.parse_args()

    rng, p = random.Random(args.seed), probs(args.bust, args.home)
    multiples, top = [], []
    for _ in range(args.funds):
        f = [startup(rng, *p) for _ in range(args.startups)]
        total = sum(f)
        multiples.append(total / args.startups)
        top.append(max(f) / total if total else 0)

    print(f"{args.funds} funds of {args.startups} startups")
    print(f"Typical fund return:        {statistics.median(multiples):.2f}x")
    print(f"Funds that lose money:      {sum(m < 1 for m in multiples) / args.funds:.0%}")
    print(f"Funds that return 3x+:      {sum(m >= 3 for m in multiples) / args.funds:.0%}")
    print(f"Best startup's value share: {statistics.median(top):.0%}")


if __name__ == "__main__":
    main()
