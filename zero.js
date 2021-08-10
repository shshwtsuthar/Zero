const mineflayer = require('mineflayer');
const pvp = require('mineflayer-pvp').plugin;
const {pathfinder,Movements,goals} = require('mineflayer-pathfinder');
const armorManager = require('mineflayer-armor-manager');

const bot = mineflayer.createBot({
    host:"swipebedrock.aternos.me",
    username:"Zero",
    logErrors: false
});

bot.loadPlugin(pvp);
bot.loadPlugin(armorManager);
bot.loadPlugin(pathfinder);

bot.on('playerCollect', (collector, itemDrop) => {
	if (collector !== bot.entity) 
	return
	setTimeout(() => {
		const sword = bot.inventory.items().find(item => item.name.includes('sword'))
		if (sword) bot.equip(sword, 'hand')
	},150)
})

bot.on('playerCollect', (collector, itemDrop) => {
  if (collector !== bot.entity) return

  setTimeout(() => {
    const shield = bot.inventory.items().find(item => item.name.includes('shield'))
    if (shield) bot.equip(shield, 'off-hand')
  }, 250)
})

bot.on('physicTick', () => {
  if (bot.pvp.target) return
  if (bot.pathfinder.isMoving()) return

  const entity = bot.nearestEntity()
  if (entity) bot.lookAt(entity.position.offset(0, entity.height, 0))
})

bot.on('chat', (username, message) => {
	if (message === 'fight me') {
    const player = bot.players[username]

    if (!player) {
      bot.chat("I can't see you.")
      return
    }

    bot.chat('Prepare to Fight!')
    bot.pvp.attack(player.entity)
  }

  if (message === 'stop') {
    bot.chat('Okay, Loser.')
    bot.pvp.stop()
  }
})

