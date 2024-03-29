/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-undef */

function ms_to_next_skill(skill) {
    const next_skill = parent.next_skill[skill]
    if (next_skill == undefined) return 0
    const ms = parent.next_skill[skill].getTime() - Date.now()
    return ms < 0 ? 0 : ms
}
/*
async function moveLoop() {
    try {
        let nearest = get_nearest_monster()
        if (!is_in_range(nearest)) {
            // Move closer
            move(
                character.x + (nearest.x - character.x) / 2,
                character.y + (nearest.y - character.y) / 2
            )
        }
    } catch (e) {
        console.error(e)
    }
    setTimeout(moveLoop, 250)
}
moveLoop()
*/
async function lootLoop() {
    try {
        // The built in loot() does pretty much all of the work for us!
        loot()
    } catch (e) {
        console.error(e)
    }
    setTimeout(lootLoop, 250)
}
lootLoop()

setInterval(()=>{consumingPotions ()},250)
function consumingPotions (){
    //RESUPPLY POTIONS
    // only works when sufficient free slots,gold and an ancient computer is available 
    let potionsToBeUsed =['hpot0','hpot1','mpot0','mpot1']; // potions to be supplied
    let lastPotionBuy;
    let resupplyCycle = 60000; // check every min 
    if(lastPotionBuy == null || new Date() - lastPotionBuy > resupplyCycle){ // check once a minute
        for(potionID in potionsToBeUsed){ // check every potion
            let potionType = potionsToBeUsed[potionID]; 
            let numberOfPotions = num_items(potionType); // how many of the potions do we currently have
            if(numberOfPotions < 100){ // if we are below 100 potions buy new ones
                buy(potionType,200);
            }       
        }
        lastPotionBuy = new Date();
    }
    
    // USEAGE BELOW
	if(!character.rip){   // check if the character is dead
		if(new Date() > parent.next_potion){ // check for cooldown on potions
			if(character.ctype == 'priest' || 'rogue'){ // check if charater is a priest he can heal himself with a better ratio than hp pots so mp is more important
				if((character.max_mp-character.mp) > 500){ // use big mp pots when needed                     
                    parent.socket.emit("equip", { num: locate_item("mpot1")});
                    console.log(character.name +' restored 500 MP with MP Pot! next Potion ready in '+ parent.next_potion);
                }
				else if((character.max_mp-character.mp) > 300){ // use small mp pots when needed
                    parent.socket.emit("equip", { num: locate_item("mpot0")});
                    console.log(character.name +' restored 300 MP with MP Pot! next Potion ready in '+ parent.next_potion);
                }
				else if((character.max_hp-character.hp) > 400){ // use big hp pots when needed
                    parent.socket.emit("equip", { num: locate_item("hpot1")});
                    console.log(character.name +' restored 400 HP with HP Pot! next Potion ready in '+ parent.next_potion);
				}
				else if((character.max_hp-character.hp) > 200){ // use small hp pots when needed
                    parent.socket.emit("equip", { num: locate_item("hpot0")});  
                    console.log(character.name +' restored 200 HP with HP Pot! next Potion ready in '+ parent.next_potion);
				}
				else if((character.max_mp-character.mp) > 100){ // use mp without pots when needed
                    parent.socket.emit("use", { item: "mp"});
                    console.log(character.name +' restored 100 MP with MP Pot! next Potion ready in '+ parent.next_potion);
				}
				else if((character.max_hp-character.hp) > 50){ // use hp without pots when needed
                    parent.socket.emit("use", { item: "hp"});
                    console.log(character.name +' restored 50 HP with HP Pot! next Potion ready in '+ parent.next_potion);  
				}
			}
			else{ // if the character is not a priest hp is more important as mp
				if((character.max_hp-character.hp) > 400){  // use big hp pots when needed
                    parent.socket.emit("equip", { num: locate_item("hpot1")});
                    console.log(character.name +' restored 400 HP with HP Pot! next Potion ready in '+ parent.next_potion);
				}
				else if((character.max_hp-character.hp) > 200){ // use small hp pots when needed
                    parent.socket.emit("equip", { num: locate_item("hpot0")});
                    console.log(character.name +' restored 200 HP with HP Pot! next Potion ready in '+ parent.next_potion);
				}
				else if((character.max_mp-character.mp) > 500){ // use big mp pots when needed
                    parent.socket.emit("equip", { num: locate_item("mpot1")});
                    console.log(character.name +' restored 500 MP with MP Pot! next Potion ready in '+ parent.next_potion); 
				}
				else if((character.max_mp-character.mp) > 300){ // use small mp pots when needed
                    parent.socket.emit("equip", { num: locate_item("mpot0")});
                    console.log(character.name +' restored 300 MP with MP Pot! next Potion ready in '+ parent.next_potion);
				}
				else if((character.max_hp-character.hp) > 50){ // use hp without pots when needed
                    parent.socket.emit("use", { item: "hp"});
                    console.log(character.name +' restored 50 HP with HP Pot! next Potion ready in '+ parent.next_potion);
				}
				else if((character.max_mp-character.mp) > 100){ // use mp without pots when needed
                    parent.socket.emit("use", { item: "mp"});
                    console.log(character.name +' restored 100 MP with MP Pot! next Potion ready in '+ parent.next_potion);
				}
			}

		}
    }
    // Item count of an item in the characters inventory
    function num_items(name)
    {
	    var item_count = character.items.filter(item => item != null && item.name == name).reduce(function(a,b){ return a + (b["q"] || 1);
	    }, 0);
	
	    return item_count;
    }
}
setInterval(()=>{
	if(get_nearest_monster({target:"Biene"})==null){
		if(get_nearest_monster() != null){
			let abc=get_nearest_monster();
			move(abc.real_x,abc.real_y)
		}
	}
},100)
async function attackLoop() {
    try {    
        var nearest; 
		if(get_nearest_monster({target:'Biene'}) == null){nearest = get_nearest_monster()} 		
		else nearest = get_nearest_monster({target:'Biene'});
        if (!nearest) {
            set_message("No Monsters")
        } else if (can_attack(nearest)) {
            set_message("Attacking")
            await attack(nearest)
            /** NOTE: We're now reducing the cooldown based on the ping */
            reduce_cooldown("attack", Math.min(...parent.pings))
        }
    } catch (e) {
        console.error(e)
    }
    setTimeout(attackLoop, Math.max(1, ms_to_next_skill("attack")))
}
attackLoop()
//Extra range to add to a monsters attack range, to give a little more wiggle room to the algorithm.
var rangeBuffer = 50;

//How far away we want to consider monsters for
var calcRadius = 400;

//What types of monsters we want to try to avoid
var avoidTypes = ["jrat"];

var avoidPlayers = true;//Set to false to not avoid players at all
var playerBuffer = 30;//Additional Range around players
var avoidPlayersWhitelist = [];//Players want to avoid differently
var avoidPlayersWhitelistRange = 30; //Set to null here to not avoid whitelisted players
var playerRangeOverride = null; //Overrides how far to avoid, set to null to use player range.
var playerAvoidIgnoreClasses = ["merchant"];//Classes we don't want to try to avoid

//Tracking when we send movements to avoid flooding the socket and getting DC'd
var lastMove;

//Whether we want to draw the various calculations done visually
var drawDebug = false;

setInterval(function()
{
	
	
	if(drawDebug)
	{
		clear_drawings();
	}
	
	var goal = null;
	
	var phoenix;
	
	for(id in parent.entities)
	{
		var entity = parent.entities[id];
		
		if(entity.mtype == "phoenix")
		{
			goal = {x: entity.real_x, y: entity.real_y};
			break;
		}
	}
	
	//Try to avoid monsters, 
	var avoiding = avoidMobs(goal);
	
	if(!avoiding && goal != null)
	{
		if(lastMove == null || new Date() - lastMove > 100)
		{
			move(goal.x, goal.y);
			lastMove = new Date();
		}
	}
	
}, 25);

function avoidMobs(goal)
{
	var noGoal = false;
	
	if(goal == null || goal.x == null || goal.y == null)
	{
		noGoal = true;
	}
	
	if(drawDebug && !noGoal)
	{
		draw_circle(goal.x, goal.y, 25, 1, 0xDFDC22);
	}
	
	var maxWeight;
	var maxWeightAngle;
	var movingTowards = false;
	
	var monstersInRadius = getMonstersInRadius();
	
	var avoidRanges = getAnglesToAvoid(monstersInRadius);
	var inAttackRange = isInAttackRange(monstersInRadius);
	if(!noGoal)
	{
		var desiredMoveAngle = angleToPoint(character, goal.x, goal.y);

		

		var movingTowards = angleIntersectsMonsters(avoidRanges, desiredMoveAngle);

		var distanceToDesired = distanceToPoint(character.real_x, character.real_y, goal.x, goal.y);

		var testMovePos = pointOnAngle(character, desiredMoveAngle, distanceToDesired);
	
		if(drawDebug)
		{
			draw_line(character.real_x, character.real_y, testMovePos.x, testMovePos.y, 1, 0xDFDC22);
		}
	}
	
	
	//If we can't just directly walk to the goal without being in danger, we have to try to avoid it
	if(inAttackRange || movingTowards || (!noGoal && !can_move_to(goal.x, goal.y)))
	{
		//Loop through the full 360 degrees (2PI Radians) around the character
		//We'll test each point and see which way is the safest to  go
		for(i = 0; i < Math.PI*2; i += Math.PI/60)
		{
			var weight = 0;

			var position = pointOnAngle(character, i, 75);
			
			//Exclude any directions we cannot move to (walls and whatnot)
			if(can_move_to(position.x, position.y))
			{
				
				//If a direction takes us away from a monster that we're too close to, apply some pressure to that direction to make it preferred
				var rangeWeight = 0;
				var inRange = false;
				for(id in monstersInRadius)
				{
					var entity = monstersInRadius[id];
					var monsterRange = getRange(entity);

					var distToMonster = distanceToPoint(position.x, position.y, entity.real_x, entity.real_y);

					var charDistToMonster = distanceToPoint(character.real_x, character.real_y, entity.real_x, entity.real_y);

					if(charDistToMonster < monsterRange)
					{
						inRange = true;
					}

					if(charDistToMonster < monsterRange && distToMonster > charDistToMonster)
					{
						rangeWeight += distToMonster - charDistToMonster;
					}

				}

				if(inRange)
				{
					weight = rangeWeight;
				}
				
				//Determine if this direction would cause is to walk towards a monster's radius
				var intersectsRadius = angleIntersectsMonsters(avoidRanges, i);
				
				//Apply some selective pressure to this direction based on whether it takes us closer or further from our intended goal
				if(goal != null && goal.x != null && goal.y != null)
				{
					var tarDistToPoint = distanceToPoint(position.x, position.y, goal.x, goal.y);

					weight -= tarDistToPoint/10;
				}
				
				//Exclude any directions which would make us walk towards a monster's radius
				if(intersectsRadius === false)
				{
					//Update the current max weight direction if this one is better than the others we've tested
					if(maxWeight == null || weight > maxWeight)
					{
						maxWeight = weight;
						maxWeightAngle = i;
					}
				}
			}
		}
		
		//Move towards the direction which has been calculated to be the least dangerous
		var movePoint = pointOnAngle(character, maxWeightAngle, 20);

		if(lastMove == null || new Date() - lastMove > 100)
		{
			lastMove = new Date();
			move(movePoint.x, movePoint.y);
		}
		
		if(drawDebug)
		{
			draw_line(character.real_x, character.real_y, movePoint.x, movePoint.y, 2, 0xF20D0D);
		}
		
		return true;
	}
	else
	{
		return false;
	}
	
}

function getRange(entity)
{
	var monsterRange;
			
	if(entity.type != "character")
	{
			
		monsterRange = parent.G.monsters[entity.mtype].range + rangeBuffer;
	}
	else
	{
		if(avoidPlayersWhitelist.includes(entity.id) && avoidPlayersWhitelistRange != null)
		{
			monsterRange = avoidPlayersWhitelistRange;
		}
		else if(playerRangeOverride != null)
		{
			monsterRange = playerRangeOverride + playerBuffer;
		}
		else
		{
			monsterRange = entity.range + playerBuffer;
		}
	}
	
	return monsterRange;
}

function isInAttackRange(monstersInRadius)
{
	for(id in monstersInRadius)
	{
		var monster = monstersInRadius[id];
		var monsterRange = getRange(monster);
		
		var charDistToMonster = distanceToPoint(character.real_x, character.real_y, monster.real_x, monster.real_y);
		
		if(charDistToMonster < monsterRange)
		{
			return true;
		}
	}
	
	return false;
}

function angleIntersectsMonsters(avoidRanges, angle)
{
	for(id in avoidRanges)
	{
		var range = avoidRanges[id];

		var between = isBetween(range[1], range[0], angle);



		if(between)
		{
			return true;
		}
	}
	
	return false;
}

function getAnglesToAvoid(monstersInRadius)
{
	var avoidRanges = [];
	
	if(monstersInRadius.length > 0)
	{
		for(id in monstersInRadius)
		{
			var monster = monstersInRadius[id];
			
			var monsterRange = getRange(monster);
			
			var tangents = findTangents({x: character.real_x, y: character.real_y}, {x: monster.real_x, y: monster.real_y, radius: monsterRange});
			
			//Tangents won't be found if we're within the radius
			if(!isNaN(tangents[0].x))
			{
				var angle1 = angleToPoint(character, tangents[0].x, tangents[0].y);
				var angle2 = angleToPoint(character, tangents[1].x, tangents[1].y);

				if(angle1 < angle2)
				{
					avoidRanges.push([angle1, angle2]);
				}
				else
				{
					avoidRanges.push([angle2, angle1]);
				}
				if(drawDebug)
				{
					draw_line(character.real_x, character.real_y, tangents[0].x, tangents[0].y, 1, 0x17F20D);
					draw_line(character.real_x, character.real_y, tangents[1].x, tangents[1].y, 1, 0x17F20D);
				}
			}
			
			if(drawDebug)
			{
				draw_circle(monster.real_x, monster.real_y, monsterRange, 1, 0x17F20D);
			}
		}
	}
	
	return avoidRanges;
}

function getMonstersInRadius()
{
	var monstersInRadius = [];
	
	for(id in parent.entities)
	{
		var entity = parent.entities[id];
		var distanceToEntity = distanceToPoint(entity.real_x, entity.real_y, character.real_x, character.real_y);
		
		var range = getRange(entity);
		
		if(entity.type === "monster" && avoidTypes.includes(entity.mtype))
		{
			
			var monsterRange = getRange(entity);

			if(distanceToEntity < calcRadius)
			{
				monstersInRadius.push(entity);
			}
		}
		else
		{
			if(avoidPlayers && entity.type === "character" && !entity.npc && !playerAvoidIgnoreClasses.includes(entity.ctype))
			{
				if(!avoidPlayersWhitelist.includes(entity.id) || avoidPlayersWhitelistRange != null)
				{
					if(distanceToEntity < calcRadius || distanceToEntity < range)
					monstersInRadius.push(entity);
				}
			}
		}
	}
	
	return monstersInRadius;
}


function normalizeAngle(angle) {
    return Math.atan2(Math.sin(angle), Math.cos(angle));
}  

//Source: https://stackoverflow.com/questions/11406189/determine-if-angle-lies-between-2-other-angles
function isBetween(angle1, angle2, target)
{
	if(angle1 <= angle2) {
		if(angle2 - angle1 <= Math.PI) {
			return angle1 <= target && target <= angle2;
		} else {
			return angle2 <= target || target <= angle1;
		}
	} else {
		if(angle1 - angle2 <= Math.PI) {
			return angle2 <= target && target <= angle1;
		} else {
			return angle1 <= target || target <= angle2;
		}
	}
}

//Source: https://stackoverflow.com/questions/1351746/find-a-tangent-point-on-circle
function findTangents(point, circle)
{
	var dx = circle.x - point.x;
	var dy = circle.y - point.y;
	var dd = Math.sqrt(dx * dx + dy * dy);
	var a = Math.asin(circle.radius/dd);
	var b = Math.atan2(dy, dx);
	
	var t = b - a;
	
	var ta = {x:circle.x + (circle.radius * Math.sin(t)), y: circle.y + (circle.radius * -Math.cos(t))};
	
	t = b + a;
	var tb = {x: circle.x + circle.radius * -Math.sin(t), y: circle.y + circle.radius * Math.cos(t)}
	
	
	
	return [ta, tb];
}

function offsetToPoint(x, y)
{
	var angle = angleToPoint(x, y) + Math.PI/2;
	
	return angle - characterAngle();
	
}

function pointOnAngle(entity, angle, distance)
{
	var circX = entity.real_x + (distance * Math.cos(angle));
	var circY = entity.real_y + (distance * Math.sin(angle));
	
	return {x: circX, y: circY};
}

function entityAngle(entity)
{
	return (entity.angle * Math.PI)/180;
}

function angleToPoint(entity, x, y) {
    var deltaX = entity.real_x - x;
    var deltaY = entity.real_y - y;

    return Math.atan2(deltaY, deltaX) + Math.PI;
}

function characterAngle() {
    return (character.angle * Math.PI) / 180;
}

function distanceToPoint(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}
