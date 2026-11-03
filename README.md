# Power Law Lab

A simulator that runs thousands of imaginary venture funds to show why investors expect most startups to fail and why a single home run can return the whole fund. Built for the Road to Silicon Valley Program application at Rutgers Business School.

**Live demo:** add your GitHub Pages link here after you deploy.

## What I found

Using the default odds (60% of startups lose everything, 0.5% become home runs), the average startup returns about 1.4x. Even so, a typical fund often fails to make money:

| Startups in fund | Typical fund return | Funds that lose money | Best startup's share of value |
|---|---|---|---|
| 5 | 0.60x | 65% | 74% |
| 10 | 0.77x | 62% | 55% |
| 25 | 0.99x | 51% | 39% |
| 50 | 1.12x | 41% | 31% |

The average looks good only because a few rare winners are huge. A small fund usually misses them, which is why investors spread money across many startups. Results use a fixed seed, so you can reproduce them exactly.

## Features

- Sliders for fund size, loss rate, and home run odds, with all results updating live
- A histogram of 3,000 simulated funds
- A drawing of one fund where circle area shows each startup's return
- A table comparing fund sizes under the same odds
- A Python command-line version of the same model

## How it works

Each startup is one random draw from five outcomes: lose everything (0x), break even (0.3x to 1.5x), good (2x to 6x), great (6x to 25x), or a home run (30x to 200x). A fund invests equal amounts in `n` startups, and its return is the average multiple. `model.js` holds this logic as pure functions with a seeded random number generator (mulberry32), and `app.js` draws the interface.

The odds are illustrative and are not taken from real fund data. The model ignores fees, time, and follow-on investing. To test your own beliefs, edit the ranges in `model.js` or `simulate.py`.

## Run it

Open `index.html` in a browser. No install is needed.

Run the Python version with Python 3:

```
python simulate.py --startups 25 --bust 0.60 --home 0.005
```

Check the model in Node:

```
node -e "const PL=require('./model.js');console.log(PL.simulate(25,PL.probs(.6,.005),3000,42).median)"
```

## Put it on GitHub Pages

1. Create a repository named `power-law-lab` and upload all the files.
2. Go to Settings, then Pages. Choose "Deploy from a branch", pick `main` and `/ (root)`, and save.
3. After a minute, it's live at `https://YOUR-USERNAME.github.io/power-law-lab/`.

## Files

- `index.html`, `style.css`: page and styling, with automatic light and dark mode
- `model.js`: the simulation model
- `app.js`: charts and controls
- `simulate.py`: command-line version

## Ideas to extend it

- Add management fees and see how they change the odds
- Let users set their own outcome ranges
- Add a unit test comparing `model.js` and `simulate.py` results

Built by Hasini Talluri · [LinkedIn](https://www.linkedin.com/in/hasinitalluri/) · MIT License

