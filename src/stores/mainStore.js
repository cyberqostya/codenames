import { defineStore } from "pinia";
import {
  aiImageCards,
  defaultImageCards,
  wordsCards,
} from "@/content/resources";
import shuffle from "@/utils/shuffle";

export const useMainStore = defineStore("mainStore", {
  state: () => ({
    isSettingsOpened: false,

    DEAD_CARDS: 1,
    MIN_COLUMNS: 3,
    MAX_COLUMNS: 6,

    // По умолчанию
    columns: 5,
    rows: 4,
    teamNames: [],

    // Просчитываем сразу все игровые поля (разные ресурсы),
    // чтобы на лету можно было менять размеры, тип поля
    resources: [
      {
        title: "Words",
        sourceCards: wordsCards,
        isActive: false,
      },
      {
        title: "Default",
        sourceCards: defaultImageCards,
        isActive: true,
      },
      {
        title: "AI",
        sourceCards: aiImageCards,
        isActive: false,
      },
      {
        title: "Mix",
        isActive: false,
      },
    ],

    isCapitansMode: false,
    isChangeCapitansMap: false,
    isReshuffleCards: false,
  }),

  getters: {
    activeResource: (state) => state.resources.find((r) => r.isActive),
  },

  actions: {
    createBoards() {
      const cardsQuantity = this.columns * this.rows;

      // Заполняем каждое игровое поле ресурсов перемешанными ресурсами
      // Добавляя свойство "board"
      this.resources.forEach((resource) => {
        if (resource.title != "Mix") {
          resource.board = shuffle([...resource.sourceCards])
            .slice(0, cardsQuantity)
            .map((card) => ({ ...card }));
        } else {
          // Для Микса
          const uniqCardsQuantity = Math.floor(cardsQuantity / 3);
          const lastCardsQuantity = cardsQuantity - 2 * uniqCardsQuantity;
          const res1 = [...this.resources[0].sourceCards]
            .slice(0, uniqCardsQuantity)
            .map((card) => ({ ...card }));
          const res2 = [...this.resources[1].sourceCards]
            .slice(0, uniqCardsQuantity)
            .map((card) => ({ ...card }));
          const res3 = [...this.resources[2].sourceCards]
            .slice(0, lastCardsQuantity)
            .map((card) => ({ ...card }));
          resource.board = shuffle(res1.concat(res2).concat(res3));
        }
      });

      this.setCapitansKey();

      // console.log(this.resources);
    },

    setCapitansKey() {
      const cardsQuantity = this.columns * this.rows;

      const cardsInTeam = Math.floor(cardsQuantity / 3);
      const t1 = cardsInTeam + 1;
      const t2 = cardsInTeam;
      const t3 = cardsQuantity - t1 - t2 - this.DEAD_CARDS;

      // Кто первый ходит
      this.teamNames = shuffle(["red", "blue"]).concat(["common"]);

      const randomCapitansKeyArray = shuffle(
        Array(t1)
          .fill(this.teamNames[0])
          .concat(Array(t2).fill(this.teamNames[1]))
          .concat(Array(t3).fill(this.teamNames[2]))
          .concat(Array(this.DEAD_CARDS).fill("black")),
      );

      this.resources.forEach((resource) => {
        resource.board.forEach((cell, ind) => {
          cell.team = randomCapitansKeyArray[ind];
          cell.isActive = false;
        });
      });
    },

    // setings
    openSettings() {
      this.isSettingsOpened = true;
    },
    closeSettings() {
      this.isSettingsOpened = false;
      this.closeCapitansMode();
      this.closeIsChangeCapitansMap();
      this.closeIsReshuffleCards();
    },

    setColumns(val) {
      this.columns = val;
    },
    setRows(val) {
      this.rows = val;
    },

    setActiveResource(resource) {
      this.resources.find((i) => i.isActive).isActive = false;
      resource.isActive = true;
    },

    toggleCapitansMode() {
      this.isCapitansMode = !this.isCapitansMode;
    },
    closeCapitansMode() {
      this.isCapitansMode = false;
    },

    toggleIsChangeCapitansMap() {
      this.isChangeCapitansMap = !this.isChangeCapitansMap;
    },
    closeIsChangeCapitansMap() {
      this.isChangeCapitansMap = false;
    },

    toggleIsReshuffleCards() {
      this.isReshuffleCards = !this.isReshuffleCards;
    },
    closeIsReshuffleCards() {
      this.isReshuffleCards = false;
    },
  },
});
