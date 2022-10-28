setInterval(()=>{
	dispense_mluck()
	if(character.map != "cyberland"){
		if(!smart.moving){smart_move('cyberland')}}
	consumingPotions ();
	if(Object.values(parent.entities)
	   .filter(n=> n.type == "monster")
	   .filter(n => n.target == "Merchant001")
	   .length > 0)
	{send_cm('Mage001','Port')}
	if(Object.values(parent.entities)
	   .filter(n=> n.type == "monster")
	   .filter(n=> n.mtype == "mechagnome")
	   .filter(n=> n.target == null)
	   .length>3)
	{parent.socket.emit("eval", {command:"give spares"})
	parent.socket.emit("eval", {command:"attack"})}
},100)

async function dispense_mluck() {
    const chars = Object.values(parent.entities)
        .concat([character])
        .filter((e) => is_character(e) && is_in_range(e, "mluck"));

    for (const c of chars) {
        if (
            !c.s ||
            !c.s.mluck ||
            (c.s.mluck.f !== character.name && !c.s.mluck.strong) ||
            c.s.mluck.ms < minutes(30)
        ) {
            await use_skill("mluck", c.name);
            await sleep(5 + parent.next_skill["mluck"]);
        }
    }
}

function on_magiport(name) {
  if(name == "Mage001"){
        accept_magiport(name);
  }
  }

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
			if(character.ctype == 'priest'){ // check if charater is a priest he can heal himself with a better ratio than hp pots so mp is more important
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
                if((character.hp/character.max_hp)<0.75)
                {
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
				else{
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
