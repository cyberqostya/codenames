import { defineStore } from "pinia";
import { aiImageCards, defaultImageCards, wordsCards } from "@/content/resources";
import shuffle from "@/utils/shuffle";

export const useMainStore = defineStore("mainStore", {
  state: () => ({
    isSettingsOpened: false,
    DEAD_WORDS: 1,

    MIN_COLUMNS: 2,
    MAX_COLUMNS: 6,
    columns: 5,
    rows: 4,

    // [{type: 'text', value: 'Пригорок', isActive: false, team: 'red' }]
    board: [],

    activeResourceIndex: 0,
    resources: [
      {
        title: "Words",
        sourceCards: wordsCards,
        randomResources: [],
      },
      {
        title: "Default",
        sourceCards: defaultImageCards,
        randomResources: [],
      },
      {
        title: "Google AI",
        sourceCards: aiImageCards,
        randomResources: [],
      },
      { title: "Mix", randomResources: [] },
    ],

    isCapitansMode: false,
  }),

  actions: {
    init() {
      this._createRandomResourcesArrays();
      this.setActiveResourceIndex(Math.floor(Math.random() * (this.resources.length - 1)));
      this.setBoard();
    },
    _createRandomResourcesArrays() {
      this.resources.forEach((resource) => {
        if (!resource.sourceCards) return;
        resource.randomResources = shuffle([...resource.sourceCards]);
      });
    },
    setActiveResourceIndex(index) {
      this.activeResourceIndex = index;
    },
    setBoard() {
      const resource = this.resources[this.activeResourceIndex];
      let arrayOfResources = resource.randomResources.toSpliced(this.columns * this.rows);

      // Mix
      if (resource.title === "Mix") {
        const uniqCardsQuantity = Math.floor((this.columns * this.rows) / 3);
        const lastCardsQuantity = this.columns * this.rows - 2 * uniqCardsQuantity;

        arrayOfResources = shuffle(
          this.resources[0].randomResources
            .toSpliced(uniqCardsQuantity)
            .concat(this.resources[1].randomResources.toSpliced(uniqCardsQuantity))
            .concat(this.resources[2].randomResources.toSpliced(lastCardsQuantity)),
        );
      }

      this.board = arrayOfResources.map((card) => ({ ...card }));

      this.setCapitansKey();
      this.setActiveCards();
    },
    setCapitansKey() {
      const cardsInTeam = Math.floor((this.columns * this.rows - this.DEAD_WORDS) / 3);
      const cardsInFirstMoveTeam = cardsInTeam + 1;
      const commonCards = this.columns * this.rows - this.DEAD_WORDS - cardsInFirstMoveTeam - cardsInTeam;

      const names = ["red", "blue"].sort(() => Math.random() - 0.5);
      const randomCapitansKeyArray = shuffle(
        Array(cardsInFirstMoveTeam).fill(names[0]).concat(Array(cardsInTeam).fill(names[1])).concat(Array(this.DEAD_WORDS).fill("black")).concat(Array(commonCards).fill("common")),
      );

      this.board.forEach((i, ind) => (i.team = randomCapitansKeyArray[ind]));
    },
    setActiveCards() {
      this.board.forEach((i) => (i.isActive = false));
    },

    // setings
    toggleSettings() {
      this.isSettingsOpened = !this.isSettingsOpened;
      this.offCapitansMode();
    },
    closeSettings() {
      this.isSettingsOpened = false;
    },
    setColRow(aim, value) {
      this[aim] = value;
      this.setBoard();
    },

    toggleCapitansMode() {
      this.isCapitansMode = !this.isCapitansMode;
    },
    offCapitansMode() {
      this.isCapitansMode = false;
    },

    // game
    startGame() {
      this.closeSettings();
    },
  },
});
