import { wordList } from "@/content/words";

function sortAssets(assets) {
  return Object.entries(assets)
    .sort(([pathA], [pathB]) => pathA.localeCompare(pathB, undefined, { numeric: true }))
    .map(([, url]) => url);
}

const defaultImageModules = import.meta.glob("../assets/pics/*.{png,jpg,jpeg,webp,avif}", {
  eager: true,
  import: "default",
});

const aiImageModules = import.meta.glob("../assets/svgs/*.svg", {
  eager: true,
  import: "default",
});

export const defaultImageCards = sortAssets(defaultImageModules).map((value) => ({
  type: "image",
  value,
}));

export const aiImageCards = sortAssets(aiImageModules).map((value) => ({
  type: "image",
  value,
}));

export const wordsCards = wordList.map((value) => ({
  type: "text",
  value,
}));
