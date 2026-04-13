#!/usr/bin/env node 

const https = require('https');
const readline = require('readline');

// ================= API =================
function fetchJSON(url) {
    return new Promise((resolve, reject) => {
        https.get(url, res => {
            let data = '';

            if (res.statusCode >= 400) {
                res.resume();
                return reject(new Error(`Request failed with status ${res.statusCode}`));
            }

            res.on('data', chunk => data += chunk);

            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (err) {
                    reject(err);
                }
            });
        }).on('error', reject);
    });
}

// ================= UTILS =================
function pickRandom(array, n) {
    const copy = array.slice();
    const result = [];

    for (let i = 0; i < n && copy.length > 0; i++) {
        const index = Math.floor(Math.random() * copy.length);
        result.push(copy[index]);
        copy.splice(index, 1);
    }

    return result;
}

// ================= DATA =================
async function getPokemonData(name) {
    const url = `https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}`;
    return fetchJSON(url);
}

async function getMoveData(url) {
    return fetchJSON(url);
}

// ================= MOVES =================
async function getMoves(pokemonData) {
    const allMoves = pokemonData.moves.map(m => m.move);
    const randomMoves = pickRandom(allMoves, 20);
    const finalMoves = [];

    for (const move of randomMoves) {
        if (finalMoves.length >= 5) break;

        const data = await getMoveData(move.url);

        if (data.power) {
            finalMoves.push({
                name: data.name,
                power: data.power,
                accuracy: data.accuracy || 100,
                pp: Math.floor(Math.random() * 10) + 5 // random PP (5-15)
            });
        }
    }

    return finalMoves;
}

// ================= GAME =================
function doesHit(accuracy) {
    return Math.random() * 100 <= accuracy;
}

// ================= MAIN =================
async function main() {

    console.log('==============================');
    console.log('🎮 Pokémon Battle Game!');
    console.log('Both players start with 300 HP');
    console.log('==============================\n');

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    const ask = (q) => new Promise(res => rl.question(q, ans => res(ans.trim())));

    // Load Pokémon list
    let allPokemon;
    try {
        allPokemon = await fetchJSON('https://pokeapi.co/api/v2/pokemon?limit=1000');
    } catch (e) {
        console.log('Error loading Pokémon list');
        rl.close();
        return;
    }

    // Player choice
    let playerName = await ask('Choose your Pokémon: ');
    if (!playerName) playerName = 'pikachu';

    let playerData;
    try {
        playerData = await getPokemonData(playerName);
    } catch {
        console.log('Invalid Pokémon, using Pikachu.');
        playerData = await getPokemonData('pikachu');
    }

    // Bot choice
    const botChoice = pickRandom(allPokemon.results, 1)[0];
    const botData = await getPokemonData(botChoice.name);

    console.log(`\nYou: ${playerData.name}`);
    console.log(`Bot: ${botData.name}\n`);

    console.log('Loading moves...');
    const playerMoves = await getMoves(playerData);
    const botMoves = await getMoves(botData);

    console.log('\nYour moves:');
    playerMoves.forEach((m, i) => {
        console.log(`${i + 1}. ${m.name} (Power:${m.power}, Acc:${m.accuracy}, PP:${m.pp})`);
    });

    let playerHP = 300;
    let botHP = 300;
    let turn = 1;

    while (playerHP > 0 && botHP > 0) {

        console.log(`\n--- Turn ${turn} ---`);
        console.log(`❤️ You: ${playerHP} | 🤖 Bot: ${botHP}`);

        // Show moves
        playerMoves.forEach((m, i) => {
            console.log(`${i + 1}. ${m.name} (PP:${m.pp})`);
        });

        let moveIndex = parseInt(await ask('Choose move: ')) - 1;

        if (isNaN(moveIndex) || !playerMoves[moveIndex]) {
            console.log('Invalid move!');
            continue;
        }

        const playerMove = playerMoves[moveIndex];
        const botMove = pickRandom(botMoves, 1)[0];

        console.log(`\nYou used ${playerMove.name}`);

        // PP rule
        if (playerMove.pp <= 0) {
            console.log('No PP left!');
        } else if (playerMove.pp < botMove.pp) {
            console.log('Attack blocked (PP lower than bot)');
        } else if (doesHit(playerMove.accuracy)) {
            const damage = playerMove.power;
            botHP = Math.max(0, botHP - damage);
            console.log(`Hit! -${damage} HP`);
        } else {
            console.log('Missed!');
        }

        playerMove.pp--;

        if (botHP <= 0) {
            console.log('\n🏆 You win!');
            break;
        }

        // Bot turn
        console.log(`\nBot used ${botMove.name}`);

        if (botMove.pp <= 0) {
            console.log('Bot has no PP!');
        } else if (botMove.pp < playerMove.pp) {
            console.log('Bot attack blocked!');
        } else if (doesHit(botMove.accuracy)) {
            const damage = botMove.power;
            playerHP = Math.max(0, playerHP - damage);
            console.log(`You lost ${damage} HP`);
        } else {
            console.log('Bot missed!');
        }

        botMove.pp--;

        if (playerHP <= 0) {
            console.log('\n💀 You lost!');
            break;
        }

        turn++;
    }

    rl.close();
    console.log('\nGame Over');
}


main();