
# Zero: A Collection of Minecraft Bots
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) ![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/shshwtsuthar/ZeroBot) ![GitHub package.json version](https://img.shields.io/github/package-json/v/shshwtsuthar/ZeroBot?color=orange)

This is a collection of Bots made with [Mineflayer](https://github.com/PrismarineJS/mineflayer) and [Node](https://nodejs.org). Mineflayer is a powerful, stable, and high level JavaScript API to create Minecraft bots.

## Installation
- You need to have Node installed on your machine to run this Project. If you don't have it installed, Download it from [here](https://nodejs.org/en/download/). After you run through the setup, type ```node -v``` and ```npm -v``` in your terminal to check the version installed. Keep in mind that the minimum version of Node required is v14.0.0.
- Clone this Repository on your machine using:

    ```git clone https://github.com/shshwtsuthar/ZeroBot```
- You will also need to install the Node Modules for this to work, so run:

    ```npm install mineflayer```

    ```npm install mineflayer-pathfinder```

    ```npm install mineflayer-pvp```

    ```npm install mineflayer-blockfinder```

    ```npm install mineflayer-armor-manager```

    This will install all the modules required for the Bot to function.

## Bot: Zero_0:
Zero_0 is a Bot to complete Minecraft. It uses a basic algorithm to find the quickest way possible to beat the game. It starts off by using the modernized version of the A* pathfinding algorithm, which it will use throughout its run to find the quickest route from A to B. It starts off by finding a Tree and breaks exactly 3 pieces of Wood. One thing that I consider most peculiar is that the Bot doesn't need to build a nether portal at the start of its run to obtain the eyes of Ender. Instead, it can reach the stronghold before going to the nether, as it will allow the bot to observe how many eyes of Ender does it require, so that it does not waste any time on getting extra, another advantage this will give is the fact that it wouldn't have to waste its time in finding a Lava pool.
[Work in Progress]

## Bot: Zero_1:
Zero_1 is a Bot used to practice PVP, it can equip Armour, and wield a Sword in order to fight the Enemy. 
