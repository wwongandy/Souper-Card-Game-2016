let csvCardsFile,
	cards = [];

/**
 * Perform any loading operations here.
 */
function preload() {
	csvCardsFile = loadTable('/Souper-Card-Game-2016/data/newstats.txt', 'csv');
};

/**
 * Startup function after preloading.
 */
function setup() {
	buildCardsListing(cards, csvCardsFile);
	printCardsToPage(cards);
};

/**
 * Compares two individual cards and checks which one has a better individual and teamworking rating.
 */
function compareCardRatings(card1, card2) {
	let rating1 = card1.rating,
		rating2 = card2.rating;

	if (rating1 === rating2) {
		rating1 = card1.invd + card1.tmwk;
		rating2 = card2.invd + card2.tmwk;
	};
	
	return rating2 - rating1;
};

/**
 * Prints the loaded cards onto the page by highest rating.
 */
function printCardsToPage(cards) {

	// Sort cards by highest rating
	cards.sort(compareCardRatings);

	// For each card, create a <p> element on the page and display its data
	for (let i = 0; i < cards.length; i += 1) {
		const { name, year, rating, lvct, msrv, prif, title } = cards[i];
		
		let cardStr =
			`<b>${i+1})
			${title != "" ? `${title}` : ""} ${name} (${year})</b><br>
			Rating: ${rating},<br>
			Living Continent: ${lvct}, Main Server: ${msrv}, Personality Influence: ${prif}`;

		const cardDiv = createP(cardStr);
		cardDiv.class('card');
		cardDiv.parent('#listCards');
	};
};