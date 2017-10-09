$(document).ready(function() {
	var appearance;
	var character;

	$.getJSON('https://raw.githubusercontent.com/Brendon-K/OS2-Random/master/character.json', function(data) {
		character = data;
		randLevelOne();
		setTags();
	});

	$.getJSON('https://raw.githubusercontent.com/Brendon-K/OS2-Random/master/appearance.json', function(data) {
		appearance = data;
		console.log(appearance[0].skinColors);
		randAppearance();
	});

	//Set a random element of a 2D array to active
	function randElement(array) {
		var n = Math.floor(Math.random() * array.length);
		return n;
	}

	//Randomize Gender
	function randGender() {
		var n = randElement(character.genders);
		character.genders[n][1] = 1;
		$("#gender").text(character.genders[n][0]);
	}

	//Randomize Race
	function randRace() {
		var n = randElement(character.races);
		character.races[n][1] = 1;
		$("#race").text(character.races[n][0]);

		//Adjust stats per race
		switch (n) {
			//Dwarf
			case 0:
				//+1 Sneaking
				character.civilAbilities[2][1]++;
				break;
			//Elf
			case 1:
				//+1 Loremaster
				character.civilAbilities[1][1]++;
				break;
			//Human
			case 2:
				//+1 Bartering
				character.civilAbilities[4][1]++;
				break;
			//Lizard
			case 3:
				//+1 Persuasion
				character.civilAbilities[5][1]++;
				break;
			//Undead Dwarf
			case 4:
			//Undead Elf
			case 5:
			//Undead Human
			case 6:
			//Undead Lizard
			case 7:
				break;
			default:
				console.log("Invalid Race");
				console.log("Race index: " + n);
				break;
		}
	}

	function randAppearance() {
		var n;
		for (var i = 0; i < character.races.length; i++) {
			if (character.races[i][1] == 1) {
				//Randomize skin color
				n = randElement(appearance[i].skinColors);
				$("#skinColor").text(appearance[i].skinColors[n]);
				//Randomize face
				n = randElement(appearance[i].face);
				$("#face").text(appearance[i].face[n]);
				//Randomize hair style
				n = randElement(appearance[i].hairStyle);
				$("#hairStyle").text(appearance[i].hairStyle[n]);
				//Randomize hair color
				n = randElement(appearance[i].hairColor);
				$("#hairColor").text(appearance[i].hairColor[n]);
				//Randomize facial features
				n = randElement(appearance[i].facialFeatures);
				$("#facialFeatures").text(appearance[i].facialFeatures[n]);
				//Randomize voice
				n = randElement(appearance[i].voice);
				$("#voice").text(appearance[i].voice[n]);
			}
		}
	}

	//Choose two tags for character creation
	function randTags() {
		for (var i = 0; i < 2; i++) {
			var n = randElement(character.tags);
			character.tags[n][1] = 1;
		}
		for (var i = 0; i < character.tags.length; i++) {
			if (character.tags[i][1] > 0) {
				$("#tags").append(character.tags[i][0] + " ");
			}
		}
	}

	function addTalent() {
		var valid = false;
		do {
			var n = Math.floor(Math.random() * character.talents.length);
			//Make sure the chosen talent is actually available
			if (character.talents[n][1] < 1) {
				//Make sure the chosen talent has no pre-reqs
				if (character.talents[n][2] == 0) {
					valid = true;
					//Add extra memory if Mnemonic is chosen
					if (n == 15) {
						character.attributes[4][1] += 3;
					}
				} else {
					switch (n) {
						//All Skilled Up
						case 0:
						//Bigger and Better
						case 1:
							//Make sure character is at least level 2
							if (character.level >= 2) {
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
							if (character.talents[14][1] == 0) {
								valid = true;
							}
							break;
						//Lone Wolf
						case 14:
							//Make sure Glass Cannon hasn't been taken
							if (character.talents[9][1] == 0) {
								valid = true;
							}
							break;
						//Demon
						case 27:
							//Make sure Pyrokinetic is at least 1
							if (character.combatAbilities[3][1] >= 1) {
								valid = true;
							}
							break;
						//Duck Duck Goose
						case 28:
						//Elemental Ranger
						case 29:
							//Make sure Huntsman is at least 1
							if (character.combatAbilities[1][1] >= 1) {
								valid = true;
							}
							break;
						//Executioner
						case 30:
						//Picture of Health
						case 31:
							//Make sure Warfare is at least 1
							if (character.combatAbilities[0][1] >= 1) {
								valid = true;
							}
							break;
						//Ice King
						case 32:
							//Make sure Hydrosophist is at least 1
							if (character.combatAbilities[4][1] >= 1) {
								valid = true;
							}
							break;
						//The Pawn
						case 33:
							//Make sure Scoundrel is at least 1
							if (character.combatAbilities[2][1] >= 1) {
								valid = true;
							}
							break;
						default:
							console.log("Could not find pre-req...");
							console.log(character.talents[n][0]);
							break;
						}
					}
				if (valid) {
					character.talents[n][1] = 1;
				}
			}
		} while (!valid);
	}

	function allocateAttributes(points) {
		for (var i = 0; i < points; i++) {
			var n = randElement(character.attributes);
			character.attributes[n][1]++;
		}
	}

	function allocateCombatAbilities(points) {
		for (var i = 0; i < points; i++) {
			var n = randElement(character.combatAbilities);
			character.combatAbilities[n][1]++;

			//Add 1 skill point for polymorph
			if (n == 9) {
				allocateAttributes(1);
			}
		}
	}

	function allocateCivilAbilities(points) {
		for (var i = 0; i < points; i++) {
			var n = randElement(character.civilAbilities);
			character.civilAbilities[n][1]++;
		}
	}

	function setLevelTag() {
		$("#currentLevel").text(character.level);
	}

	function setIdTags() {
		//Set Gender tag
		for (var i = 0; i < character.genders.length; i++) {
			if (character.genders[i][1] == 1) {
				$("#gender").text(character.genders[i][0]);
			}
		}
		//Set Race tag
		for (var i = 0; i < character.races.length; i++) {
			if (character.races[i][1] == 1) {
				$("#race").text(character.races[i][0]);
			}
		}
		//Set Tags tag
		$("#tags").text("");
		for (var i = 0; i < character.tags.length; i++) {
			if (character.tags[i][1] == 1) {
				$("#tags").append(character.tags[i][0] + " ");
			}
		}
	}

	function setAttributeTags() {
		$("#strength").text(character.attributes[0][1]);
		$("#finesse").text(character.attributes[1][1]);
		$("#intelligence").text(character.attributes[2][1]);
		$("#constitution").text(character.attributes[3][1]);
		$("#memory").text(character.attributes[4][1]);
		$("#wits").text(character.attributes[5][1]);
	}

	function setCombatAbilityTags() {
		$("#warfare").text(character.combatAbilities[0][1]);
		$("#huntsman").text(character.combatAbilities[1][1]);
		$("#scoundrel").text(character.combatAbilities[2][1]);
		$("#pyrokinetic").text(character.combatAbilities[3][1]);
		$("#hydrosophist").text(character.combatAbilities[4][1]);
		$("#aerotheurge").text(character.combatAbilities[5][1]);
		$("#geomancer").text(character.combatAbilities[6][1]);
		$("#necromancer").text(character.combatAbilities[7][1]);
		$("#summoning").text(character.combatAbilities[8][1]);
		$("#polymorph").text(character.combatAbilities[9][1]);
		$("#singleHanded").text(character.combatAbilities[10][1]);
		$("#twoHanded").text(character.combatAbilities[11][1]);
		$("#ranged").text(character.combatAbilities[12][1]);
		$("#dualWielding").text(character.combatAbilities[13][1]);
		$("#retribution").text(character.combatAbilities[14][1]);
		$("#leadership").text(character.combatAbilities[15][1]);
		$("#perserverance").text(character.combatAbilities[16][1]);
		$("#weapons").text(character.combatAbilities[10][1]+character.combatAbilities[11][1]+character.combatAbilities[12][1]+character.combatAbilities[13][1]);
		$("#defence").text(character.combatAbilities[14][1]+character.combatAbilities[15][1]+character.combatAbilities[16][1]);
		$("#skills").text(character.combatAbilities[0][1]+character.combatAbilities[1][1]+character.combatAbilities[2][1]+character.combatAbilities[3][1]+character.combatAbilities[4][1]+character.combatAbilities[5][1]+character.combatAbilities[6][1]+character.combatAbilities[7][1]+character.combatAbilities[8][1]+character.combatAbilities[9][1])
	}

	function setCivilAbilityTags() {
		$("#telekinesis").text(character.civilAbilities[0][1]);
		$("#loremaster").text(character.civilAbilities[1][1]);
		$("#sneaking").text(character.civilAbilities[2][1]);
		$("#thievery").text(character.civilAbilities[3][1]);
		$("#bartering").text(character.civilAbilities[4][1]);
		$("#persuasion").text(character.civilAbilities[5][1]);
		$("#luckyCharm").text(character.civilAbilities[6][1]);
		$("#personality").text(character.civilAbilities[4][1]+character.civilAbilities[5][1]+character.civilAbilities[6][1]);
		$("#craftsmanship").text(character.civilAbilities[0][1]+character.civilAbilities[1][1]);
		$("#nastyDeeds").text(character.civilAbilities[2][1]+character.civilAbilities[3][1]);
	}

	function setRacialTalentTags() {
		if (character.races[0][1] == 1) {
			$("#talentsOwned").append("Sturdy" + "<br />");
			$("#talentsOwned").append("Dwarven Guile" + "<br />");
		}
		if (character.races[1][1] == 1) {
			$("#talentsOwned").append("Corpse Eater" + "<br />");
			$("#talentsOwned").append("Ancestral Knowledge" + "<br />");
		}
		if (character.races[2][1] == 1) {
			$("#talentsOwned").append("Ingenious" + "<br />");
			$("#talentsOwned").append("Thrifty" + "<br />");
		}
		if (character.races[3][1] == 1) {
			$("#talentsOwned").append("Sophisticated" + "<br />");
			$("#talentsOwned").append("Spellsong" + "<br />");
		}
		if (character.races[4][1] == 1) {
			$("#talentsOwned").append("Undead" + "<br />");
			$("#talentsOwned").append("Sturdy" + "<br />");
		}
		if (character.races[5][1] == 1) {
			$("#talentsOwned").append("Undead" + "<br />");
			$("#talentsOwned").append("Corpse Eater" + "<br />");
		}
		if (character.races[6][1] == 1) {
			$("#talentsOwned").append("Undead" + "<br />");
			$("#talentsOwned").append("Ingenious" + "<br />");
		}
		if (character.races[7][1] == 1) {
			$("#talentsOwned").append("Undead" + "<br />");
			$("#talentsOwned").append("Sophisticated" + "<br />");
		}
	}

	function setTalentTags() {
		$("#talentsOwned").text("");
		setRacialTalentTags();
		for (var i = 0; i < character.talents.length; i++) {
			//Only add the talent to the talent list if you actually have it
			if (character.talents[i][1] == 1) {
				$("#talentsOwned").append(character.talents[i][0] + "<br />");
			}
		}
	}

	function setTags() {
		setIdTags();
		setLevelTag();
		setAttributeTags();
		setCombatAbilityTags();
		setCivilAbilityTags();
		setRacialTalentTags();
		setTalentTags();
	}

	//Randomize all stats for level 1
	function randLevelOne() {
		character.level = 1;
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
	function randSetLevel() {
		for (var i = 1; i < $("#level").val(); i++) {
			randLevelUp();
		}
	}

	function randLevelUp() {
		if (character.level < 50) {
			character.level++;
			allocateAttributes(2);
			allocateCombatAbilities(1);
			//Add a Civil Ability point at the correct levels
			switch (character.level) {
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
			switch (character.level) {
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
		character.level = 1;
		//Reset genders
		for (var i = 0; i < character.genders.length; i++) {
			character.genders[i][1] = 0;
		}
		//reset races
		for (var i = 0; i < character.races.length; i++) {
			character.races[i][1] = 0;
		}
		//reset attributes
		for (var i = 0; i < character.attributes.length; i++) {
			character.attributes[i][1] = 10;
		} 
		//reset Combat Abilities
		for (var i = 0; i < character.combatAbilities.length; i++) {
			character.combatAbilities[i][1] = 0;
		}
		//reset Civil Abilities
		for (var i = 0; i < character.civilAbilities.length; i++) {
			character.civilAbilities[i][1] = 0;
		}
		//reset Talents
		for (var i = 0; i < character.talents.length; i++) {
			character.talents[i][1] = 0;
		}
		//reset character tags
		for (var i = 0; i < character.tags.length; i++) {
			character.tags[i][1] = 0;
		}
		$("#tags").text("");
		$("#talentsOwned").text("");
	}

	function saveCharacter() {
		var save = JSON.stringify(character);
		alert(save);
	}

	function loadCharacter() {
		var load = prompt("Enter character string", "");
		load = JSON.parse(load);
		//load level
		character.level = load.level;
		//load gender
		for (var i = 0; i < character.genders.length; i++) {
			character.genders[i][1] = load.genders[i][1];
		}
		//reset races
		for (var i = 0; i < character.races.length; i++) {
			character.races[i][1] = load.races[i][1];
		}
		//reset attributes
		for (var i = 0; i < character.attributes.length; i++) {
			character.attributes[i][1] = load.attributes[i][1];
		} 
		//reset Combat Abilities
		for (var i = 0; i < character.combatAbilities.length; i++) {
			character.combatAbilities[i][1] = load.combatAbilities[i][1];
		}
		//reset Civil Abilities
		for (var i = 0; i < character.civilAbilities.length; i++) {
			character.civilAbilities[i][1] = load.civilAbilities[i][1];
		}
		//reset Talents
		for (var i = 0; i < character.talents.length; i++) {
			character.talents[i][1] = load.talents[i][1];
		}
		//reset character tags
		for (var i = 0; i < character.tags.length; i++) {
			character.tags[i][1] = load.tags[i][1];
		}
		setTags();
	}

	$(".saveButton").on("click", function() {
		saveCharacter();
	});

	$(".loadButton").on("click", function() {
		loadCharacter();
	});

	$(".randomButton").on("click", function() {
		reset();
		randLevelOne();
		randSetLevel();
		setTags();
	});

	$(".levelUpButton").on("click", function() {
		randLevelUp();
		setTags();
	})

})