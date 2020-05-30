/**
 * Calculates the individual ratings for each card and adds them to the incoming array.
 */
function buildCardsListing(cards, csvCardsFile) {

	for (let i = 0; i < csvCardsFile.getRowCount(); i += 1) {
		const row = csvCardsFile.getRow(i),
			name = row.get(0),
			year = row.get(1),
			invd = float(row.get(2)),
			tmwk = float(row.get(3)),
			sklp = float(row.get(4)),
			preh = float(row.get(5)),
			gmit = float(row.get(6)),
			surv = float(row.get(7)),
			race = float(row.get(8)),
			ffa = float(row.get(9)),
			msrv = row.get(10),
			lvct = row.get(11),
			prif = float(row.get(12)),
			title = row.get(13);

		cards[i] = new Card(name, year, invd, tmwk, sklp, preh, gmit, surv, race, ffa, msrv, lvct, prif, title);
	};
};

/**
 * Card class for storing data about an individual card in a draft, performing automatic individual rating calculation.
 */
class Card {

	constructor(name, year, invd, tmwk, sklp, preh, gmit, surv, race, ffa, msrv, lvct, prif, title) {
		this.name = name;
		this.year = year;
		this.rating = this.individualCardRating(invd, tmwk, sklp, preh, gmit, surv, race, ffa);

		// Card sorting determant stats.
		this.invd = invd;
		this.tmwk = tmwk;
		
		// Chemistry-related card stats.
		this.msrv = msrv;
		this.lvct = lvct;
		this.prif = prif;

		// Other coolio stats
		this.title = title ? title : "";
	};

	individualCardRating = (invd, tmwk, sklp, preh, gmit, surv, race, ffa) => {
		return floor((((invd + tmwk + sklp) / 8.0) + (((preh + gmit) / 10.0) + ((surv + race + ffa) / 14.0))) * (12.54298642534));
		// return floor(((invd + tmwk + sklp) * 1.5) + (preh * 1.2 + gmit * 0.8) + ((surv + race + ffa) * 1.15))
	};
};