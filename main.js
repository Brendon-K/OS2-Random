$(document).ready(function() {
	var genders = [
		["Male", 0],
		["Female", 0]
	];

	var races = [
		["Dwarf", 0],
		["Elf", 0],
		["Human", 0],
		["Lizard", 0],
		["Undead Dwarf", 0],
		["Undead Elf", 0],
		["Undead Human", 0],
		["Undead Lizard", 0]
	];

	var attributes = [
		["Strength", 10],
		["Finesse", 10],
		["Intelligence", 10],
		["Constitution", 10],
		["Memory", 10],
		["Wits", 10]
	];

	var combatAbilities = [
		["Warfare", 0],
		["Huntsman", 0],
		["Scoundrel", 0],
		["Pyrokinetic", 0],
		["Hydrosophist", 0],
		["Aerotheurge", 0],
		["Geomancer", 0],
		["Necromancer", 0],
		["Summoning", 0],
		["Polymorph", 0],
		["Single-Handed", 0],
		["Two-Handed", 0],
		["Ranged", 0],
		["Dual Wielding", 0],
		["Retribution", 0],
		["Leadership", 0],
		["Perserverance", 0]
	];

	var civilAbilities = [
		["Telekinesis", 0],
		["Loremaster", 0],
		["Sneaking", 0],
		["Thievery", 0],
		["Bartering", 0],
		["Persuasion", 0],
		["Lucky Charm", 0]
	];

	var talents = [
		["All Skilled Up", 0, 1], //Level 2
		["Bigger and Better", 0, 1], //Level 2
		["Ambidextrous", 0, 0],
		["Arrow Recovery", 0, 0],
		["Comeback Kid", 0, 0],
		["Elemental Affinity", 0, 0],
		["Escapist", 0, 0],
		["Far Out Man", 0, 0],
		["Five-Star Diner", 0, 0],
		["Glass Cannon", 0, 1], //Incompatible with Lone Wolf
		["Guerrilla", 0, 0],
		["Hothead", 0, 0],
		["Leech", 0, 0],
		["Living Armor", 0, 0],
		["Lone Wolf", 0, 1], //Incompatible with Glass Cannon
		["Mnemonic", 0, 0],
		["Morning Person", 0, 0],
		["Opportunist", 0, 0],
		["Parry Master", 0, 0],
		["Pet Pal", 0, 0],
		["Savage Sortilege", 0, 0],
		["Slingshot", 0, 0],
		["Stench", 0, 0],
		["Torturer", 0, 0],
		["Unstable", 0, 0],
		["Walk it Off", 0, 0],
		["What a Rush", 0, 0],
		["Demon", 0, 1], //Pyrokinetic 1
		["Duck Duck Goose", 0, 1], //Huntsman 1
		["Elemental Ranger", 0, 1], //Huntsman 1
		["Executioner", 0, 1], //Warfare 1
		["Picture of Health", 0, 1], //Warfare 1
		["Ice King", 0, 1], //Hydrosophist 1
		["The Pawn", 0, 1] //Scoundrel 1
	];

	var tags = [
		["Barbarian", 0],
		["Jester", 0],
		["Mystic", 0],
		["Noble", 0],
		["Outlaw", 0],
		["Scholar", 0],
		["Soldier", 0]
	];

	//var level = 1;

	//Set a random element of a 2D array to active
	function randElement(array) {
		var n = Math.floor(Math.random() * array.length);
		return n;
	}

	//Randomize Gender
	function randGender() {
		var n = randElement(genders);
		genders[n][1] = 1;
		$("#gender").text(genders[n][0]);
	}

	//Randomize Race
	function randRace() {
		var n = randElement(races);
		races[n][1] = 1;
		$("#race").text(races[n][0]);
	}

	//Choose two tags for character creation
	function randTags() {
		for (var i = 0; i < 2; i++) {
			var n = randElement(tags);
			tags[n][1] = 1;
		}
		for (var i = 0; i < tags.length; i++) {
			if (tags[i][1] > 0) {
				$("#tags").append(tags[i][0] + " ");
			}
		}
	}

	function addTalent() {
		var valid = false;
		do {
			var n = Math.floor(Math.random() * talents.length);
			//Make sure the chosen talent is actually available
			if (talents[n][1] < 1) {
				//Make sure the chosen talent has no pre-reqs
				if (talents[n][2] == 0) {
					valid = true;
					//Add extra memory if Mnemonic is chosen
					if (n == 15) {
						attributes[4][1] += 3;
					}
				} else {
					switch (n) {
						//All Skilled Up
						case 0:
						//Bigger and Better
						case 1:
							//Make sure character is at least level 2
							if (level >= 2) {
								valid = true;
								//Add extra ability points for All Skilled Up
								if (n == 0) {
									allocateCombatAbilities(1);
									allocateCivilAbilities(1);
								}
								//Add extra attribute points for Bigger and Better
								if (n == 1) {
									allocateAttributes(2);
								}
							}
							break;
						//Glass Cannon
						case 9:
							//Make sure Lone Wolf hasn't been taken
							if (talents[14][1] == 0) {
								valid = true;
							}
							break;
						//Lone Wolf
						case 14:
							//Make sure Glass Cannon hasn't been taken
							if (talents[9][1] == 0) {
								valid = true;
							}
							break;
						//Demon
						case 27:
							//Make sure Pyrokinetic is at least 1
							if (combatAbilities[3][1] >= 1) {
								valid = true;
							}
							break;
						//Duck Duck Goose
						case 28:
						//Elemental Ranger
						case 29:
							//Make sure Huntsman is at least 1
							if (combatAbilities[1][1] >= 1) {
								valid = true;
							}
							break;
						//Executioner
						case 30:
						//Picture of Health
						case 31:
							//Make sure Warfare is at least 1
							if (combatAbilities[0][1] >= 1) {
								valid = true;
							}
							break;
						//Ice King
						case 32:
							//Make sure Hydrosophist is at least 1
							if (combatAbilities[4][1] >= 1) {
								valid = true;
							}
							break;
						//The Pawn
						case 33:
							//Make sure Scoundrel is at least 1
							if (combatAbilities[2][1] >= 1) {
								valid = true;
							}
							break;
						default:
							console.log("Could not find pre-req...");
							console.log(talents[n][0]);
							break;
						}
					}
				if (valid) {
					talents[n][1] = 1;
				}
			}
		} while (!valid);
	}

	function allocateAttributes(points) {
		for (var i = 0; i < points; i++) {
			var n = randElement(attributes);
			attributes[n][1]++;
		}
	}

	function allocateCombatAbilities(points) {
		for (var i = 0; i < points; i++) {
			var n = randElement(combatAbilities);
			combatAbilities[n][1]++;

			//Add 1 skill point for polymorph
			if (n == 9) {
				allocateAttributes(1);
			}
		}
	}

	function allocateCivilAbilities(points) {
		for (var i = 0; i < points; i++) {
			var n = randElement(civilAbilities);
			civilAbilities[n][1]++;
		}
	}

	function setAttributeTags() {
		$("#strength").text(attributes[0][1]);
		$("#finesse").text(attributes[1][1]);
		$("#intelligence").text(attributes[2][1]);
		$("#constitution").text(attributes[3][1]);
		$("#memory").text(attributes[4][1]);
		$("#wits").text(attributes[5][1]);
	}

	function setCombatAbilityTags() {
		$("#warfare").text(combatAbilities[0][1]);
		$("#huntsman").text(combatAbilities[1][1]);
		$("#scoundrel").text(combatAbilities[2][1]);
		$("#pyrokinetic").text(combatAbilities[3][1]);
		$("#hydrosophist").text(combatAbilities[4][1]);
		$("#aerotheurge").text(combatAbilities[5][1]);
		$("#geomancer").text(combatAbilities[6][1]);
		$("#necromancer").text(combatAbilities[7][1]);
		$("#summoning").text(combatAbilities[8][1]);
		$("#polymorph").text(combatAbilities[9][1]);
		$("#singleHanded").text(combatAbilities[10][1]);
		$("#twoHanded").text(combatAbilities[11][1]);
		$("#ranged").text(combatAbilities[12][1]);
		$("#dualWielding").text(combatAbilities[13][1]);
		$("#retribution").text(combatAbilities[14][1]);
		$("#leadership").text(combatAbilities[15][1]);
		$("#perserverance").text(combatAbilities[16][1]);
	}

	function setCivilAbilityTags() {
		$("#telekinesis").text(civilAbilities[0][1]);
		$("#loremaster").text(civilAbilities[1][1]);
		$("#sneaking").text(civilAbilities[2][1]);
		$("#thievery").text(civilAbilities[3][1]);
		$("#bartering").text(civilAbilities[4][1]);
		$("#persuasion").text(civilAbilities[5][1]);
		$("#luckyCharm").text(civilAbilities[6][1]);
	}

	function setRacialTalentTags() {
		if (races[0][1] == 1) {
			$("#talentsOwned").append("Sturdy" + "<br />");
			$("#talentsOwned").append("Dwarven Guile" + "<br />");
		}
		if (races[1][1] == 1) {
			$("#talentsOwned").append("Corpse Eater" + "<br />");
			$("#talentsOwned").append("Ancestral Knowledge" + "<br />");
		}
		if (races[2][1] == 1) {
			$("#talentsOwned").append("Ingenious" + "<br />");
			$("#talentsOwned").append("Thrifty" + "<br />");
		}
		if (races[3][1] == 1) {
			$("#talentsOwned").append("Sophisticated" + "<br />");
			$("#talentsOwned").append("Spellsong" + "<br />");
		}
		if (races[4][1] == 1) {
			$("#talentsOwned").append("Undead" + "<br />");
			$("#talentsOwned").append("Sturdy" + "<br />");
		}
		if (races[5][1] == 1) {
			$("#talentsOwned").append("Undead" + "<br />");
			$("#talentsOwned").append("Corpse Eater" + "<br />");
		}
		if (races[6][1] == 1) {
			$("#talentsOwned").append("Undead" + "<br />");
			$("#talentsOwned").append("Ingenious" + "<br />");
		}
		if (races[7][1] == 1) {
			$("#talentsOwned").append("Undead" + "<br />");
			$("#talentsOwned").append("Sophisticated" + "<br />");
		}
	}

	function setTalentTags() {
		for (var i = 0; i < talents.length; i++) {
			//Only add the talent to the talent list if you actually have it
			if (talents[i][1] == 1) {
				$("#talentsOwned").append(talents[i][0] + "<br />");
			}
		}
	}

	function setTags() {
		setAttributeTags();
		setCombatAbilityTags();
		setCivilAbilityTags();
		setRacialTalentTags();
		setTalentTags();
	}

	//Randomize all stats for level 1
	function randLevelOne() {
		var attributePoints = 2;
		var combatPoints = 2;
		var civilPoints = 1;

		randGender();
		randRace();
		randTags();

		allocateCombatAbilities(combatPoints);
		allocateCivilAbilities(civilPoints);
		addTalent();
		allocateAttributes(attributePoints);
	}

	//Randomize a level up
	function randLevelUp() {
		for (var i = 1; i < $("#level").val(); i++) {
			allocateAttributes(2);
			allocateCombatAbilities(1);
			//Add a Civil Ability point at the correct levels
			switch (i) {
				case 2:
				case 6:
				case 10:
				case 14:
				case 18:
				case 22:
				case 26:
				case 30:
				case 34:
					allocateCivilAbilities(1);
					break;
				default:
					break;
			}
			//Add a Talent at the correct levels
			switch (i) {
				case 3:
				case 8:
				case 13:
				case 18:
				case 23:
				case 28:
				case 33:
					addTalent();
					break;
				default:
					break;
			}
		}
	}

	function reset() {
		//Reset genders
		for (var i = 0; i < genders.length; i++) {
			genders[i][1] = 0;
		}
		//reset races
		for (var i = 0; i < races.length; i++) {
			races[i][1] = 0;
		}
		//reset attributes
		for (var i = 0; i < attributes.length; i++) {
			attributes[i][1] = 10;
		} 
		//reset Combat Abilities
		for (var i = 0; i < combatAbilities.length; i++) {
			combatAbilities[i][1] = 0;
		}
		//reset Civil Abilities
		for (var i = 0; i < civilAbilities.length; i++) {
			civilAbilities[i][1] = 0;
		}
		//reset Talents
		for (var i = 0; i < talents.length; i++) {
			talents[i][1] = 0;
		}
		//reset character tags
		for (var i = 0; i < tags.length; i++) {
			tags[i][1] = 0;
		}
		$("#tags").text("");
		$("#talentsOwned").text("");
	}

	//Do this code when the button is pressed
	$(".randomButton").on("click", function() {
		reset();
		randLevelOne();
		randLevelUp();
		setTags();
	});

})