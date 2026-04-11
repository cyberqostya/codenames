import { defineStore } from "pinia";
import { words } from "@/stores/words";
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
      { title: "Words", quantity: words.length, randomResources: [] },
      { title: "Default Pictures", quantity: 278, randomResources: [] },
      { title: "Google AI Pictures", quantity: 351, randomResources: [] },
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
      this.resources.forEach((i) => {
        const randomIndexesArray = shuffle(
          Array(i.quantity)
            .fill(0)
            .map((_, ind) => ind + 1)
        );

        if (i.title === "Default Pictures") i.randomResources = randomIndexesArray.map((i) => `/pics/pic${i}.png`);
        else if (i.title === "Google AI Pictures") i.randomResources = randomIndexesArray.map((i) => `/svgs/pic${i}.svg`);
        else if (i.title === "Words") i.randomResources = randomIndexesArray.map((i) => words[i]);
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
            .concat(this.resources[2].randomResources.toSpliced(lastCardsQuantity))
        );
      }

      this.board = Array(this.columns * this.rows).fill(0).map((i, ind) => ({
        type: arrayOfResources[ind].match(/svg|png/) ? "image" : "text",
        value: arrayOfResources[ind],
      }))

      this.setCapitansKey();
      this.setActiveCards();
    },
    setCapitansKey() {
      const cardsInTeam = Math.floor((this.columns * this.rows - this.DEAD_WORDS) / 3);
      const cardsInFirstMoveTeam = cardsInTeam + 1;
      const commonCards = this.columns * this.rows - this.DEAD_WORDS - cardsInFirstMoveTeam - cardsInTeam;

      // Логика на 2 команды
      // Первая команда всегда ходит и имеет на 1 карточку больше
      // А имя команды присваивается случайно

      const names = ["red", "blue"].sort(() => Math.random() - 0.5);
      const randomCapitansKeyArray = shuffle(
        Array(cardsInFirstMoveTeam)
          .fill(names[0])
          .concat(Array(cardsInTeam).fill(names[1]))
          .concat(Array(this.DEAD_WORDS).fill("black"))
          .concat(Array(commonCards).fill("common"))
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
    // changeColRow(aim, operation) {
    //   // 'columns', -1
    //   this[aim] = Math.min(this.MAX_COLUMNS, Math.max(this.MIN_COLUMNS, this[aim] + operation));

    //   this.setBoard();
    // },
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
