// Game variables that never change
const GAME_SETTINGS = {

	// Size of draft that player can create
	DRAFT_SIZE: 5,

	// Random cards available for selection when building draft
	RANDOM_CARDS_COUNT: 7,
};

// Graphics related variables
const GRAPHICS_SETTINGS = {

	// Key codes to play the game
	// Each key code corresponds to card at index
	// e.g. Card at index 2 -> Selectable via "E"
	PLAYING_KEY_CODES: ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],

	// Size of cards descriptor body
	CARD_DESCRIPTOR_WIDTH: 300,

	// All available card and year combinations with a corresponding image
	CARD_IMAGE_NAMES: ["Cesnica2017", "Gilcatmey2017", "Mrchewypants2017", "Ninjafood2017", "Onkei2017", "Pie2017", "Rarerere2017", "Santaishcool2017", "Rightway2017", "Jayheather2017", "Cesnica2016", "Gilcatmey2016", "Loqocious2016", "Ptdawesome2017", "Poderosocta2017", "Loqocious2017", "Kaoruko2017", "Absolbr2017", "Santaishcool2016", "Onkei2014"],

	// Count of all of the card borders available for usage (used in loading)
	CARD_BORDERS_AVAILABLE: 6
};

// Image storage variables
let bottomDividerImage,
	cardBorderImages = [],
	cardMiceImages = [];

// Storing cards available to use in building the drafts
let csvCardsFile,
	originalCardsListing = [],
	cards = [];

// For storing game state data !
let gameState,
	waitingForNextRound = true;

/**
 * Perform any loading operations here.
 */
function preload() {

	// Card statistics file
	csvCardsFile = loadTable('/Souper-Card-Game-2016/data/newstats.txt', 'csv');

	// Bottom game divider image
	bottomDividerImage = loadImage('/Souper-Card-Game-2016/images/others/bottomDividerImage.png');

	// Card borders
	for (let i = 0; i < GRAPHICS_SETTINGS.CARD_BORDERS_AVAILABLE; i += 1) {
		cardBorderImages[i] = loadImage(`/Souper-Card-Game-2016/images/others/border${i}.png`);
	};

	// Card images
	for (let j = 0; j < GRAPHICS_SETTINGS.CARD_IMAGE_NAMES.length; j += 1) {
		cardMiceImages[j] = loadImage(`/Souper-Card-Game-2016/images/cards/${GRAPHICS_SETTINGS.CARD_IMAGE_NAMES[j]}.png`);
	};

	cardMiceImages[GRAPHICS_SETTINGS.CARD_IMAGE_NAMES.length + 1] = loadImage('/Souper-Card-Game-2016/images/others/stock.png');
}

/**
 * Startup function after preloading.
 */
function setup() {

	canvas = createCanvas(1000, 600);
	canvas.parent('#canvas')

	startGame();
};

/**
 * Must be kept so the game continuously draws the graphics whenever required.
 */
function draw() {

};

/**
 * Resets the cards listing available for usage throughout the drafting phase.
 */
function resetCardsAvailableForPlay(cardsListing, originalCardsListing) {
	if (originalCardsListing.length === 0) {
		buildCardsListing(cardsListing, csvCardsFile);
		originalCardsListing = cardsListing.slice();
	};

	cardsListing = originalCardsListing.slice();
};

/**
 * Initializes default graphic settings.
 */
function initializeGameGraphics(player) {
	frameRate(30);
	textAlign(CENTER);
};

/**
 * Displays a text at the top of the game screen.
 */
function displayText(player, textToDisplay) {
	fill(0, 100);
	rect(0, 0, width, 40);

	fill(82, 173, 152);
	textSize(16);

	// Always display the draft's rating and chemistry
	const displayStr = `${textToDisplay} (Rating: ${player.getTotalRating()}, Chemistry: ${player.getTotalChemistry()})`;
	text(displayStr, width / 2, 25);
};

/**
 * Draws the default background for the game screen.
 */
function drawBackground() {
	background(106, 116, 149);

	fill(0, 100);
	line(width - GRAPHICS_SETTINGS.CARD_DESCRIPTOR_WIDTH, 300, width, 300);
	rect(width - GRAPHICS_SETTINGS.CARD_DESCRIPTOR_WIDTH, 40, GRAPHICS_SETTINGS.CARD_DESCRIPTOR_WIDTH, 360);
	// rect(0, (height / 2) + 100, width, (height / 2) - 100);
	image(bottomDividerImage, -5, (height / 2) + 100, width + 10, (height / 2) - 95);
};

/**
 * Retrieves the image to be used for the card display.
 */
function getCardImage(cardImgStr) {

	// By default, use the stock image (last element of array.)
	let img = cardMiceImages[cardMiceImages.length - 1];

	for (let i = 0; i < GRAPHICS_SETTINGS.CARD_IMAGE_NAMES.length; i += 1) {
		if (GRAPHICS_SETTINGS.CARD_IMAGE_NAMES[i] === cardImgStr) {
			img = cardMiceImages[i];
			break;
		};
	};

	return img;
};

/**
 * Draws a single individual card.
 */
function drawCard(card, x, y) {
	const cardImgStr = `${card.name}${card.year}`;

	// Mouse picture
	tint(255, 180);
	image(getCardImage(cardImgStr), x + 10, y + 140, 85, 120);

	// Card name
	fill(250);
	textSize(9);
	text(`~ ${card.name} ~`, x + 50, y + 155);

	// Card rating
	fill(250);
	textSize(18);
	text(`~ ${card.rating} ~`, x + 50, y + 180);

	// Selecting which border to use for the card based on the rating.
	let index = 0;
	if (card.rating >= 90) {
		index = floor(random(4, cardBorderImages.length - 1));
	} else if (card.rating >= 80) {
		index = 3;
	} else if (card.rating >= 70) {
		index = 2;
	} else if (card.rating >= 60) {
		index = 1;
	} else {
		index = 0;
	};

	// Card border
	tint(255, 255);
	image(cardBorderImages[index], x, y + 120, 100, 160);
};

/**
 * Draws the random selection of cards available to the player for selection to the draft.
 */
function drawRandomDraft(player) {

	// These coordinate values will be used to determine where each card will be drawn.
	let x = 20,
		y = height / 2;

	// Drawing the cards in the random selection.
	for (let i = 0; i < GAME_SETTINGS.RANDOM_CARDS_COUNT; i += 1) {
		const card = player.randomDraft[i];
		drawCard(card, x, y);

		textSize(9);
		text(GRAPHICS_SETTINGS.PLAYING_KEY_CODES[i], x + 50, y + 165);
		x += 140;
	};
};

/**
 * Draws the current draft for the player.
 */
function drawCurrentDraft(player) {
	
	// These coordinate values will be used to determine where each card will be drawn.
	let x = 20,
		y = 20;

	// Drawing the cards in the draft.
	let cardStats = "";
	for (let i = 0; i < player.currentDraftSize; i += 1) {
		const card = player.currentDraft[i];
		drawCard(card, x, y);

		const cardNameStr = card.title !== "" ? `${card.title} ${card.name} (${card.year})` : `${card.name} (${card.year})`;
		cardStats += `\n\n\n~${cardNameStr}~\nMain Server: ${card.msrv}, Living Continent: ${card.lvct}, Personality Influence: ${card.prif}`
		x += 140;
	};

	// Showing chemistry statistics for the current draft on the sidebar.
	fill(255);
	textSize(9);
	text(cardStats, width - (GRAPHICS_SETTINGS.CARD_DESCRIPTOR_WIDTH / 2), 40);
};

/**
 * Function ran when after preloading, to initialize graphics and starts game state.
 */
function startGame() {

	// Initialize cards and player data
	resetCardsAvailableForPlay(cards, originalCardsListing);
	gameState = new Game(GAME_SETTINGS.DRAFT_SIZE, GAME_SETTINGS.RANDOM_CARDS_COUNT);

	// Initialize graphics
	initializeGameGraphics();
	drawBackground();
	displayText(gameState, "Let's begin building a draft of mice !");

	// Start the first round!
	waitingForNextRound = false;
	gameState.startRound(cards);
	drawRandomDraft(gameState);
	drawCurrentDraft(gameState);
};

/**
 * Displays the currently selected card on hand's statistics on the right.
 */
function displayCardStatistics(player) {
	const card = player.selectedCard;

	fill(255);
	textSize(9);

	const cardNameStr = card.title !== "" ? `${card.title} ${card.name} (${card.year})` : `${card.name} (${card.year})`,
		cardStr = `You have selected this card;\n~${cardNameStr}~\nMain Server: ${card.msrv}, Living Continent: ${card.lvct}, Personality Influence: ${card.prif}`;
	
	text(cardStr, width - (GRAPHICS_SETTINGS.CARD_DESCRIPTOR_WIDTH / 2), 340);
};

/**
 * Continues game state, notifies system that a card has been selected and display its statistics to ready for addition to draft.
 */
function selectedCardInRound(thisCard, _key) {
	gameState.viewingCard(thisCard, _key);

	drawBackground();
	drawRandomDraft(gameState);
	drawCurrentDraft(gameState);
	displayText(gameState, "You have selected a card !")
	displayCardStatistics(gameState);
};

/**
 * Continues game state and moves onto the next round of building the draft.
 */
function continueGame() {
	gameState.startRound(cards);

	drawBackground();
	drawRandomDraft(gameState);
	drawCurrentDraft(gameState);
	displayText(gameState, "A new round has started !");
};

/**
 * Ends game state progression and waits for the initialization for the next draft building.
 */
function finishGame() {

	// Variable to notify on keyboard press to start new game !
	waitingForNextRound = true;

	drawBackground();
	drawCurrentDraft(gameState);
	displayText(gameState, "You have finished the draft ! Select any key to progress.");

	gameState.endDraft();
};

/**
 * Continues game state, notifies system to add the selected card to draft and move onto the next round.
 */
function addedCardToDraftInRound() {
	gameState.addCardToDraft();
	gameState.doneRound();

	if (!gameState.finishedDraft()) {
		// Not finished with draft
		// -> Move onto next round

		continueGame();
	} else {
		// Finished with draft
		// -> Move onto waiting room for next draft
		// -> Must press key to start new game

		finishGame();
	};
};

/**
 * Restarts the game state and initializes a new round of draft building.
 */
function restartGame() {

	waitingForNextRound = false;

	resetCardsAvailableForPlay(cards, originalCardsListing);
	gameState.startRound(cards);

	drawBackground();
	drawRandomDraft(gameState);
	drawCurrentDraft(gameState);
	displayText(gameState, "A new draft has started !")
};

/**
 * Progresses the game state
 * i.e. selects or adds the card from the random selection of cards to add to the draft.
 */
function selectOrAddCardFromRandomCards() {

	// Check if the game is already finished, ifso, pressing any key will start new round.
	if (waitingForNextRound) {
		restartGame();
		return;
	};

	const _key = key.toUpperCase();
	let thisCard = new Card(),
		isPlayableKey = false;

	// Ensuring that the key clicked is a playable key
	for (let i = 0; i < GAME_SETTINGS.RANDOM_CARDS_COUNT; i += 1) {
		if (_key === GRAPHICS_SETTINGS.PLAYING_KEY_CODES[i]) {
			thisCard = gameState.randomDraft[i];
			isPlayableKey = true;
			break;
		};
	};

	if (!isPlayableKey) {
		return;
	};

	// Determining the next action
	// -> Select card and show its statistics or..
	// -> Add card to draft and move onto the next round!

	if (!gameState.isViewingCardOnHand(_key)) {
		// Not selected card
		// -> Select card and show card statistics

		selectedCardInRound(thisCard, _key);
	} else {
		// Selected card already
		// -> Add card to draft and move onto the next round

		addedCardToDraftInRound();
	};
};

/**
 * Triggered when a keyboard action is detected.
 */
function keyPressed() {
	selectOrAddCardFromRandomCards();
};