const mineflayer = require('mineflayer');
const blockfinder = require('mineflayer-blockfinder')(mineflayer);
const pathfinder = require('mineflayer-pathfinder').pathfinder;
const {GoalNear} = require('mineflayer-pathfinder').goals

var bot = mineflayer.createBot({host:'swipebedrock.aternos.me',username:'SpeedBot'});

bot.loadPlugin(blockfinder);
bot.loadPlugin(pathfinder);

bot.once('spawn',function(){
	bot.findBlock({
		point:bot.entity.position,
		matching:[37,38,39,40,41,42],
		maxDistance:100,
		count:3,
	},

	function(err, arrayOfBlocks){
		if(err){
			bot.chat('Error trying to find Wood: ' + err);
			return 0;
			}
		if(arrayOfBlocks.length){
			bot.chat('Found Wood, it is near Me!');
			bot.pathfinder.goto(new GoalNear(arrayOfBlocks[0].position.x,arrayOfBlocks[0].position.y,arrayOfBlocks[0].position.z));
			bot.chat('Reached Wood!');
			var recipe_plank = bot.recipesFor(183,null,3,null);
			bot.craft(recipe_plank,3,null);
			bot.equip(39,null);
			return 0;
			}
		else{
			bot.chat("Couldn't find Wood");
			return 0;
			}
	})
});

