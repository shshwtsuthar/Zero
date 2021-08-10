"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PVP = void 0;
const mineflayer_pathfinder_1 = require("mineflayer-pathfinder");
const TimingSolver_1 = require("./TimingSolver");
const mineflayer_utils_1 = require("mineflayer-utils");
/**
 * The main pvp manager plugin class.
 */
class PVP {
    /**
     * Creates a new instance of the PVP plugin.
     *
     * @param bot - The bot this plugin is being attached to.
     */
    constructor(bot) {
        this.timeToNextAttack = 0;
        this.wasInRange = false;
        /**
         * How close the bot will attempt to get to the target when when pursuing it.
         */
        this.followRange = 2;
        /**
         * How far away the target entity must be to lose the target. Target entities further than this
         * distance from the bot will be considered defeated.
         */
        this.viewDistance = 128;
        /**
         * How close must the bot be to the target in order to try attacking it.
         */
        this.attackRange = 3.5;
        /**
         * The timing solver to use when deciding how long to wait before preforming another attack
         * after finishing an attack.
         *
         * // TODO Check for 'hasAtttackCooldown' feature. If feature not present, default to RandomTicks solver.
         */
        this.meleeAttackRate = new TimingSolver_1.MaxDamageOffset();
        this.bot = bot;
        this.movements = new mineflayer_pathfinder_1.Movements(bot, require('minecraft-data')(bot.version));
        this.bot.on('physicTick', () => this.update());
        this.bot.on('entityGone', e => { if (e === this.target)
            this.stop(); });
    }
    /**
     * Causes the bot to begin attacking an entity until it is killed or told to stop.
     *
     * @param target - The target to attack.
     */
    attack(target) {
        if (target === this.target)
            return;
        this.stop();
        this.target = target;
        this.timeToNextAttack = 0;
        if (!this.target)
            return;
        // @ts-expect-error
        const pathfinder = this.bot.pathfinder;
        if (this.movements)
            pathfinder.setMovements(this.movements);
        // @ts-expect-error The 'true' argument wasn't added to the typing until after 1.0.10 release.
        pathfinder.setGoal(new mineflayer_pathfinder_1.goals.GoalFollow(this.target, this.followRange), true);
        // @ts-expect-error
        this.bot.emit('startedAttacking');
    }
    /**
     * Stops attacking the current entity.
     */
    stop() {
        this.target = undefined;
        // @ts-expect-error
        const pathfinder = this.bot.pathfinder;
        pathfinder.setGoal(null);
        // @ts-expect-error
        this.bot.emit('stoppedAttacking');
    }
    /**
     * Called each tick to update attack timers.
     */
    update() {
        this.checkRange();
        if (!this.target)
            return;
        this.timeToNextAttack--;
        if (this.timeToNextAttack === -1)
            this.attemptAttack();
    }
    /**
     * Updates whether the bot is in attack range of the target or not.
     */
    checkRange() {
        if (!this.target)
            return;
        if (this.timeToNextAttack < 0)
            return;
        const dist = this.target.position.distanceTo(this.bot.entity.position);
        if (dist > this.viewDistance) {
            this.stop();
            return;
        }
        const inRange = dist <= this.attackRange;
        if (!this.wasInRange && inRange)
            this.timeToNextAttack = 0;
        this.wasInRange = inRange;
    }
    /**
     * Attempts to preform an attack on the target.
     */
    attemptAttack() {
        if (!this.target)
            return;
        if (!this.wasInRange) {
            this.timeToNextAttack = this.meleeAttackRate.getTicks(this.bot);
            return;
        }
        const queue = new mineflayer_utils_1.TaskQueue();
        const target = this.target;
        const shield = this.hasShield();
        if (shield) {
            queue.addSync(() => this.bot.deactivateItem());
            queue.add(cb => setTimeout(cb, 100));
        }
        queue.add(cb => {
            if (target !== this.target)
                throw 'Target changed!';
            this.bot.lookAt(this.target.position.offset(0, this.target.height, 0), true, cb);
        });
        queue.addSync(() => {
            if (target !== this.target)
                throw 'Target changed!';
            this.bot.attack(this.target);
            // @ts-expect-error
            this.bot.emit('attackedTarget');
        });
        if (shield) {
            queue.add(cb => setTimeout(cb, 150));
            queue.addSync(() => {
                if (target !== this.target)
                    throw 'Target changed!';
                if (this.hasShield())
                    // @ts-expect-error TODO Mineflayer is missing the parameter in d.ts in version 2.30.0
                    this.bot.activateItem(true);
            });
        }
        queue.runAll((err) => {
            if (!err)
                this.timeToNextAttack = this.meleeAttackRate.getTicks(this.bot);
        });
    }
    /**
     * Check if the bot currently has a shield equipped.
     */
    hasShield() {
        if (this.bot.supportFeature('doesntHaveOffHandSlot'))
            return false;
        const slot = this.bot.inventory.slots[this.bot.getEquipmentDestSlot('off-hand')];
        if (!slot)
            return false;
        return slot.name.includes('shield');
    }
}
exports.PVP = PVP;
