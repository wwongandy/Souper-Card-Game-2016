/**
 * Game class for handling the game state.
 */
function Game(maxDraftSize, maxRandomCardsAvailableCount) {

	// Game state variables

	// Draft variables
	this.currentDraftSize = 0;
	this.currentDraft = [];

	// Round variables
	this.selectedCard = new Card();
	this.selectedCardKey = "Z";
	this.randomDraft = [];

	/**
	 * Updates the random cards available for building the draft for this round.
	 */
	this.getRandomCards = function(cardsListing) {
		this.randomDraft = [];

		// Duplicate the master cards listing for local variable manipulation
		let newCardsList = cardsListing.slice();
		
		// Preventing cards from the current draft to be in the random draft list.
		newCardsList = newCardsList.filter(function(card) {
			for (let i = 0; i < this.currentDraftSize; i += 1) {
				if (this.currentDraft[i].name === card.name) {
					return false;
				};
			};

			return true;
		});

		// Selecting the random cards
		for (let i = 0; i < maxRandomCardsAvailableCount; i += 1) {
			const randIndex = floor(random(newCardsList.length)),
				card = newCardsList[randIndex];
			
			this.randomDraft[i] = card;
			newCardsList.splice(randIndex, 1);
		};
	};

	/**
	 * Initializes a new round of the card game, retrieves a set of random cards for addition to the draft.
	 */
	this.startRound = function(cardsListing) {
		this.getRandomCards(cardsListing);
	};

	/**
	 * Checks if the given card is already being selected on hand.
	 */
	this.isViewingCardOnHand = function(cardKey) {
		return this.selectedCardKey == cardKey;
	};

	/**
	 * Adds the given card as the currently selected card on hand.
	 */
	this.viewingCard = function(card, cardKey) {
		this.selectedCard = card;
		this.selectedCardKey = cardKey;
	};

	/**
	 * Adds the currently selected card to draft.
	 */
	this.addCardToDraft = function() {
		this.currentDraft.push(this.selectedCard);
		this.currentDraftSize += 1;
	};

	/**
	 * Notifies that the round of the card game is finished.
	 */
	this.doneRound = function() {
		this.selectedCard = new Card();
		this.selectedCardKey = "Z";
	};

	/**
	 * Checks if the draft is finished building.
	 */
	this.finishedDraft = function() {
		return this.currentDraftSize >= maxDraftSize;
	};

	/**
	 * Notifies that the draft is finished for this instance of the card game -> resets variables.
	 */
	this.endDraft = function() {
		this.currentDraftSize = 0;
		this.currentDraft = [];
		this.selectedCard = new Card();
		this.selectedCardKey = "Z";
		this.randomDraft = [];
	};

	/**
	 * Retrieves the highest rated card from the draft.
	 */
	this.getHighestRatedCard = function() {
		let highestRatedCard = { rating: 0 };

		for (let i = 0; i < this.currentDraftSize; i += 1) {
			const card = this.currentDraft[i];

			if (card.rating >= highestRatedCard.rating) {
				highestRatedCard = card;
			};
		};

		return highestRatedCard;
	};

	/**
	 * Retrieves the total rating for the entire draft.
	 */
	this.getTotalRating = function() {
		// 1. Average Rating
		let summedRatings = 0;
		this.currentDraft.forEach(function(card) {
			summedRatings += card.rating;
		});
	
		const averageRating = summedRatings / this.currentDraftSize;
		
		// 2. Correction Factor
		let correctionFactor = 0;
		this.currentDraft.forEach(function(card) {
			if (card.rating > averageRating) {
				correctionFactor += (card.rating - averageRating);
			};
		});
	
		// 3. Overall Rating
		// Final step
		const overallRating = (summedRatings + correctionFactor) / this.currentDraftSize;

		return isNaN(overallRating) ? 0 : floor(overallRating);
	};

	/**
	 * Retrieves the total chemistry for the entire draft.
	 * 
	 * edit from 25/05/20: Honestly I have no idea what's going on here...
	 */
	this.getTotalChemistry = function() {
		let mainMsrvCount = 0,
			mainLvctCount = 0,
			totalPrif = 0,
			similarityPoints = 0,
			similarityTable = []

		// MSRV and LVCT draft metadata storage
		const MSRV_CORRESPONDANCE = { "E1": 0, "E2": 1, "BR": 2, "TR": 3 },
			LVCT_CORRESPONDANCE = { "EU": 0, "NA": 1, "AS": 2, "AF": 3, "LA": 4 };
		let msrvCount = [0, 0, 0, 0, 0],
			lvctCount = [0, 0, 0, 0, 0];

		for (let i = 0; i < this.currentDraftSize; i += 1) {
			const { msrv, lvct, prif, invd, tmwk } = this.currentDraft[i];

			const _msrv = MSRV_CORRESPONDANCE[msrv],
				_lvct = LVCT_CORRESPONDANCE[lvct];
			msrvCount[_msrv] += 1;
			lvctCount[_lvct] += 1;

			totalPrif += prif;
			similarityTable[i] = invd + tmwk;
		};

		// If a card has a similarity link with another, you get a similarity point to distribute.
		for (let i = 0; i < similarityTable.length; i += 1) {
			for (let j = i; j < similarityTable.length; j += 1) {

				if (similarityTable[i] && similarityTable[j] && i !== j) {
					const similarityLink = abs(similarityTable[i] - similarityTable[j]);
					
					if (similarityLink <= 1) {
						similarityPoints += 1;
					};
				};
			};
		};

		// Finding the most populous MSRV
		for (let i = 0; i < msrvCount.length; i += 1) {
			let greaterThanOtherCounts = true;
			
			for (let j = 0; j < msrvCount.length; j += 1) {
				if (i !== j) {
					if (msrvCount[i] < msrvCount[j]) {
						greaterThanOtherCounts = false;
					};
				};
			};

			if (greaterThanOtherCounts) {
				mainMsrvCount = msrvCount[i];
				break;
			};
		};

		// Finding the most populous LVCT
		for (let i = 0; i < lvctCount.length; i += 1) {
			let greaterThanOtherCounts = true;
			
			for (let j = 0; j < lvctCount.length; j += 1) {
				if (i !== j) {
					if (lvctCount[i] < lvctCount[j]) {
						greaterThanOtherCounts = false;
					};
				};
			};

			if (greaterThanOtherCounts) {
				mainLvctCount = lvctCount[i];
				break;
			};
		};

		// Adjusting personality influence factor, ideal value => 30
		if (totalPrif < 10) {
			totalPrif = 10;
		} else if (totalPrif > 30) {
			totalPrif = 60 - totalPrif;
		};

		// Distributing the similarity points to the chemistry variables.
		if (mainLvctCount !== maxDraftSize && similarityPoints !== 0) {
			const diff = maxDraftSize - mainLvctCount;
			if (similarityPoints >= diff) {
				mainLvctCount += diff;
				similarityPoints -= diff;
			};
		};

		if (mainMsrvCount !== maxDraftSize && similarityPoints !== 0) {
			const diff = maxDraftSize - mainMsrvCount;
			if (similarityPoints >= diff) {
				mainMsrvCount += diff;
				similarityPoints -= diff;
			};
		};

		console.log(mainLvctCount);
		console.log(mainMsrvCount);
		console.log(totalPrif);

		return floor((mainLvctCount * mainMsrvCount * totalPrif) / 7.5);
	};
};